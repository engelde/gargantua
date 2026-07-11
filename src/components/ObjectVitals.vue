<script setup lang="ts">
import { computed } from 'vue'
import Tooltip from './ui/Tooltip.vue'
import { useObservatory } from '@/composables/useObservatory'
import { formatKelvin, formatKm, formatMassSolar, formatRs, formatDistanceLy } from '@/utils/math'

const { objects, controls } = useObservatory()
const obj = objects.activeObject
const t = controls.telemetry

const vitals = computed(() => [
  {
    label: 'Mass',
    value: formatMassSolar(obj.value.massSolar),
    tip: 'Total mass in solar masses (M☉ = one Sun). It sets the scale of everything else.',
  },
  {
    label: 'Horizon rₛ',
    value: formatKm(t.schwarzschildKm),
    tip: 'Schwarzschild radius, 2GM/c² — the size of the event horizon. Nothing within can return.',
  },
  {
    label: 'Spin',
    value: `a ${obj.value.spin.toFixed(2)}`,
    tip: 'Dimensionless spin a = Jc/GM², from 0 (static) to ~1 (maximal). High spin shrinks the inner disk.',
  },
  {
    label: 'Hawking T',
    value: formatKelvin(t.hawkingTempK),
    tip: 'Temperature of its Hawking radiation (∝ 1/M). Far below the 2.7 K cosmic background — these holes grow, not evaporate.',
  },
  {
    label: 'ISCO',
    value: `${formatRs(t.iscoRs)} rₛ`,
    tip: 'Innermost stable circular orbit — the inner edge of the accretion disk. Shrinks toward the horizon as spin rises.',
  },
  {
    label: 'Distance',
    value: obj.value.distanceLy ? formatDistanceLy(obj.value.distanceLy) : '—',
    tip: 'Distance from Earth to the real object (— for the fictional flagship).',
  },
])
</script>

<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2.5">
    <div v-for="v in vitals" :key="v.label" class="min-w-0">
      <Tooltip :text="v.tip">
        <span class="label-mono">{{ v.label }}</span>
      </Tooltip>
      <div class="readout mt-0.5 break-words text-sm text-slate-100">{{ v.value }}</div>
    </div>
  </div>
</template>
