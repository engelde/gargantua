<script setup lang="ts">
import Icon from './Icon.vue'

withDefaults(
  defineProps<{ icon: string; label: string; title?: string; active?: boolean }>(),
  { active: false },
)
</script>

<template>
  <button
    type="button"
    :title="title ?? label"
    :aria-label="label"
    :aria-pressed="active"
    class="flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-150"
    :class="
      active
        ? 'border-instrument-cyan/50 bg-instrument-cyan/10 text-instrument-cyan'
        : 'border-instrument-steel/20 bg-abyss/50 text-instrument-steel hover:border-instrument-steel/40 hover:text-slate-100'
    "
  >
    <Icon :name="icon" :size="18" />
  </button>
</template>
