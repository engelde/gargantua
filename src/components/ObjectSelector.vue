<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Icon from './ui/Icon.vue'
import { useObservatory } from '@/composables/useObservatory'
import { formatMassSolar } from '@/utils/math'

const { objects } = useObservatory()
const { objects: bhList, activeObject, activeId, selectObject } = objects

const open = ref(false)
const root = ref<HTMLElement | null>(null)
onClickOutside(root, () => (open.value = false))

const kindColor: Record<string, string> = {
  fictional: '#fff3d6',
  stellar: '#4fd8e8',
  supermassive: '#f5a623',
  ultramassive: '#b57bff',
}
const kindLabel: Record<string, string> = {
  fictional: 'Fictional · Interstellar',
  stellar: 'Stellar-mass',
  supermassive: 'Supermassive',
  ultramassive: 'Ultramassive',
}

function pick(id: string) {
  selectObject(id)
  open.value = false
}
</script>

<template>
  <div ref="root" class="pointer-events-auto relative">
    <button
      type="button"
      class="panel flex items-center gap-2.5 px-3.5 py-2 transition-colors hover:border-instrument-steel/40"
      :aria-expanded="open"
      aria-label="Select black hole"
      @click="open = !open"
    >
      <span
        class="h-2 w-2 rounded-full"
        :style="{
          background: kindColor[activeObject.kind],
          boxShadow: `0 0 8px ${kindColor[activeObject.kind]}`,
        }"
      ></span>
      <span class="font-display text-sm text-slate-100">{{ activeObject.name }}</span>
      <span class="hidden text-instrument-steel sm:inline">·</span>
      <span class="label-mono hidden sm:inline">{{ formatMassSolar(activeObject.massSolar) }}</span>
      <Icon
        name="chevronDown"
        :size="14"
        class="text-instrument-steel transition-transform"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <Transition name="pop">
      <div
        v-if="open"
        class="panel absolute left-1/2 top-full mt-2 w-[320px] max-w-[90vw] -translate-x-1/2 p-1.5"
      >
        <div class="label-mono px-2.5 py-2 text-instrument-cyan/80">Observed object</div>
        <button
          v-for="o in bhList"
          :key="o.id"
          type="button"
          class="flex w-full items-start gap-3 rounded px-2.5 py-2.5 text-left transition-colors"
          :class="o.id === activeId ? 'bg-instrument-cyan/10' : 'hover:bg-white/5'"
          @click="pick(o.id)"
        >
          <span
            class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            :style="{ background: kindColor[o.kind], boxShadow: `0 0 7px ${kindColor[o.kind]}` }"
          ></span>
          <span class="min-w-0 flex-1">
            <span class="flex items-baseline justify-between gap-2">
              <span class="truncate text-sm text-slate-100">{{ o.name }}</span>
              <span class="readout shrink-0 text-[11px] text-instrument-cyan">{{
                formatMassSolar(o.massSolar)
              }}</span>
            </span>
            <span class="mt-0.5 block text-[11px] leading-snug text-instrument-steel">{{
              o.tagline
            }}</span>
            <span class="mt-1 inline-block text-[9px] uppercase tracking-wider text-instrument-steel/70">{{
              kindLabel[o.kind]
            }}</span>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s var(--ease-out-expo);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
