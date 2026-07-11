<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useResizeObserver, useEventListener } from '@vueuse/core'
import { useObservatory } from '@/composables/useObservatory'

const { renderer, controls, director, perf } = useObservatory()
const { mode, pointerLocked } = controls

const root = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)

onMounted(() => {
  if (!canvas.value) return
  const ok = renderer.mount(canvas.value)
  if (!ok || !renderer.supported.value) {
    failed.value = true
    return
  }
  controls.attach(canvas.value)

  renderer.onUpdate((dt) => controls.update(dt))
  renderer.onUpdate((dt) => director.tick(dt))
  renderer.onUpdate((dt) => perf.tick(dt))
  renderer.onUpdate(() => {
    controls.telemetry.fps = renderer.fps.value
    renderer.setMoving(controls.moving.value)
  })
  renderer.start()
})

useResizeObserver(root, () => renderer.resize())
useEventListener(window, 'resize', () => renderer.resize())

onBeforeUnmount(() => {
  renderer.dispose()
  controls.detach()
})
</script>

<template>
  <div ref="root" class="scanlines absolute inset-0 select-none overflow-hidden">
    <canvas
      ref="canvas"
      class="block h-full w-full"
      :class="mode === 'fly' && !pointerLocked ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'"
    ></canvas>

    <!-- Viewport reticle framing -->
    <div class="pointer-events-none absolute inset-3 z-10 sm:inset-5">
      <span class="bracket bracket-tl"></span>
      <span class="bracket bracket-tr"></span>
      <span class="bracket bracket-bl"></span>
      <span class="bracket bracket-br"></span>
    </div>

    <!-- Free-flight crosshair + hint -->
    <div
      v-if="mode === 'fly'"
      class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
    >
      <div class="relative">
        <div
          class="h-6 w-6 rounded-full border transition-opacity duration-300"
          :style="{
            borderColor: 'color-mix(in srgb, var(--color-instrument-cyan) 60%, transparent)',
            opacity: pointerLocked ? 0.9 : 0.4,
          }"
        ></div>
        <div
          class="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-instrument-cyan"
        ></div>
      </div>
      <Transition name="fade">
        <div
          v-if="!pointerLocked"
          class="label-mono absolute bottom-[18%] left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
        >
          Click to look · <span class="text-instrument-cyan">W A S D</span> to fly · Esc to release
        </div>
      </Transition>
    </div>

    <!-- WebGL unavailable -->
    <div
      v-if="failed"
      class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-void px-8 text-center"
    >
      <div class="font-display text-lg text-gargantua-core">Observation unavailable</div>
      <p class="max-w-sm text-sm text-instrument-steel">
        Gargantua needs WebGL, which this browser or device isn't providing. Try a recent desktop
        browser with hardware acceleration enabled.
      </p>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
