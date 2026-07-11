<script setup lang="ts">
withDefaults(defineProps<{ text: string; align?: 'left' | 'center' }>(), { align: 'left' })
</script>

<template>
  <span class="group relative inline-flex cursor-help items-center" tabindex="0">
    <slot />
    <span
      class="pointer-events-none absolute bottom-full z-50 mb-2 w-max max-w-[230px] rounded border border-instrument-steel/25 bg-abyss/95 px-2.5 py-1.5 text-left text-[11px] leading-snug text-slate-200 opacity-0 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.9)] backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100"
      :class="align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'"
      role="tooltip"
    >
      {{ text }}
    </span>
  </span>
</template>
