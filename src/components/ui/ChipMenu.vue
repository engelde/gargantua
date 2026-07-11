<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Icon from './Icon.vue'

interface Option {
  value: string
  label: string
}
defineProps<{ label: string; value: string; active: string; options: Option[] }>()
const emit = defineEmits<{ select: [string] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
onClickOutside(root, () => (open.value = false))

function pick(v: string) {
  emit('select', v)
  open.value = false
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="-mx-1 flex items-baseline gap-1.5 rounded px-1 py-0.5 transition-colors hover:bg-white/5"
      :aria-expanded="open"
      :aria-label="`${label}: ${value}`"
      @click="open = !open"
    >
      <span class="label-mono">{{ label }}</span>
      <span class="readout text-xs text-instrument-cyan">{{ value }}</span>
      <Icon
        name="chevronDown"
        :size="11"
        class="text-instrument-steel transition-transform"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <Transition name="chip-pop">
      <div v-if="open" class="panel absolute right-0 top-full mt-2 w-40 p-1">
        <button
          v-for="o in options"
          :key="o.value"
          type="button"
          class="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors"
          :class="o.value === active ? 'bg-instrument-cyan/10 text-instrument-cyan' : 'text-slate-300 hover:bg-white/5'"
          @click="pick(o.value)"
        >
          {{ o.label }}
          <Icon v-if="o.value === active" name="target" :size="12" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chip-pop-enter-active,
.chip-pop-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s var(--ease-out-expo);
}
.chip-pop-enter-from,
.chip-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
