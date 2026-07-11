<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue: number
    min: number
    max: number
    step?: number
    unit?: string
    format?: (v: number) => string
  }>(),
  { step: 0.01 },
)
const emit = defineEmits<{ 'update:modelValue': [number] }>()

const display = computed(() =>
  props.format
    ? props.format(props.modelValue)
    : `${props.modelValue.toFixed(2)}${props.unit ? ` ${props.unit}` : ''}`,
)

function onInput(e: Event) {
  emit('update:modelValue', parseFloat((e.target as HTMLInputElement).value))
}
</script>

<template>
  <label class="block select-none">
    <div class="mb-1.5 flex items-baseline justify-between gap-3">
      <span class="label-mono">{{ label }}</span>
      <span class="readout text-xs text-instrument-cyan">{{ display }}</span>
    </div>
    <input
      class="gg-range"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :aria-label="label"
      @input="onInput"
    />
  </label>
</template>
