/**
 * Core domain types for the Gargantua observatory.
 * All spatial quantities are expressed in Schwarzschild radii (rs = 1) unless noted.
 */

export type RenderMode = 'cinematic' | 'scientific'
export type CameraMode = 'orbit' | 'fly'
export type QualityTier = 'low' | 'medium' | 'high' | 'ultra'
export type BlackHoleKind = 'fictional' | 'stellar' | 'supermassive' | 'ultramassive'

/** Everything the user can tune. Bound live to shader uniforms & post-processing. */
export interface SimulationParams {
  // Accretion disk geometry & appearance
  diskInner: number // inner edge radius (rs)
  diskOuter: number // outer edge radius (rs)
  diskThickness: number // vertical puffiness
  diskBrightness: number // emissive gain
  diskDensity: number // optical accumulation per crossing
  diskTemperature: number // 0 = warm Gargantua gold, 1 = hot blue-white
  diskSpeed: number // Keplerian animation multiplier
  spin: number // visual spin 0..0.999 (nudges inner radius + Doppler)

  // Look & physics
  mode: RenderMode
  doppler: number // 0..1 relativistic beaming strength
  lensing: number // gravitational lensing gain (1 = physical)
  jet: number // 0..1 relativistic polar-jet strength

  // Active object (drives physical scale in the telemetry deck)
  objectId: string
  massSolar: number

  // Sky
  starDensity: number
  nebula: number

  // Render & post-processing
  exposure: number
  bloomStrength: number
  bloomRadius: number
  bloomThreshold: number
  fov: number

  // Cinematic post-FX
  fxEnabled: boolean
  fxGrain: number
  fxVignette: number
  fxAberration: number

  // Performance
  quality: QualityTier
  autoQuality: boolean
  renderScale: number // 0.5..1 supersample factor (DPR-capped)
}

/** Resolved per-tier rendering cost. */
export interface QualitySettings {
  maxSteps: number
  renderScale: number
}

/** A camera pose in world space. */
export interface CameraPose {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

/** A saved vantage point. */
export interface Preset extends CameraPose {
  id: string
  name: string
  blurb: string
  params?: Partial<SimulationParams>
}

/** One beat of the guided cinematic tour. */
export interface TourKeyframe extends CameraPose {
  id: string
  title: string
  caption: string
  duration: number // seconds of travel to reach this pose
  hold: number // seconds to dwell after arrival
  params?: Partial<SimulationParams>
  objectId?: string // switch the observed black hole for this chapter
  mode?: RenderMode // flip cinematic/scientific for this chapter
  annotate?: boolean // reveal the anatomy overlay for this chapter
}

/** A real (or fictional flagship) black hole the explorer can load. */
export interface BlackHoleObject {
  id: string
  name: string
  designation?: string
  kind: BlackHoleKind
  massSolar: number
  spin: number
  distanceLy?: number
  tagline: string
  blurb: string
  params: Partial<SimulationParams> // disk/look overrides applied on select
  facts: { label: string; value: string }[]
  codexId?: string
}

/** A single Codex equation (rendered as styled Unicode, no MathJax). */
export interface CodexEquation {
  expr: string
  caption?: string
}

/** A "See it" action a Codex article can trigger on the live simulation. */
export interface CodexDemo {
  objectId?: string
  preset?: string
  mode?: RenderMode
  annotate?: boolean
}

/** One layered Codex article: accessible body + optional "go deeper". */
export interface CodexArticle {
  id: string
  section: string
  title: string
  summary: string
  body: string[]
  deeper?: string[]
  equations?: CodexEquation[]
  facts?: { label: string; value: string }[]
  related?: string[]
  demo?: CodexDemo
}

/** A Codex section grouping articles. */
export interface CodexSection {
  id: string
  title: string
  blurb?: string
  articleIds: string[]
}

/** A glossary term for quick reference + search. */
export interface GlossaryTerm {
  term: string
  definition: string
  articleId?: string
}


/** Live mission telemetry derived from camera + physics. */
export interface Telemetry {
  distanceRs: number
  distanceKm: number
  distanceAu: number
  timeDilation: number // coordinate seconds per local second (>= 1)
  orbitalVelocity: number // fraction of c for a circular orbit at r
  escapeVelocity: number // fraction of c
  azimuth: number // radians, top-down angle atan2(z, x)
  elevation: number // radians, asin(y / r) above the disk plane
  fov: number
  fps: number
  mode: CameraMode
  insidePhotonSphere: boolean
  proximityWarning: boolean

  // Object-aware physics (rescales per selected black hole)
  schwarzschildKm: number
  hawkingTempK: number
  iscoRs: number
  photonSphereRs: number
  shadowDiameterKm: number
  shadowAngularDeg: number
  tidalLabel: string
  tidalLethal: boolean
}
