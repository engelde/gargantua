<script setup lang="ts">
import SliderControl from './ui/SliderControl.vue'
import SegmentedControl from './ui/SegmentedControl.vue'
import ToggleSwitch from './ui/ToggleSwitch.vue'
import Icon from './ui/Icon.vue'
import { useObservatory } from '@/composables/useObservatory'
import { useUiState } from '@/composables/useUiState'
import type { QualityTier, RenderMode } from '@/types/simulation'

const { params, applyMode, resetParams, audio } = useObservatory()
const ui = useUiState()

const modeOptions = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'scientific', label: 'Scientific' },
]
const qualityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' },
]

const deg = (v: number) => `${v.toFixed(0)}°`
const x1 = (v: number) => `${v.toFixed(1)}×`
const rs = (v: number) => `${v.toFixed(1)} rₛ`
const pct = (v: number) => `${Math.round(v * 100)}%`

function onMode(v: string) {
  applyMode(v as RenderMode)
}
function onQuality(v: string) {
  params.autoQuality = false
  params.quality = v as QualityTier
}
</script>

<template>
  <aside
    class="panel pointer-events-auto flex h-full w-[330px] max-w-[86vw] flex-col rounded-none border-y-0 border-r-0"
    role="dialog"
    aria-label="Instrument settings"
  >
    <header class="flex items-center justify-between border-b border-instrument-steel/15 px-4 py-3.5">
      <div>
        <div class="label-mono text-instrument-cyan/80">Instruments</div>
        <h2 class="font-display text-sm text-slate-100">Observation parameters</h2>
      </div>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded text-instrument-steel hover:text-slate-100"
        aria-label="Close instruments"
        @click="ui.tune = false"
      >
        <Icon name="close" :size="18" />
      </button>
    </header>

    <div class="flex-1 space-y-6 overflow-y-auto px-4 py-4">
      <!-- Render mode -->
      <section>
        <div class="label-mono mb-2.5">Render model</div>
        <SegmentedControl :model-value="params.mode" :options="modeOptions" @update:model-value="onMode" />
        <p class="mt-2 text-[11px] leading-relaxed text-instrument-steel/80">
          {{
            params.mode === 'cinematic'
              ? 'Warm, near-symmetric — Doppler beaming suppressed, as the film chose.'
              : 'Physical realism — relativistic beaming brightens the approaching edge.'
          }}
        </p>
      </section>

      <!-- Accretion disk -->
      <section class="space-y-3.5">
        <div class="label-mono">Accretion disk</div>
        <SliderControl label="Inner radius" v-model="params.diskInner" :min="2.2" :max="6" :format="rs" />
        <SliderControl label="Outer radius" v-model="params.diskOuter" :min="7" :max="18" :format="rs" />
        <SliderControl label="Brightness" v-model="params.diskBrightness" :min="0.1" :max="1.6" :format="x1" />
        <SliderControl label="Temperature" v-model="params.diskTemperature" :min="0" :max="1" :format="pct" />
        <SliderControl label="Thickness" v-model="params.diskThickness" :min="0" :max="0.6" :format="pct" />
        <SliderControl label="Rotation" v-model="params.diskSpeed" :min="0" :max="3" :format="x1" />
        <SliderControl label="Density" v-model="params.diskDensity" :min="0.2" :max="2" :format="x1" />
        <SliderControl label="Spin (visual)" v-model="params.spin" :min="0" :max="0.999" :format="pct" />
      </section>

      <!-- Spacetime -->
      <section class="space-y-3.5">
        <div class="label-mono">Spacetime</div>
        <SliderControl label="Lensing strength" v-model="params.lensing" :min="0.2" :max="1.8" :format="x1" />
        <SliderControl label="Relativistic jet" v-model="params.jet" :min="0" :max="1" :format="pct" />
        <SliderControl
          v-if="params.mode === 'scientific'"
          label="Doppler beaming"
          v-model="params.doppler"
          :min="0"
          :max="1"
          :format="pct"
        />
      </section>

      <!-- Sky -->
      <section class="space-y-3.5">
        <div class="label-mono">Sky</div>
        <SliderControl label="Star density" v-model="params.starDensity" :min="0" :max="1.6" :format="x1" />
        <SliderControl label="Nebula" v-model="params.nebula" :min="0" :max="1.4" :format="x1" />
      </section>

      <!-- Optics -->
      <section class="space-y-3.5">
        <div class="label-mono">Optics</div>
        <SliderControl label="Exposure" v-model="params.exposure" :min="0.5" :max="1.8" :format="x1" />
        <SliderControl label="Bloom" v-model="params.bloomStrength" :min="0" :max="1.4" :format="x1" />
        <SliderControl label="Bloom threshold" v-model="params.bloomThreshold" :min="0.4" :max="1.4" :format="x1" />
        <SliderControl label="Field of view" v-model="params.fov" :min="28" :max="80" :step="1" :format="deg" />
      </section>

      <!-- Cinematic FX -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="label-mono">Cinematic FX</span>
          <ToggleSwitch v-model="params.fxEnabled" />
        </div>
        <template v-if="params.fxEnabled">
          <SliderControl label="Film grain" v-model="params.fxGrain" :min="0" :max="0.3" :format="pct" />
          <SliderControl label="Vignette" v-model="params.fxVignette" :min="0" :max="1" :format="pct" />
          <SliderControl label="Chromatic aberration" v-model="params.fxAberration" :min="0" :max="1" :format="pct" />
        </template>
      </section>

      <!-- Performance -->
      <section class="space-y-3">
        <div class="label-mono">Performance</div>
        <SegmentedControl :model-value="params.quality" :options="qualityOptions" @update:model-value="onQuality" />
        <div class="flex items-center justify-between pt-1">
          <span class="text-xs text-slate-300">Adaptive quality</span>
          <ToggleSwitch v-model="params.autoQuality" label="" />
        </div>
        <SliderControl label="Render scale" v-model="params.renderScale" :min="0.5" :max="1" :format="pct" />
      </section>

      <!-- Audio -->
      <section v-if="audio.available.value" class="space-y-3">
        <div class="label-mono">Ambient audio</div>
        <SliderControl
          label="Volume"
          :model-value="audio.volume.value"
          :min="0"
          :max="1"
          :format="pct"
          @update:model-value="audio.setVolume"
        />
      </section>
    </div>

    <footer class="border-t border-instrument-steel/15 px-4 py-3">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-md border border-instrument-steel/25 py-2 text-xs text-instrument-steel transition-colors hover:border-instrument-steel/45 hover:text-slate-100"
        @click="resetParams"
      >
        <Icon name="reset" :size="15" />
        Restore Gargantua defaults
      </button>
    </footer>
  </aside>
</template>
