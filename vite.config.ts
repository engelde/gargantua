import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Set DEPLOY_TARGET=gh-pages to build with the correct base path for the
// github.com/engelde/gargantua project pages URL. Vercel and local dev use '/'.
const base = process.env.DEPLOY_TARGET === 'gh-pages' ? '/gargantua/' : '/'

// GitHub Pages has no SPA rewrite (unlike vercel.json). Duplicate index.html as
// 404.html so deep links load the app; main.ts then snaps the URL back to base.
function spaFallback(): Plugin {
  let outDir = 'dist'
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const index = resolve(outDir, 'index.html')
      if (existsSync(index)) copyFileSync(index, resolve(outDir, '404.html'))
    },
  }
}

export default defineConfig({
  base,
  plugins: [vue(), tailwindcss(), spaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split the heavy renderer + framework into cacheable vendor chunks.
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/@vue') || id.includes('node_modules/vue') || id.includes('@vueuse'))
            return 'vendor'
          return undefined
        },
      },
    },
  },
})
