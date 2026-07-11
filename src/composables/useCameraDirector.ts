import { ref } from 'vue'
import * as THREE from 'three'
import type { CameraPose, RenderMode, SimulationParams, TourKeyframe } from '@/types/simulation'
import { easeInOutQuart } from '@/utils/easing'
import type { useCameraControls } from './useCameraControls'

type Controls = ReturnType<typeof useCameraControls>

interface DirectorHooks {
  selectObject: (id: string) => void
  applyMode: (mode: RenderMode) => void
  setAnnotate: (on: boolean) => void
}

/**
 * Cinematic camera authority: eased fly-to for viewpoint presets and a
 * chapter-driven guided tour with transport (play/pause/next/prev/jump).
 * Chapters can switch the observed object, flip render mode, and toggle the
 * anatomy overlay via injected hooks. User input is suspended mid-move.
 */
export function useCameraDirector(
  camera: THREE.PerspectiveCamera,
  controls: Controls,
  params: SimulationParams,
) {
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const isTweening = ref(false)
  const title = ref('')
  const caption = ref('')
  const tourIndex = ref(-1)
  const tourTotal = ref(0)

  let hooks: DirectorHooks = { selectObject: () => {}, applyMode: () => {}, setAnnotate: () => {} }
  function configure(h: Partial<DirectorHooks>) {
    hooks = { ...hooks, ...h }
  }

  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  let token = 0
  const startPos = new THREE.Vector3()
  const endPos = new THREE.Vector3()
  const startTgt = new THREE.Vector3()
  const endTgt = new THREE.Vector3()
  const curTgt = new THREE.Vector3(0, 0, 0)
  let startFov = params.fov
  let endFov = params.fov
  let dur = 0
  let elapsed = 0
  let active = false
  let resolveTween: (() => void) | null = null

  function currentLookTarget(): THREE.Vector3 {
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    return camera.position.clone().addScaledVector(dir, camera.position.length())
  }

  function tweenTo(pose: CameraPose, duration: number): Promise<void> {
    // Resolve any prior pending tween so its awaiter unwinds cleanly.
    if (resolveTween) {
      const r = resolveTween
      resolveTween = null
      r()
    }
    return new Promise((resolve) => {
      controls.beginExternal()
      isTweening.value = true
      startPos.copy(camera.position)
      startTgt.copy(curTgt.lengthSq() > 1e-6 ? curTgt : currentLookTarget())
      endPos.set(pose.position[0], pose.position[1], pose.position[2])
      endTgt.set(pose.target[0], pose.target[1], pose.target[2])
      startFov = params.fov
      endFov = pose.fov
      dur = prefersReduced() ? 0.001 : Math.max(duration, 0.001)
      elapsed = 0
      active = true
      resolveTween = resolve
    })
  }

  function tick(dt: number) {
    if (!active) return
    elapsed += dt
    const t = Math.min(elapsed / dur, 1)
    const e = easeInOutQuart(t)
    camera.position.lerpVectors(startPos, endPos, e)
    curTgt.lerpVectors(startTgt, endTgt, e)
    camera.lookAt(curTgt)
    params.fov = startFov + (endFov - startFov) * e
    if (t >= 1) {
      active = false
      isTweening.value = false
      params.fov = endFov
      controls.endExternal(endTgt.clone())
      const r = resolveTween
      resolveTween = null
      r?.()
    }
  }

  /** Fly to a saved vantage point (used by presets); ends any tour. */
  async function goToPose(pose: CameraPose, duration = 2.4, overrides?: Partial<SimulationParams>) {
    stop()
    const my = ++token
    if (overrides) Object.assign(params, overrides)
    await tweenTo(pose, duration)
    if (my !== token) return
  }

  // ---- Chapter-driven tour ----
  let frames: TourKeyframe[] = []
  let holdTimer = 0
  let holdEndsAt = 0
  let holdRemaining = 0

  function applyChapter(kf: TourKeyframe) {
    title.value = kf.title
    caption.value = kf.caption
    if (kf.objectId) hooks.selectObject(kf.objectId)
    if (kf.mode) hooks.applyMode(kf.mode)
    if (kf.annotate !== undefined) hooks.setAnnotate(kf.annotate)
    if (kf.params) Object.assign(params, kf.params)
  }

  function scheduleHold(ms: number, i: number) {
    clearTimeout(holdTimer)
    if (isPaused.value) return
    holdEndsAt = performance.now() + ms
    holdTimer = window.setTimeout(() => {
      if (i + 1 >= frames.length) stop()
      else playChapter(i + 1)
    }, ms)
  }

  async function playChapter(i: number) {
    if (i < 0 || i >= frames.length) return
    clearTimeout(holdTimer)
    const my = ++token
    tourIndex.value = i
    const kf = frames[i]
    applyChapter(kf)
    await tweenTo(kf, kf.duration)
    if (my !== token) return
    scheduleHold(kf.hold * 1000, i)
  }

  function playTour(f: TourKeyframe[]) {
    stop()
    frames = f
    tourTotal.value = f.length
    isPlaying.value = true
    isPaused.value = false
    playChapter(0)
  }

  function pause() {
    if (!isPlaying.value || isPaused.value) return
    isPaused.value = true
    holdRemaining = Math.max(0, holdEndsAt - performance.now())
    clearTimeout(holdTimer)
    holdTimer = 0
  }

  function resume() {
    if (!isPlaying.value || !isPaused.value) return
    isPaused.value = false
    if (!active) scheduleHold(holdRemaining || 2000, tourIndex.value)
  }

  function togglePause() {
    isPaused.value ? resume() : pause()
  }

  function next() {
    if (isPlaying.value) playChapter(tourIndex.value + 1)
  }
  function prev() {
    if (isPlaying.value) playChapter(Math.max(0, tourIndex.value - 1))
  }
  function goToChapter(i: number) {
    if (isPlaying.value) playChapter(i)
  }

  function stop() {
    token++
    clearTimeout(holdTimer)
    holdTimer = 0
    active = false
    isTweening.value = false
    isPlaying.value = false
    isPaused.value = false
    tourIndex.value = -1
    title.value = ''
    caption.value = ''
    controls.endExternal(new THREE.Vector3(0, 0, 0))
  }

  return {
    isPlaying,
    isPaused,
    isTweening,
    title,
    caption,
    tourIndex,
    tourTotal,
    configure,
    tick,
    goToPose,
    playTour,
    pause,
    resume,
    togglePause,
    next,
    prev,
    goToChapter,
    stop,
  }
}
