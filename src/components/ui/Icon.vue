<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 18 })

// Stroke-based 24×24 glyphs. Inner markup is injected so we can mix primitives.
const paths: Record<string, string> = {
  orbit:
    '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(-20 12 12)"/><circle cx="20" cy="8.6" r="1" fill="currentColor" stroke="none"/>',
  flight:
    '<path d="M12 2.5c2.7 2.6 4 6.2 4 10.5l-4 3-4-3c0-4.3 1.3-7.9 4-10.5z"/><path d="M8 13.5 5 18l3-1.2M16 13.5l3 4.5-3-1.2"/><path d="M12 16.5V21"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
  pause: '<path d="M8.5 5v14M15.5 5v14"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/>',
  vantage:
    '<rect x="3" y="7.5" width="18" height="11.5" rx="2"/><circle cx="12" cy="13.2" r="3.2"/><path d="M8.5 7.5 10 5h4l1.5 2.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01"/>',
  tune:
    '<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="10" cy="7" r="2.2" fill="#0a0e16"/><circle cx="16" cy="12" r="2.2" fill="#0a0e16"/><circle cx="8" cy="17" r="2.2" fill="#0a0e16"/>',
  audioOn:
    '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/>',
  audioOff:
    '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4z"/><path d="m16.5 10 4 4M20.5 10l-4 4"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5"/><path d="M4 4.5V9h4.5"/>',
  chevronRight: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  chevronDown: '<path d="M5.5 9.5 12 16l6.5-6.5"/>',
  warning: '<path d="M12 3.5 21.5 20H2.5z"/><path d="M12 10v4.5M12 17.5h.01"/>',
  target:
    '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 1.5v3.5M12 19v3.5M1.5 12H5M19 12h3.5"/>',
  star: '<path d="M12 4l2.1 5.2 5.6.4-4.3 3.6 1.4 5.4L12 21l-4.8 3.6 1.4-5.4-4.3-3.6 5.6-.4z" transform="scale(0.9) translate(1.3 -1)"/>',
  compass:
    '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z" fill="currentColor" stroke="none"/>',
  route: '<circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8 16.5c6-1 8-3.5 8-8"/>',
  camera:
    '<rect x="3" y="6.5" width="18" height="13" rx="2.2"/><circle cx="12" cy="13" r="3.4"/><circle cx="17" cy="10" r="0.7" fill="currentColor" stroke="none"/>',
  keyboard:
    '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 9.5h.01M9 9.5h.01M12 9.5h.01M15 9.5h.01M18 9.5h.01M6 12.5h.01M9 12.5h.01M15 12.5h.01M18 12.5h.01M8.5 15.5h7"/>',
  fullscreen: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  eyeOff:
    '<path d="M3 3l18 18"/><path d="M10.6 10.7a2 2 0 0 0 2.8 2.8"/><path d="M9.5 5.2A9 9 0 0 1 21 12a9.3 9.3 0 0 1-1.3 2.1M6 6.2A9.2 9.2 0 0 0 3 12a9 9 0 0 0 11.3 6.3"/>',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="paths[name] ?? ''"
  ></svg>
</template>
