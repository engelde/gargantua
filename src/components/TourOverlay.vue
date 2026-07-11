<script setup lang="ts">
import { computed } from 'vue'
import Icon from './ui/Icon.vue'
import { useObservatory } from '@/composables/useObservatory'

const { director } = useObservatory()
const d = director

const stage = computed(() =>
  d.tourTotal.value ? `Chapter ${d.tourIndex.value + 1} · ${d.tourTotal.value}` : '',
)
</script>

<template>
  <Transition name="tour">
    <div v-if="d.isPlaying.value" class="pointer-events-none flex w-full flex-col items-center px-4">
      <div class="panel pointer-events-auto w-full max-w-2xl px-6 py-4 text-center">
        <div class="label-mono mb-1.5 text-instrument-cyan/80">{{ stage }}</div>
        <h3 class="mb-1.5 font-display text-lg text-gargantua-core">{{ d.title.value }}</h3>
        <p class="mx-auto max-w-xl text-sm leading-relaxed text-slate-300">{{ d.caption.value }}</p>

        <div class="mt-4 flex items-center justify-center gap-2.5">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md text-instrument-steel transition-colors hover:text-slate-100"
            title="Previous chapter"
            aria-label="Previous chapter"
            @click="d.prev()"
          >
            <Icon name="chevronRight" :size="16" class="rotate-180" />
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-instrument-cyan/40 bg-instrument-cyan/10 text-instrument-cyan transition-colors hover:bg-instrument-cyan/20"
            :title="d.isPaused.value ? 'Resume' : 'Pause'"
            :aria-label="d.isPaused.value ? 'Resume' : 'Pause'"
            @click="d.togglePause()"
          >
            <Icon :name="d.isPaused.value ? 'play' : 'pause'" :size="16" />
          </button>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md text-instrument-steel transition-colors hover:text-slate-100"
            title="Next chapter"
            aria-label="Next chapter"
            @click="d.next()"
          >
            <Icon name="chevronRight" :size="16" />
          </button>

          <div class="mx-1 flex items-center gap-1.5">
            <button
              v-for="i in d.tourTotal.value"
              :key="i"
              type="button"
              class="h-1.5 rounded-full transition-all duration-300"
              :class="
                i - 1 === d.tourIndex.value
                  ? 'w-5 bg-instrument-cyan'
                  : 'w-1.5 bg-instrument-steel/40 hover:bg-instrument-steel/70'
              "
              :title="`Chapter ${i}`"
              :aria-label="`Go to chapter ${i}`"
              @click="d.goToChapter(i - 1)"
            ></button>
          </div>

          <button
            type="button"
            class="flex items-center gap-1.5 rounded-md border border-instrument-steel/25 px-3 py-1.5 text-xs text-instrument-steel transition-colors hover:border-caution/40 hover:text-caution"
            @click="d.stop()"
          >
            <Icon name="stop" :size="13" />
            End
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.tour-enter-active,
.tour-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s var(--ease-out-expo);
}
.tour-enter-from,
.tour-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
