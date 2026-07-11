import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Self-hosted fonts — no external CDN, keeps the observatory offline-capable.
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'

// Single-page app with no routing: snap any non-home path back to home.
const homePath = import.meta.env.BASE_URL
if (window.location.pathname !== homePath) {
  window.history.replaceState(null, '', homePath)
}

createApp(App).mount('#app')
