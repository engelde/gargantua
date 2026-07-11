import { computed, ref } from 'vue'
import type { SimulationParams } from '@/types/simulation'
import { BLACK_HOLES, DEFAULT_OBJECT_ID, getObject } from '@/data/blackHoles'
import { lerp } from '@/utils/math'
import { easeInOutCubic } from '@/utils/easing'

// Numeric disk/look params that tween smoothly when the observed object changes.
const TWEEN_KEYS = [
  'diskInner', 'diskOuter', 'diskBrightness', 'diskTemperature', 'diskDensity',
  'diskSpeed', 'diskThickness', 'spin', 'jet', 'nebula', 'starDensity',
] as const

/**
 * Holds the currently-observed black hole and applies its identity (mass, spin)
 * and disk/look to the shared params store, tweening the disk on switch.
 */
export function useObjects(params: SimulationParams) {
  const activeId = ref(params.objectId || DEFAULT_OBJECT_ID)
  const activeObject = computed(() => getObject(activeId.value))
  let raf = 0

  function selectObject(id: string, animate = true) {
    const obj = getObject(id)
    activeId.value = obj.id
    params.objectId = obj.id
    params.massSolar = obj.massSolar

    const p = params as unknown as Record<string, number>
    const src = obj.params as unknown as Record<string, number>
    const target: Record<string, number> = { spin: obj.spin }
    for (const k of TWEEN_KEYS) {
      if (typeof src[k] === 'number') target[k] = src[k]
    }

    cancelAnimationFrame(raf)
    if (!animate) {
      for (const k in target) p[k] = target[k]
      return
    }
    const start: Record<string, number> = {}
    for (const k in target) start[k] = p[k]
    const t0 = performance.now()
    const dur = 750
    const step = () => {
      const e = Math.min((performance.now() - t0) / dur, 1)
      const a = easeInOutCubic(e)
      for (const k in target) p[k] = lerp(start[k], target[k], a)
      if (e < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  }

  return { objects: BLACK_HOLES, activeId, activeObject, selectObject }
}
