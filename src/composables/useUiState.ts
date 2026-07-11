import { reactive } from 'vue'

/** Shared open/closed state for the instrument panels and overlays. */
const state = reactive({
  intro: true, // boot/title sequence visible
  tune: false, // parameter drawer
  presets: false, // vantage popover
  codex: false, // Codex encyclopedia
  codexArticle: 'lensing', // active Codex article id
  anatomy: false, // interactive anatomy overlay
  shortcuts: false, // keyboard-shortcuts overlay
  uiHidden: false, // clean/cinematic view (all panels hidden)
})

export function useUiState() {
  return state
}
