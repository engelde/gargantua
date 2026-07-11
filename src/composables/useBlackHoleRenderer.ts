import { ref, watch } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import vertexShader from '@/shaders/blackhole.vert.glsl?raw'
import fragmentShader from '@/shaders/blackhole.frag.glsl?raw'
import postfxFragment from '@/shaders/postfx.frag.glsl?raw'
import type { QualityTier, SimulationParams } from '@/types/simulation'

const POSTFX_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * Per-tier cost: ray-march steps AND render-resolution scale. The lensing shader
 * is fill-rate bound (per-pixel disk/starfield noise + bloom), so resolution is
 * the effective lever — lower tiers render fewer pixels and upscale.
 */
export const QUALITY_TIERS: Record<QualityTier, { steps: number; scale: number }> = {
  low: { steps: 110, scale: 0.55 },
  medium: { steps: 170, scale: 0.72 },
  high: { steps: 230, scale: 0.85 },
  ultra: { steps: 300, scale: 1.0 },
}

const DPR_CAP = 2

type UpdateFn = (dt: number) => void

/**
 * Owns the WebGL renderer, the full-screen lensing quad, the HDR bloom chain,
 * and the animation loop. The camera is created here but *driven* externally
 * (by useCameraControls); each frame we read its world basis into uniforms.
 */
