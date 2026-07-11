<script setup lang="ts">
import { computed } from 'vue'
import { useObservatory } from '@/composables/useObservatory'
import { clamp, PHOTON_SPHERE } from '@/utils/math'

const { controls, params } = useObservatory()
const t = controls.telemetry

const C = 62 // schematic centre
const SCALE = 3.1 // px per rs (clamped range)

const shadowR = computed(() => PHOTON_SPHERE * 1.73 * SCALE) // apparent shadow ~2.6 rs
const diskInnerR = computed(() => params.diskInner * SCALE)
const diskOuterR = computed(() => params.diskOuter * SCALE)

// Camera marker in the top-down (x,z) plane.
const markerR = computed(() => clamp(t.distanceRs, 0, 18) * SCALE)
const marker = computed(() => ({
  x: C + Math.cos(t.azimuth) * markerR.value,
  y: C + Math.sin(t.azimuth) * markerR.value,
}))
const markerDeg = computed(() => (t.azimuth * 180) / Math.PI + 90)

// Elevation gauge (−90°..+90°) → vertical position on a side rail.
const elevPct = computed(() => clamp(0.5 - t.elevation / Math.PI, 0, 1))
</script>

<template>
  <div class="flex items-center gap-3">
    <svg viewBox="0 0 124 124" class="h-[124px] w-[124px] shrink-0">
      <defs>
        <radialGradient :id="'diskgrad'" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--color-gargantua-core)" stop-opacity="0.05" />
          <stop offset="55%" stop-color="var(--color-gargantua-amber)" stop-opacity="0.28" />
          <stop offset="100%" stop-color="var(--color-gargantua-ember)" stop-opacity="0.05" />
        </radialGradient>
      </defs>

      <!-- range rings -->
      <circle :cx="C" :cy="C" r="58" fill="none" stroke="currentColor" stroke-opacity="0.1" />
      <circle :cx="C" :cy="C" r="40" fill="none" stroke="currentColor" stroke-opacity="0.06" />
      <line :x1="C" y1="4" :x2="C" y2="120" stroke="currentColor" stroke-opacity="0.06" />
      <line x1="4" :y1="C" x2="120" :y2="C" stroke="currentColor" stroke-opacity="0.06" />

      <!-- accretion disk footprint -->
      <circle :cx="C" :cy="C" :r="diskOuterR" fill="url(#diskgrad)" />
      <circle
        :cx="C"
        :cy="C"
        :r="diskOuterR"
        fill="none"
        stroke="var(--color-gargantua-amber)"
        stroke-opacity="0.35"
      />
      <circle
        :cx="C"
        :cy="C"
        :r="diskInnerR"
        fill="var(--color-void)"
        stroke="var(--color-gargantua-amber)"
        stroke-opacity="0.4"
      />

      <!-- shadow + photon ring -->
      <circle :cx="C" :cy="C" :r="shadowR" fill="#020306" />
      <circle
        :cx="C"
        :cy="C"
        :r="shadowR"
        fill="none"
        stroke="var(--color-gargantua-core)"
        stroke-opacity="0.75"
        stroke-width="0.8"
      />

      <!-- sight line + camera marker -->
      <line
        :x1="C"
        :y1="C"
        :x2="marker.x"
        :y2="marker.y"
        stroke="var(--color-instrument-cyan)"
        stroke-opacity="0.35"
        stroke-dasharray="2 3"
      />
      <g :transform="`translate(${marker.x} ${marker.y}) rotate(${markerDeg})`">
        <path
          d="M0 -5 L4 4 L0 1.6 L-4 4 Z"
          fill="var(--color-instrument-cyan)"
          stroke="var(--color-instrument-cyan)"
        />
      </g>
    </svg>

    <!-- elevation rail -->
    <div class="flex h-[112px] flex-col items-center justify-between">
      <span class="label-mono text-[9px]">+90</span>
      <div class="relative my-1 h-full w-px bg-instrument-steel/25">
        <div
          class="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-instrument-cyan shadow-[0_0_6px_var(--color-instrument-cyan)]"
          :style="{ top: `${elevPct * 100}%` }"
        ></div>
        <div class="absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 bg-instrument-steel/40"></div>
      </div>
      <span class="label-mono text-[9px]">−90</span>
    </div>
  </div>
</template>
