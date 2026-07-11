<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { provideObservatory } from '@/composables/useObservatory'
import { useUiState } from '@/composables/useUiState'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import type { QualityTier, RenderMode } from '@/types/simulation'
import GargantuaViewport from '@/components/GargantuaViewport.vue'
import AnatomyOverlay from '@/components/AnatomyOverlay.vue'
import ObjectSelector from '@/components/ObjectSelector.vue'
import ChipMenu from '@/components/ui/ChipMenu.vue'
import TelemetryHUD from '@/components/TelemetryHUD.vue'
import ControlDeck from '@/components/ControlDeck.vue'
import ParameterPanel from '@/components/ParameterPanel.vue'
import PresetBar from '@/components/PresetBar.vue'
import TourOverlay from '@/components/TourOverlay.vue'
import Codex from '@/components/Codex.vue'
import ShortcutsOverlay from '@/components/ShortcutsOverlay.vue'
import IntroSequence from '@/components/IntroSequence.vue'

const obs = provideObservatory()
const ui = useUiState()
const { renderer, params, applyMode } = obs

const appRoot = ref<HTMLElement | null>(null)
useKeyboardShortcuts(obs, appRoot)

const modeLabel = computed(() => (params.mode === 'cinematic' ? 'Cinematic' : 'Scientific'))
const qualityLabel = computed(() => params.quality.toUpperCase())
const detailActive = computed(() => (params.autoQuality ? 'auto' : params.quality))

const modeChipOptions = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'scientific', label: 'Scientific' },
]
const detailChipOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' },
]

function onSelectMode(v: string) {
  applyMode(v as RenderMode)
}
function onSelectDetail(v: string) {
  if (v === 'auto') {
    params.autoQuality = true
  } else {
    params.autoQuality = false
    params.quality = v as QualityTier
  }
}

// Escape peels back one layer of UI at a time.
useEventListener(window, 'keydown', (e) => {
  if (e.key !== 'Escape') return
  if (ui.codex) ui.codex = false
  else if (ui.shortcuts) ui.shortcuts = false
  else if (ui.tune) ui.tune = false
  else if (ui.presets) ui.presets = false
  else if (ui.anatomy) ui.anatomy = false
  else if (ui.uiHidden) ui.uiHidden = false
})
</script>

<template>
  <div ref="appRoot" class="relative h-full w-full overflow-hidden bg-void font-sans text-slate-200">
    <GargantuaViewport />
    <AnatomyOverlay />

    <!-- Instrument chrome (hidden in clean/cinematic view) -->
    <div v-show="!ui.uiHidden" class="contents">
      <!-- Brand lockup -->
      <header class="pointer-events-none absolute left-5 top-5 z-20 select-none">
        <h1 class="font-display text-lg font-medium tracking-[0.32em] text-slate-100" style="text-indent: 0.32em">
          GARGANTUA
        </h1>
        <div class="mt-1.5 flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_var(--color-signal)]"></span>
          <span class="label-mono">Gravitational Observatory</span>
        </div>
      </header>

      <!-- Object selector -->
      <div class="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2">
        <ObjectSelector />
      </div>

      <!-- Status chips (Model & Detail are selectable) -->
      <div class="pointer-events-none absolute right-5 top-5 z-30 hidden items-center gap-2 sm:flex">
        <div class="panel pointer-events-auto flex items-center gap-3 px-3 py-1.5">
          <div class="flex items-baseline gap-1.5">
            <span class="label-mono">FPS</span>
            <span class="readout text-xs text-slate-200">{{ renderer.fps.value }}</span>
          </div>
          <div class="h-3 w-px bg-instrument-steel/20"></div>
          <ChipMenu
            label="Model"
            :value="modeLabel"
            :active="params.mode"
            :options="modeChipOptions"
            @select="onSelectMode"
          />
          <div class="h-3 w-px bg-instrument-steel/20"></div>
          <ChipMenu
            label="Detail"
            :value="qualityLabel"
            :active="detailActive"
            :options="detailChipOptions"
            @select="onSelectDetail"
          />
        </div>
      </div>

      <!-- Telemetry -->
      <div class="absolute bottom-5 left-5 z-20 hidden w-[300px] max-w-[86vw] md:block">
        <TelemetryHUD />
      </div>

      <!-- Bottom-center: tour captions, preset popover, control deck -->
      <div
        class="pointer-events-none absolute bottom-5 left-1/2 z-30 flex w-full max-w-[92vw] -translate-x-1/2 flex-col items-center gap-3"
      >
        <TourOverlay />
        <Transition name="pop">
          <PresetBar v-if="ui.presets" class="pointer-events-auto" />
        </Transition>
        <ControlDeck />
      </div>

      <!-- Right instrument drawer -->
      <Transition name="drawer">
        <ParameterPanel v-if="ui.tune" class="absolute right-0 top-0 z-30" />
      </Transition>
    </div>

    <!-- Clean-view hint -->
    <Transition name="pop">
      <button
        v-if="ui.uiHidden"
        type="button"
        class="label-mono pointer-events-auto absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-md border border-instrument-steel/25 bg-void/60 px-3 py-1.5 text-instrument-steel backdrop-blur transition-colors hover:text-slate-100"
        @click="ui.uiHidden = false"
      >
        Press H to show controls
      </button>
    </Transition>

    <!-- Overlays -->
    <Codex />
    <ShortcutsOverlay />
    <IntroSequence />
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease-out-expo);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.35s var(--ease-out-expo);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
