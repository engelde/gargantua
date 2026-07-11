import type { Ref } from 'vue'
import { useEventListener, useFullscreen } from '@vueuse/core'
import type { Observatory } from './useObservatory'
import { useUiState } from './useUiState'
import { PRESETS } from '@/data/presets'
import { TOUR } from '@/data/tour'

/** Global keyboard shortcuts. Guarded against text fields and browser combos. */
export function useKeyboardShortcuts(obs: Observatory, fullscreenTarget: Ref<HTMLElement | null>) {
  const { objects, director, applyMode, params } = obs
  const ui = useUiState()
  const { toggle: toggleFullscreen } = useFullscreen(fullscreenTarget)

  useEventListener(window, 'keydown', (e) => {
    const tag = (document.activeElement?.tagName || '').toLowerCase()
    if (tag === 'input' || tag === 'textarea') return
    if (e.ctrlKey || e.metaKey || e.altKey) return

    // Object selection 1–5
    if (e.key >= '1' && e.key <= '5') {
      const obj = objects.objects[parseInt(e.key, 10) - 1]
      if (obj) objects.selectObject(obj.id)
      return
    }

    // Tour chapter navigation with arrows (when playing)
    if (director.isPlaying.value) {
      if (e.key === 'ArrowRight') {
        director.next()
        e.preventDefault()
        return
      }
      if (e.key === 'ArrowLeft') {
        director.prev()
        e.preventDefault()
        return
      }
    }

    switch (e.key.toLowerCase()) {
      case 't':
        director.isPlaying.value ? director.togglePause() : director.playTour(TOUR)
        break
      case 'c':
        applyMode(params.mode === 'cinematic' ? 'scientific' : 'cinematic')
        break
      case 'a':
        ui.anatomy = !ui.anatomy
        break
      case 'k':
        ui.codex = !ui.codex
        break
      case 'v':
        ui.presets = !ui.presets
        break
      case 'h':
        ui.uiHidden = !ui.uiHidden
        break
      case 'f':
        void toggleFullscreen()
        break
      case 'r': {
        const p = PRESETS[0]
        director.goToPose(p, 2.2, p.params)
        break
      }
      case '?':
        ui.shortcuts = !ui.shortcuts
        break
    }
  })
}
