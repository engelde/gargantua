<script setup lang="ts">
import Icon from './Icon.vue'

interface Segment {
  value: string
  label: string
  icon?: string
}
defineProps<{ modelValue: string; options: Segment[] }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <div class="inline-flex rounded-md border border-instrument-steel/25 bg-abyss/60 p-0.5">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors duration-150"
      :class="
        modelValue === o.value
          ? 'bg-instrument-cyan/15 text-instrument-cyan'
          : 'text-instrument-steel hover:text-slate-200'
      "
      :aria-pressed="modelValue === o.value"
      @click="emit('update:modelValue', o.value)"
    >
      <Icon v-if="o.icon" :name="o.icon" :size="14" />
      {{ o.label }}
    </button>
  </div>
</template>