export function useBlackHoleRenderer(params: SimulationParams) {
  const camera = new THREE.PerspectiveCamera(params.fov, 1, 0.01, 2000)
  camera.position.set(0, 2.6, 15)
  camera.lookAt(0, 0, 0)

  const fps = ref(60)
  const supported = ref(true)
  const moving = ref(false) // set by controls to drop detail while interacting

  let renderer: THREE.WebGLRenderer | null = null
  let composer: EffectComposer | null = null
  let bloomPass: UnrealBloomPass | null = null
  let postFxPass: ShaderPass | null = null
  let material: THREE.ShaderMaterial | null = null
  let canvasEl: HTMLCanvasElement | null = null
  let raf = 0
  let running = false
  let lastTime = 0
  const updaters: UpdateFn[] = []

  // fps sampling
  let frames = 0
  let fpsAccum = 0

  const uniforms = {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uCamPos: { value: new THREE.Vector3() },
    uCamRight: { value: new THREE.Vector3(1, 0, 0) },
    uCamUp: { value: new THREE.Vector3(0, 1, 0) },
    uCamForward: { value: new THREE.Vector3(0, 0, -1) },
    uTanHalfFov: { value: Math.tan(THREE.MathUtils.degToRad(params.fov) * 0.5) },
    uAspect: { value: 1 },
    uDiskInner: { value: params.diskInner },
    uDiskOuter: { value: params.diskOuter },
    uDiskThickness: { value: params.diskThickness },
    uDiskBrightness: { value: params.diskBrightness },
    uDiskDensity: { value: params.diskDensity },
    uDiskTemp: { value: params.diskTemperature },
    uDiskSpeed: { value: params.diskSpeed },
    uSpin: { value: params.spin },
    uLensing: { value: params.lensing },
    uDoppler: { value: params.doppler },
    uJet: { value: params.jet },
    uMode: { value: params.mode === 'scientific' ? 1 : 0 },
    uStarDensity: { value: params.starDensity },
    uNebula: { value: params.nebula },
    uMaxSteps: { value: QUALITY_TIERS[params.quality].steps },
  }

  function effectiveDpr(): number {
    const tierScale = QUALITY_TIERS[params.quality].scale
    return Math.min(window.devicePixelRatio || 1, DPR_CAP) * params.renderScale * tierScale
  }

  function mount(canvas: HTMLCanvasElement): boolean {
    canvasEl = canvas
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      })
    } catch {
      supported.value = false
      return false
    }
    if (!renderer.capabilities.isWebGL2) {
      // Runs on WebGL1 too, but we prefer WebGL2; still allow it.
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = params.exposure

    const scene = new THREE.Scene()
    const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    quad.frustumCulled = false
    scene.add(quad)

    // HDR render target so bloom sees values > 1.
    const size = renderer.getSize(new THREE.Vector2())
    const rt = new THREE.WebGLRenderTarget(size.x, size.y, {
      type: THREE.HalfFloatType,
      samples: 0,
    })
    composer = new EffectComposer(renderer, rt)
    composer.addPass(new RenderPass(scene, orthoCam))
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      params.bloomStrength,
      params.bloomRadius,
      params.bloomThreshold,
    )
    composer.addPass(bloomPass)
    composer.addPass(new OutputPass())

    // Cinematic finishing pass (grain / vignette / chromatic aberration).
    postFxPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uGrain: { value: params.fxGrain },
        uVignette: { value: params.fxVignette },
        uAberration: { value: params.fxAberration },
        uEnabled: { value: params.fxEnabled ? 1 : 0 },
      },
      vertexShader: POSTFX_VERTEX,
      fragmentShader: postfxFragment,
    })
    composer.addPass(postFxPass)

    resize()
    return true
  }

  function resize() {
    if (!renderer || !composer || !canvasEl) return
    const cssW = canvasEl.clientWidth || window.innerWidth
    const cssH = canvasEl.clientHeight || window.innerHeight
    const dpr = effectiveDpr()
    const w = Math.max(1, Math.floor(cssW * dpr))
    const h = Math.max(1, Math.floor(cssH * dpr))

    renderer.setPixelRatio(1)
    renderer.setSize(w, h, false)
    composer.setSize(w, h)
    bloomPass?.setSize(w, h)

    uniforms.uResolution.value.set(w, h)
    uniforms.uAspect.value = cssW / cssH
    if (postFxPass) postFxPass.uniforms.uResolution.value.set(w, h)
    camera.aspect = cssW / cssH
    camera.updateProjectionMatrix()
  }

  function syncCameraUniforms() {
    camera.updateMatrixWorld()
    const e = camera.matrixWorld.elements
    uniforms.uCamPos.value.copy(camera.position)
    uniforms.uCamRight.value.set(e[0], e[1], e[2]).normalize()
    uniforms.uCamUp.value.set(e[4], e[5], e[6]).normalize()
    uniforms.uCamForward.value.set(-e[8], -e[9], -e[10]).normalize()
    uniforms.uTanHalfFov.value = Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5)
  }

  function syncParamUniforms() {
    uniforms.uDiskInner.value = params.diskInner
    uniforms.uDiskOuter.value = params.diskOuter
    uniforms.uDiskThickness.value = params.diskThickness
    uniforms.uDiskBrightness.value = params.diskBrightness
    uniforms.uDiskDensity.value = params.diskDensity
    uniforms.uDiskTemp.value = params.diskTemperature
    uniforms.uDiskSpeed.value = params.diskSpeed
    uniforms.uSpin.value = params.spin
    uniforms.uLensing.value = params.lensing
    uniforms.uDoppler.value = params.doppler
    uniforms.uJet.value = params.jet
    uniforms.uMode.value = params.mode === 'scientific' ? 1 : 0
    uniforms.uStarDensity.value = params.starDensity
    uniforms.uNebula.value = params.nebula

    // Detail scales down while the observer is moving, back up when settled.
    let steps = QUALITY_TIERS[params.quality].steps
    if (moving.value) steps = Math.round(steps * 0.65)
    uniforms.uMaxSteps.value = steps

    if (camera.fov !== params.fov) {
      camera.fov = params.fov
      camera.updateProjectionMatrix()
    }
    if (renderer) renderer.toneMappingExposure = params.exposure
    if (bloomPass) {
      bloomPass.strength = params.bloomStrength
      bloomPass.radius = params.bloomRadius
      bloomPass.threshold = params.bloomThreshold
    }
    if (postFxPass) {
      postFxPass.uniforms.uTime.value = uniforms.uTime.value
      postFxPass.uniforms.uGrain.value = params.fxGrain
      postFxPass.uniforms.uVignette.value = params.fxVignette
      postFxPass.uniforms.uAberration.value = params.fxAberration
      postFxPass.uniforms.uEnabled.value = params.fxEnabled ? 1 : 0
    }
  }

  function frame() {
    if (!running || !composer) return
    const t = performance.now()
    const dt = Math.min((t - lastTime) / 1000, 0.1)
    lastTime = t
    for (const u of updaters) u(dt)
    syncCameraUniforms()
    syncParamUniforms()
    uniforms.uTime.value += dt

    composer.render()

    frames++
    fpsAccum += dt
    if (fpsAccum >= 0.5) {
      fps.value = Math.round(frames / fpsAccum)
      frames = 0
      fpsAccum = 0
    }
    raf = requestAnimationFrame(frame)
  }

  function start() {
    if (running) return
    running = true
    lastTime = performance.now()
    raf = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  function onUpdate(cb: UpdateFn) {
    updaters.push(cb)
  }

  function setMoving(v: boolean) {
    moving.value = v
  }

  function dispose() {
    stop()
    material?.dispose()
    composer?.dispose()
    renderer?.dispose()
  }

  // Re-size the drawing buffer when supersampling or quality tier changes.
  watch(
    () => [params.renderScale, params.quality],
    () => resize(),
  )

  return {
    camera,
    fps,
    supported,
    mount,
    resize,
    start,
    stop,
    onUpdate,
    setMoving,
    dispose,
  }
}
