import { reactive, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { CameraMode, CameraPose, SimulationParams, Telemetry } from '@/types/simulation'
import {
  escapeVelocityFraction,
  orbitalVelocityFraction,
  timeDilation,
  kerrIscoRs,
  schwarzschildRadiusKm,
  hawkingTemperatureK,
  tidalVerdict,
  toDegrees,
  clamp,
  PHOTON_SPHERE,
  SHADOW_RADIUS,
} from '@/utils/math'
import { damp } from '@/utils/easing'

const ORBIT_MIN = 2.4
const ORBIT_MAX = 80
const FLY_MIN = 1.6
const FLY_MAX = 140
const LOOK_SENSITIVITY = 0.0022
const MOVE_KEYS = new Set([
  'w', 'a', 's', 'd', 'e', 'q', ' ', 'control', 'shift',
  'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
])

/**
 * Two exploration modes over one PerspectiveCamera:
 *  - orbit: OrbitControls locked to the singularity (drag + dolly)
 *  - fly:   pointer-lock mouse-look + WASD/space/ctrl with momentum
 * Also derives live mission telemetry from the camera's distance.
 */
export function useCameraControls(camera: THREE.PerspectiveCamera, params: SimulationParams) {
  const mode = ref<CameraMode>('orbit')
  const pointerLocked = ref(false)
  const flySpeed = ref(5)
  const moving = ref(false)

  const telemetry = reactive<Telemetry>({
    distanceRs: camera.position.length(),
    distanceKm: 0,
    distanceAu: 0,
    timeDilation: 1,
    orbitalVelocity: 0,
    escapeVelocity: 0,
    azimuth: 0,
    elevation: 0,
    fov: params.fov,
    fps: 60,
    mode: 'orbit',
    insidePhotonSphere: false,
    proximityWarning: false,
    schwarzschildKm: schwarzschildRadiusKm(params.massSolar),
    hawkingTempK: hawkingTemperatureK(params.massSolar),
    iscoRs: kerrIscoRs(params.spin),
    photonSphereRs: PHOTON_SPHERE,
    shadowDiameterKm: 0,
    shadowAngularDeg: 0,
    tidalLabel: 'Negligible',
    tidalLethal: false,
  })

  let controls: OrbitControls | null = null
  let external = false
  let lastInput = 0
  const now = () => performance.now()

  // fly state
  const keys = new Set<string>()
  const euler = new THREE.Euler(0, 0, 0, 'YXZ')
  const velocity = new THREE.Vector3()
  const externalTarget = new THREE.Vector3()

  const cleanups: (() => void)[] = []
  function on<K extends keyof DocumentEventMap>(
    target: EventTarget,
    type: K,
    handler: (e: DocumentEventMap[K]) => void,
    opts?: AddEventListenerOptions,
  ) {
    target.addEventListener(type, handler as EventListener, opts)
    cleanups.push(() => target.removeEventListener(type, handler as EventListener, opts))
  }

  function markInput() {
    lastInput = now()
  }

  function attach(element: HTMLElement) {
    controls = new OrbitControls(camera, element)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enablePan = false
    controls.rotateSpeed = 0.75
    controls.zoomSpeed = 0.9
    controls.minDistance = ORBIT_MIN
    controls.maxDistance = ORBIT_MAX
    controls.target.set(0, 0, 0)
    controls.update()

    on(element, 'pointerdown', () => {
      markInput()
      if (mode.value === 'fly' && document.pointerLockElement !== element) {
        element.requestPointerLock?.()
      }
    })
    on(document, 'pointerlockchange', () => {
      pointerLocked.value = document.pointerLockElement === element
    })
    on(document, 'mousemove', (e) => {
      if (mode.value !== 'fly' || !pointerLocked.value) return
      markInput()
      euler.setFromQuaternion(camera.quaternion, 'YXZ')
      euler.y -= e.movementX * LOOK_SENSITIVITY
      euler.x -= e.movementY * LOOK_SENSITIVITY
      euler.x = clamp(euler.x, -Math.PI / 2 + 0.02, Math.PI / 2 - 0.02)
      camera.quaternion.setFromEuler(euler)
    })
    on(document, 'keydown', (e) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      const k = e.key.toLowerCase()
      if (MOVE_KEYS.has(k)) {
        keys.add(k)
        markInput()
        if (mode.value === 'fly') e.preventDefault()
      }
    })
    on(document, 'keyup', (e) => {
      keys.delete(e.key.toLowerCase())
    })
    on(element, 'wheel', (e) => {
      if (mode.value !== 'fly') return
      e.preventDefault()
      flySpeed.value = clamp(flySpeed.value * (e.deltaY < 0 ? 1.12 : 0.89), 0.5, 60)
      markInput()
    }, { passive: false })
    on(element, 'blur', () => keys.clear())
    on(window, 'blur', () => keys.clear())
  }

  function setMode(next: CameraMode) {
    if (next === mode.value) return
    mode.value = next
    telemetry.mode = next
    keys.clear()
    velocity.set(0, 0, 0)
    if (next === 'fly') {
      if (controls) controls.enabled = false
      euler.setFromQuaternion(camera.quaternion, 'YXZ')
    } else {
      if (document.pointerLockElement) document.exitPointerLock?.()
      if (controls) {
        controls.enabled = true
        controls.target.set(0, 0, 0)
        controls.update()
      }
    }
  }

  function clampDistance() {
    const min = mode.value === 'fly' ? FLY_MIN : ORBIT_MIN
    const max = mode.value === 'fly' ? FLY_MAX : ORBIT_MAX
    const r = camera.position.length()
    if (r < min) camera.position.multiplyScalar(min / r)
    else if (r > max) camera.position.multiplyScalar(max / r)
  }

  function integrateFly(dt: number) {
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()
    const move = new THREE.Vector3()
    if (keys.has('w') || keys.has('arrowup')) move.add(forward)
    if (keys.has('s') || keys.has('arrowdown')) move.sub(forward)
    if (keys.has('d') || keys.has('arrowright')) move.add(right)
    if (keys.has('a') || keys.has('arrowleft')) move.sub(right)
    if (keys.has(' ') || keys.has('e')) move.y += 1
    if (keys.has('control') || keys.has('q')) move.y -= 1

    const boost = keys.has('shift') ? 3.2 : 1
    const target =
      move.lengthSq() > 0
        ? move.normalize().multiplyScalar(flySpeed.value * boost)
        : new THREE.Vector3()

    // Frame-rate independent damping toward the target velocity.
    velocity.x = damp(velocity.x, target.x, 6, dt)
    velocity.y = damp(velocity.y, target.y, 6, dt)
    velocity.z = damp(velocity.z, target.z, 6, dt)
    camera.position.addScaledVector(velocity, dt)
    clampDistance()
  }

  function computeTelemetry() {
    const r = camera.position.length()
    telemetry.distanceRs = r
    telemetry.timeDilation = timeDilation(r)
    telemetry.orbitalVelocity = orbitalVelocityFraction(r)
    telemetry.escapeVelocity = escapeVelocityFraction(r)
    telemetry.insidePhotonSphere = r < PHOTON_SPHERE
    telemetry.proximityWarning = r < 3.6
    telemetry.azimuth = Math.atan2(camera.position.z, camera.position.x)
    telemetry.elevation = r > 1e-4 ? Math.asin(clamp(camera.position.y / r, -1, 1)) : 0
    telemetry.fov = params.fov
    telemetry.mode = mode.value

    // Object-aware physical scale.
    const rsKm = schwarzschildRadiusKm(params.massSolar)
    telemetry.schwarzschildKm = rsKm
    telemetry.distanceKm = r * rsKm
    telemetry.distanceAu = (r * rsKm) / 1.495978707e8
    telemetry.hawkingTempK = hawkingTemperatureK(params.massSolar)
    telemetry.iscoRs = kerrIscoRs(params.spin)
    telemetry.shadowDiameterKm = 2 * SHADOW_RADIUS * rsKm
    telemetry.shadowAngularDeg = toDegrees(2 * Math.atan(SHADOW_RADIUS / Math.max(r, 0.01)))
    const tidal = tidalVerdict(params.massSolar, r)
    telemetry.tidalLabel = tidal.label
    telemetry.tidalLethal = tidal.lethal

    moving.value = now() - lastInput < 200 || velocity.lengthSq() > 0.02
  }

  function update(dt: number) {
    if (!external) {
      if (mode.value === 'orbit') controls?.update()
      else integrateFly(dt)
    }
    computeTelemetry()
  }

  // --- external control (director tweens) ---
  function beginExternal() {
    external = true
    if (controls) controls.enabled = false
    if (document.pointerLockElement) document.exitPointerLock?.()
  }
  function endExternal(target?: THREE.Vector3) {
    external = false
    if (target) externalTarget.copy(target)
    if (mode.value === 'orbit' && controls) {
      controls.enabled = true
      controls.target.copy(target ?? new THREE.Vector3(0, 0, 0))
      controls.update()
    } else {
      euler.setFromQuaternion(camera.quaternion, 'YXZ')
    }
  }

  function getPose(): CameraPose {
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    const dist = Math.min(camera.position.length(), 12)
    const tgt = mode.value === 'orbit'
      ? new THREE.Vector3(0, 0, 0)
      : camera.position.clone().addScaledVector(dir, dist)
    return {
      position: [camera.position.x, camera.position.y, camera.position.z],
      target: [tgt.x, tgt.y, tgt.z],
      fov: params.fov,
    }
  }

  function detach() {
    for (const c of cleanups) c()
    cleanups.length = 0
    controls?.dispose()
    controls = null
  }

  return {
    mode,
    pointerLocked,
    flySpeed,
    moving,
    telemetry,
    attach,
    detach,
    setMode,
    update,
    beginExternal,
    endExternal,
    getPose,
  }
}
