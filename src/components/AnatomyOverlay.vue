<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { useObservatory } from '@/composables/useObservatory'
import { useUiState } from '@/composables/useUiState'
import { SHADOW_RADIUS } from '@/utils/math'

const { renderer, params } = useObservatory()
const ui = useUiState()
const camera = renderer.camera

const root = ref<HTMLElement | null>(null)

interface Marker {
  id: string
  label: string
  article: string
  pos: THREE.Vector3
  dotX: number
  dotY: number
  labelX: number
  labelY: number
  flip: boolean
  visible: boolean
}

const markers = ref<Marker[]>([])
const tmp = new THREE.Vector3()
let raf = 0
let lastUpdate = 0
const OFFSET = 62

function rebuild() {
  const di = params.diskInner
  const dOut = params.diskOuter
  const defs: [string, string, string, THREE.Vector3][] = [
    ['horizon', 'Event horizon', 'event-horizon', new THREE.Vector3(0, 0, 0)],
    ['photon', 'Photon ring', 'photon-sphere', new THREE.Vector3(0, SHADOW_RADIUS, 0)],
    ['disk', 'Accretion disk', 'accretion-disk', new THREE.Vector3(dOut * 0.82, 0, 0)],
    ['isco', 'Inner edge · ISCO', 'isco', new THREE.Vector3(-di, 0, 0)],
  ]
  if (params.spin > 0.3) defs.push(['ergo', 'Ergosphere', 'ergosphere', new THREE.Vector3(0, 0, 1.3)])
  if (params.jet > 0.05) defs.push(['jet', 'Relativistic jet', 'jets', new THREE.Vector3(0, dOut * 0.95, 0)])
  markers.value = defs.map(([id, label, article, pos]) => ({
    id, label, article, pos, dotX: 0, dotY: 0, labelX: 0, labelY: 0, flip: false, visible: false,
  }))
}

function project(now: number) {
  raf = requestAnimationFrame(project)
  if (now - lastUpdate < 40) return
  lastUpdate = now
  const el = root.value
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight
  camera.updateMatrixWorld()
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert()

  const list = markers.value
  for (const m of list) {
    tmp.copy(m.pos).project(camera)
    const x = (tmp.x * 0.5 + 0.5) * w
    const y = (-tmp.y * 0.5 + 0.5) * h
    m.visible = tmp.z < 1 && x > -20 && x < w + 20 && y > -30 && y < h + 30
    m.dotX = x
    m.dotY = y
    m.flip = x > w * 0.6
    m.labelX = m.flip ? x - OFFSET : x + OFFSET
    m.labelY = y
  }

  // De-overlap labels within each side (dots stay fixed on their feature).
  for (const flip of [false, true]) {
    const side = list.filter((m) => m.visible && m.flip === flip).sort((a, b) => a.labelY - b.labelY)
    for (let i = 1; i < side.length; i++) {
      if (side[i].labelY - side[i - 1].labelY < 24) side[i].labelY = side[i - 1].labelY + 24
    }
  }
}

function openArticle(id: string) {
  ui.codexArticle = id
  ui.codex = true
}

function start() {
  cancelAnimationFrame(raf)
  rebuild()
  lastUpdate = 0
  raf = requestAnimationFrame(project)
}

watch(() => ui.anatomy, (on) => (on ? start() : cancelAnimationFrame(raf)))
watch(() => [params.diskInner, params.diskOuter, params.spin, params.jet], () => {
  if (ui.anatomy) rebuild()
})

onMounted(() => {
  if (ui.anatomy) start()
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <div ref="root" class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
    <template v-if="ui.anatomy && !ui.uiHidden">
      <!-- leader lines -->
      <svg class="absolute inset-0 h-full w-full" aria-hidden="true">
        <line
          v-for="m in markers"
          v-show="m.visible"
          :key="m.id + '-l'"
          :x1="m.dotX"
          :y1="m.dotY"
          :x2="m.labelX"
          :y2="m.labelY"
          stroke="var(--color-instrument-cyan)"
          stroke-opacity="0.4"
          stroke-width="1"
        />
      </svg>

      <!-- dots -->
      <span
        v-for="m in markers"
        v-show="m.visible"
        :key="m.id + '-d'"
        class="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-instrument-cyan shadow-[0_0_7px_var(--color-instrument-cyan)]"
        :style="{ left: `${m.dotX}px`, top: `${m.dotY}px` }"
      ></span>

      <!-- labels -->
      <button
        v-for="m in markers"
        v-show="m.visible"
        :key="m.id + '-b'"
        type="button"
        class="pointer-events-auto absolute rounded border border-instrument-cyan/25 bg-void/75 px-2 py-0.5 backdrop-blur transition-colors hover:border-instrument-cyan/60 hover:bg-void/90"
        :style="{
          left: `${m.labelX}px`,
          top: `${m.labelY}px`,
          transform: m.flip ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
        }"
        @click="openArticle(m.article)"
      >
        <span class="label-mono whitespace-nowrap text-instrument-cyan">{{ m.label }}</span>
      </button>
    </template>
  </div>
</template>
