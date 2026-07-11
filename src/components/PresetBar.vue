<script setup lang="ts">
import { ref } from 'vue'
import PanelFrame from './ui/PanelFrame.vue'
import Icon from './ui/Icon.vue'
import { useObservatory } from '@/composables/useObservatory'
import { useUiState } from '@/composables/useUiState'
import { PRESETS } from '@/data/presets'
import type { Preset } from '@/types/simulation'

const { director, controls } = useObservatory()
const ui = useUiState()
const custom = ref<Preset[]>([])

function go(p: Preset) {
  director.goToPose(p, 2.4, p.params)
}

function capture() {
  const pose = controls.getPose()
  const n = custom.value.length + 1
  custom.value.push({ id: `custom-${n}`, name: `Vantage ${n}`, blurb: 'Saved viewpoint', ...pose })
}
</script>

<template>
  <PanelFrame eyebrow="Vantage points" title="Jump to a view" class="w-[280px]">
    <template #header>
      <button
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded text-instrument-steel hover:text-slate-100"
        aria-label="Close vantage points"
        @click="ui.presets = false"
      >
        <Icon name="close" :size="16" />
      </button>
    </template>

    <ul class="space-y-0.5">
      <li v-for="p in [...PRESETS, ...custom]" :key="p.id">
        <button
          type="button"
          class="group flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors hover:bg-instrument-cyan/8"
          @click="go(p)"
        >
          <Icon
            name="target"
            :size="16"
            class="shrink-0 text-instrument-steel transition-colors group-hover:text-instrument-cyan"
          />
          <span class="min-w-0">
            <span class="block truncate text-sm text-slate-100">{{ p.name }}</span>
            <span class="block truncate text-[11px] text-instrument-steel">{{ p.blurb }}</span>
          </span>
        </button>
      </li>
    </ul>

    <button
      type="button"
      class="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-instrument-steel/30 py-2 text-xs text-instrument-steel transition-colors hover:border-instrument-cyan/40 hover:text-instrument-cyan"
      @click="capture"
    >
      <Icon name="vantage" :size="14" />
      Capture current view
    </button>
  </PanelFrame>
</template>
