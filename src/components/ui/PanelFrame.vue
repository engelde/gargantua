<script setup lang="ts">
defineProps<{ eyebrow?: string; title?: string }>()
</script>

<template>
  <section class="panel relative px-4 py-3.5">
    <header
      v-if="eyebrow || title || $slots.header"
      class="mb-3 flex items-start justify-between gap-3"
    >
      <div class="min-w-0">
        <div v-if="eyebrow" class="label-mono mb-1 text-instrument-cyan/80">{{ eyebrow }}</div>
        <h2 v-if="title" class="truncate font-display text-sm font-medium text-slate-100">
          {{ title }}
        </h2>
      </div>
      <slot name="header" />
    </header>
    <slot />
  </section>
</template>
