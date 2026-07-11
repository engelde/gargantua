<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="props.modelValue"
    :aria-label="label"
    class="flex items-center gap-2.5"
    @click="emit('update:modelValue', !props.modelValue)"
  >
    <span
      class="relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
      :class="props.modelValue ? 'bg-instrument-cyan/70' : 'bg-instrument-steel/40'"
    >
      <span
        class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
        :class="props.modelValue ? 'translate-x-4' : 'translate-x-0'"
      ></span>
    </span>
    <span v-if="label" class="text-xs text-slate-300">{{ label }}</span>
  </button>
</template>
