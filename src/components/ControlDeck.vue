<script setup lang="ts">
import SegmentedControl from './ui/SegmentedControl.vue'
import IconButton from './ui/IconButton.vue'
import { useObservatory } from '@/composables/useObservatory'
import { useUiState } from '@/composables/useUiState'
import { TOUR } from '@/data/tour'
import type { CameraMode } from '@/types/simulation'

const { controls, director, audio } = useObservatory()
const ui = useUiState()
const mode = controls.mode

const modeOptions = [
  { value: 'orbit', label: 'Orbit', icon: 'orbit' },
  { value: 'fly', label: 'Free Flight', icon: 'flight' },
]

function onMode(v: string) {
  controls.setMode(v as CameraMode)
}

function toggleTour() {
  if (director.isPlaying.value) director.stop()
  else director.playTour(TOUR)
}
</script>

<template>
  <div class="panel pointer-events-auto flex items-center gap-1.5 px-2.5 py-2">
    <SegmentedControl :model-value="mode" :options="modeOptions" @update:model-value="onMode" />
    <div class="mx-1 h-6 w-px bg-instrument-steel/20"></div>
    <IconButton
      :icon="director.isPlaying.value ? 'stop' : 'play'"
      label="Guided tour"
      title="Guided cinematic tour"
      :active="director.isPlaying.value"
      @click="toggleTour"
    />
    <IconButton
      icon="vantage"
      label="Vantage points"
      :active="ui.presets"
      @click="ui.presets = !ui.presets"
    />
    <IconButton
      icon="target"
      label="Anatomy labels"
      title="Label the anatomy"
      :active="ui.anatomy"
      @click="ui.anatomy = !ui.anatomy"
    />
    <IconButton
      icon="info"
      label="Codex"
      title="Codex — black hole encyclopedia"
      :active="ui.codex"
      @click="ui.codex = !ui.codex"
    />
    <IconButton
      :icon="audio.enabled.value ? 'audioOn' : 'audioOff'"
      label="Ambient audio"
      title="Ambient audio"
      :active="audio.enabled.value"
      @click="audio.toggle()"
    />
    <IconButton
      icon="tune"
      label="Instruments"
      title="Instrument settings"
      :active="ui.tune"
      @click="ui.tune = !ui.tune"
    />
    <div class="mx-1 h-6 w-px bg-instrument-steel/20"></div>
    <IconButton
      icon="keyboard"
      label="Keyboard shortcuts"
      title="Keyboard & controls (?)"
      :active="ui.shortcuts"
      @click="ui.shortcuts = !ui.shortcuts"
    />
  </div>
</template>
