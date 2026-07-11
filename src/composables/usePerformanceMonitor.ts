import type { Ref } from 'vue'
import type { QualityTier, SimulationParams } from '@/types/simulation'

const TIERS: QualityTier[] = ['low', 'medium', 'high', 'ultra']

/**
 * Watches frame rate and, when autoQuality is on, nudges the quality tier to
 * keep the experience smooth — stepping down under load, back up with headroom.
 * Hysteresis + cooldown prevent oscillation. Manual quality changes are honoured
 * (the monitor only acts while autoQuality is enabled).
 */
export function usePerformanceMonitor(params: SimulationParams, fps: Ref<number>) {
  let cooldown = 0
  let window = 0
  let samples = 0
  let accum = 0

  function tick(dt: number) {
    if (!params.autoQuality) return
    cooldown -= dt
    window += dt
    accum += fps.value
    samples++
    if (window < 1.6) return

    const avg = accum / Math.max(samples, 1)
    window = 0
    accum = 0
    samples = 0
    if (cooldown > 0) return

    const idx = TIERS.indexOf(params.quality)
    if (avg < 42 && idx > 0) {
      params.quality = TIERS[idx - 1]
      cooldown = 3.5
    } else if (avg > 58 && idx < TIERS.length - 1) {
      params.quality = TIERS[idx + 1]
      cooldown = 5
    }
  }

  return { tick }
}
