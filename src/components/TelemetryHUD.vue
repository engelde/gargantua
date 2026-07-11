<script setup lang="ts">
import { computed } from 'vue'
import PanelFrame from './ui/PanelFrame.vue'
import Icon from './ui/Icon.vue'
import Tooltip from './ui/Tooltip.vue'
import OrbitMap from './OrbitMap.vue'
import ObjectVitals from './ObjectVitals.vue'
import { useObservatory } from '@/composables/useObservatory'
import { formatDilation, formatDistance, formatRs, formatVelocityC } from '@/utils/math'

const { controls, params } = useObservatory()
const t = controls.telemetry

const metrics = computed(() => [
  {
    label: 'Distance to singularity',
    value: formatRs(t.distanceRs),
    unit: 'rₛ',
    sub: formatDistance(t.distanceRs, params.massSolar),
    tip: 'Radial distance from the centre, in Schwarzschild radii (rₛ = the horizon radius).',
    warn: false,
  },
  {
    label: 'Proper time dilation',
    value: formatDilation(t.timeDilation),
    unit: '',
    sub: 'vs a distant clock',
    tip: 'How much slower your clock ticks than a far-away observer’s at this depth — 1/√(1−rₛ/r).',
    warn: false,
  },
  {
    label: 'Orbital velocity',
    value: formatVelocityC(t.orbitalVelocity),
    unit: '',
    sub: 'circular geodesic',
    tip: 'Speed of a stable circular orbit at this radius, as a fraction of the speed of light.',
    warn: false,
  },
  {
    label: 'Tidal stretch',
    value: t.tidalLabel,
    unit: '',
    sub: 'head-to-toe gradient',
    tip: 'Difference in gravity across a human body. Small black holes shred you far outside the horizon; supermassive giants are gentle even at the edge.',
    warn: t.tidalLethal,
  },
])
</script>

<template>
  <PanelFrame eyebrow="Trajectory · Schwarzschild frame" title="Navigation">
    <div class="text-instrument-steel">
      <OrbitMap />
    </div>

    <div class="my-3 border-t border-instrument-steel/12 pt-3">
      <ObjectVitals />
    </div>

    <div class="divide-y divide-instrument-steel/12 border-t border-instrument-steel/12 pt-1">
      <div
        v-for="m in metrics"
        :key="m.label"
        class="flex items-baseline justify-between gap-3 py-2"
      >
        <div class="min-w-0">
          <Tooltip :text="m.tip">
            <span class="label-mono">{{ m.label }}</span>
          </Tooltip>
          <div class="mt-0.5 text-[10px] text-instrument-steel/70">{{ m.sub }}</div>
        </div>
        <div
          class="readout shrink-0 text-right text-base"
          :class="m.warn ? 'text-caution' : 'text-slate-100'"
        >
          {{ m.value }}
          <span v-if="m.unit" class="ml-0.5 text-xs text-instrument-steel">{{ m.unit }}</span>
        </div>
      </div>
    </div>

    <Transition name="warn">
      <div
        v-if="t.proximityWarning || t.tidalLethal"
        class="mt-3 flex items-center gap-2 rounded border border-caution/40 bg-caution/10 px-2.5 py-1.5 text-caution"
      >
        <Icon name="warning" :size="15" class="animate-blink shrink-0" />
        <span class="label-mono text-caution">
          {{
            t.insidePhotonSphere
              ? 'Within photon sphere'
              : t.tidalLethal
                ? 'Tidal forces lethal'
                : 'Deep gravity well · caution'
          }}
        </span>
      </div>
    </Transition>
  </PanelFrame>
</template>

<style scoped>
.warn-enter-active,
.warn-leave-active {
  transition: opacity 0.3s ease;
}
.warn-enter-from,
.warn-leave-to {
  opacity: 0;
}
</style>
