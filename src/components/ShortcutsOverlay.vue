<script setup lang="ts">
import Icon from './ui/Icon.vue'
import { useUiState } from '@/composables/useUiState'

const ui = useUiState()

const groups = [
  {
    title: 'Navigate',
    items: [
      { keys: ['Drag'], desc: 'Orbit the black hole' },
      { keys: ['Scroll'], desc: 'Zoom in / out' },
      { keys: ['W', 'A', 'S', 'D'], desc: 'Fly (free-flight mode)' },
      { keys: ['Space', 'Ctrl'], desc: 'Fly up / down' },
      { keys: ['Shift'], desc: 'Boost speed' },
      { keys: ['R'], desc: 'Reset view' },
    ],
  },
  {
    title: 'Explore',
    items: [
      { keys: ['1', '–', '5'], desc: 'Switch black hole' },
      { keys: ['T'], desc: 'Guided tour · play / pause' },
      { keys: ['←', '→'], desc: 'Tour: previous / next chapter' },
      { keys: ['C'], desc: 'Cinematic / Scientific' },
      { keys: ['A'], desc: 'Anatomy labels' },
      { keys: ['V'], desc: 'Vantage points' },
    ],
  },
  {
    title: 'Interface',
    items: [
      { keys: ['K'], desc: 'Open the Codex' },
      { keys: ['H'], desc: 'Hide the interface' },
      { keys: ['F'], desc: 'Fullscreen' },
      { keys: ['?'], desc: 'This reference' },
      { keys: ['Esc'], desc: 'Close panels' },
    ],
  },
]
</script>

<template>
  <Transition name="modal">
    <div
      v-if="ui.shortcuts"
      class="fixed inset-0 z-40 flex items-center justify-center p-4"
      @click.self="ui.shortcuts = false"
    >
      <div class="absolute inset-0 bg-void/75 backdrop-blur-sm"></div>

      <div class="panel relative z-10 w-full max-w-2xl p-6 sm:p-7">
        <button
          type="button"
          class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded text-instrument-steel hover:text-slate-100"
          aria-label="Close shortcuts"
          @click="ui.shortcuts = false"
        >
          <Icon name="close" :size="18" />
        </button>

        <div class="mb-5 flex items-center gap-2">
          <Icon name="keyboard" :size="18" class="text-instrument-cyan" />
          <h2 class="font-display text-lg text-slate-100">Keyboard & controls</h2>
        </div>

        <div class="grid gap-x-8 gap-y-6 sm:grid-cols-3">
          <section v-for="g in groups" :key="g.title">
            <div class="label-mono mb-3 text-instrument-cyan/70">{{ g.title }}</div>
            <ul class="space-y-2.5">
              <li v-for="it in g.items" :key="it.desc" class="flex items-start justify-between gap-3">
                <span class="text-[13px] text-slate-300">{{ it.desc }}</span>
                <span class="flex shrink-0 items-center gap-1">
                  <kbd
                    v-for="key in it.keys"
                    :key="key"
                    class="readout rounded border border-instrument-steel/30 bg-void/60 px-1.5 py-0.5 text-[10px] text-slate-200"
                    >{{ key }}</kbd
                  >
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
