<script setup lang="ts">
import Icon from './ui/Icon.vue'
import { useObservatory } from '@/composables/useObservatory'
import { useUiState } from '@/composables/useUiState'

const { audio } = useObservatory()
const ui = useUiState()

function begin(withSound: boolean) {
  if (withSound) audio.enable()
  ui.intro = false
}
</script>

<template>
  <Transition name="intro">
    <div
      v-if="ui.intro"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <!-- Defocus + darken the live render so the title reads clearly -->
      <div
        class="absolute inset-0"
        style="
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          background: radial-gradient(
            ellipse 85% 75% at center,
            rgba(4, 6, 11, 0.6) 0%,
            rgba(4, 6, 11, 0.84) 55%,
            rgba(4, 6, 11, 0.96) 100%
          );
        "
      ></div>

      <!-- Soft readability scrim beneath the text column -->
      <div
        class="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[min(760px,94vw)] -translate-x-1/2 -translate-y-1/2"
        style="
          background: radial-gradient(
            ellipse at center,
            rgba(2, 3, 6, 0.72) 0%,
            rgba(2, 3, 6, 0.44) 42%,
            transparent 70%
          );
          filter: blur(28px);
        "
      ></div>

      <div
        class="relative flex flex-col items-center"
        style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55), 0 2px 22px rgba(0, 0, 0, 0.72)"
      >
        <h1
          class="animate-fade-up font-display text-6xl font-medium tracking-[0.34em] text-gargantua-core sm:text-8xl"
          style="text-indent: 0.34em"
        >
          GARGANTUA
        </h1>

        <div
          class="animate-fade-up mt-4 max-w-md text-sm leading-relaxed text-slate-100"
          style="animation-delay: 0.15s"
        >
          Explore black holes up close and observe the extreme physics of gravity firsthand — watch
          them bend the light of distant stars, ring their shadows with trapped photons, and wrap a
          superheated disk across the sky.
        </div>

        <!-- entry -->
        <div
          class="animate-fade-up mt-9 flex flex-col items-center gap-3"
          style="animation-delay: 0.45s"
        >
          <button
            type="button"
            class="group flex items-center gap-3 rounded-md border border-instrument-cyan/40 bg-instrument-cyan/10 px-7 py-3 font-display text-sm tracking-widest text-instrument-cyan transition-all duration-200 hover:bg-instrument-cyan/20 hover:shadow-[0_0_30px_-6px_var(--color-instrument-cyan)]"
            @click="begin(false)"
          >
            <Icon name="compass" :size="18" />
            BEGIN OBSERVATION
          </button>
          <button
            v-if="audio.available.value"
            type="button"
            class="label-mono text-instrument-steel transition-colors hover:text-slate-200"
            @click="begin(true)"
          >
            + enter with ambient sound
          </button>
        </div>

        <div
          class="animate-fade mt-10 label-mono text-[10px] text-slate-400"
          style="animation-delay: 0.7s"
        >
          Drag to orbit · scroll to zoom · switch to Free Flight for W A S D
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.intro-leave-active {
  transition: opacity 0.9s ease;
}
.intro-leave-to {
  opacity: 0;
}
</style>
