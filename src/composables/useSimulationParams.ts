import { reactive, watch } from 'vue'
import type { RenderMode, SimulationParams } from '@/types/simulation'

const STORAGE_KEY = 'gargantua.params.v4'

/**
 * Defaults tuned to read unmistakably as Interstellar's Gargantua:
 * a warm gold disk, near-symmetric (Doppler suppressed), thin and bright,
 * with the shadow rimmed by the photon ring.
 */
export const DEFAULT_PARAMS: SimulationParams = {
  diskInner: 2.6,
  diskOuter: 10.0,
  diskThickness: 0.26,
  diskBrightness: 0.66,
  diskDensity: 1.0,
  diskTemperature: 0.26,
  diskSpeed: 1.0,
  spin: 0.9,

  mode: 'cinematic',
  doppler: 0.0,
  lensing: 1.0,
  jet: 0.0,

  objectId: 'gargantua',
  massSolar: 1.0e8,

  starDensity: 1.0,
  nebula: 0.45,

  exposure: 1.0,
  bloomStrength: 0.55,
  bloomRadius: 0.55,
  bloomThreshold: 1.0,
  fov: 55,

  fxEnabled: true,
  fxGrain: 0.06,
  fxVignette: 0.34,
  fxAberration: 0.28,

  quality: 'high',
  autoQuality: true,
  renderScale: 1.0,
}

function loadPersisted(): SimulationParams {
  const base: SimulationParams = { ...DEFAULT_PARAMS }
  if (typeof window === 'undefined') return base
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<SimulationParams>
    // Only copy keys we recognise — never let stale storage inject junk.
    for (const key of Object.keys(base) as (keyof SimulationParams)[]) {
      if (key in saved && saved[key] !== undefined && saved[key] !== null) {
        // @ts-expect-error index assignment across a heterogeneous record
        base[key] = saved[key]
      }
    }
  } catch {
    /* corrupt storage — fall back to defaults */
  }
  return base
}

// Module-scoped singleton: the single source of truth for the whole app.
const params = reactive<SimulationParams>(loadPersisted())

let persistScheduled = false
watch(
  params,
  () => {
    if (persistScheduled || typeof window === 'undefined') return
    persistScheduled = true
    // Coalesce rapid slider updates into one write per frame.
    requestAnimationFrame(() => {
      persistScheduled = false
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(params))
      } catch {
        /* storage full or unavailable — non-fatal */
      }
    })
  },
  { deep: true },
)

/**
 * Cinematic suppresses Doppler beaming (as the film did); scientific restores it.
 * Disk temperature/colour is left to the selected object, so the mode toggle is a
 * pure physics switch and each black hole keeps its own hue.
 */
export function applyMode(mode: RenderMode) {
  params.mode = mode
  params.doppler = mode === 'cinematic' ? 0.0 : 1.0
}

export function resetParams() {
  Object.assign(params, DEFAULT_PARAMS)
}

export function useSimulationParams() {
  return { params, applyMode, resetParams }
}
