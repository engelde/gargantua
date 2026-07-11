<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import Icon from './ui/Icon.vue'
import { useObservatory } from '@/composables/useObservatory'
import { useUiState } from '@/composables/useUiState'
import { CODEX_ARTICLES, CODEX_SECTIONS, getArticle } from '@/data/codex'
import { GLOSSARY } from '@/data/glossary'
import { PRESETS } from '@/data/presets'
import type { CodexDemo, RenderMode } from '@/types/simulation'

const { objects, director, applyMode } = useObservatory()
const ui = useUiState()

const q = ref('')
const deeperOpen = ref(false)
const mainEl = ref<HTMLElement | null>(null)

const article = computed(() => getArticle(ui.codexArticle) ?? CODEX_ARTICLES[0])
const sectionTitle = (id: string) => CODEX_SECTIONS.find((s) => s.id === id)?.title ?? ''

const results = computed(() => {
  const query = q.value.trim().toLowerCase()
  if (!query) return []
  const seen = new Set<string>()
  const out: { id: string; title: string; kind: string }[] = []
  for (const a of CODEX_ARTICLES) {
    const hay = `${a.title} ${a.summary} ${a.body.join(' ')} ${a.deeper?.join(' ') ?? ''}`.toLowerCase()
    if (hay.includes(query) && !seen.has(a.id)) {
      seen.add(a.id)
      out.push({ id: a.id, title: a.title, kind: sectionTitle(a.section) })
    }
  }
  for (const g of GLOSSARY) {
    if (!g.articleId || seen.has(g.articleId)) continue
    if (`${g.term} ${g.definition}`.toLowerCase().includes(query)) {
      seen.add(g.articleId)
      out.push({ id: g.articleId, title: g.term, kind: 'Glossary' })
    }
  }
  return out.slice(0, 24)
})

function select(id: string) {
  ui.codexArticle = id
  q.value = ''
  nextTick(() => mainEl.value?.scrollTo({ top: 0 }))
}

watch(article, () => (deeperOpen.value = false))

function seeIt(demo: CodexDemo) {
  if (demo.objectId) objects.selectObject(demo.objectId)
  if (demo.mode) applyMode(demo.mode as RenderMode)
  if (demo.preset) {
    const p = PRESETS.find((x) => x.id === demo.preset)
    if (p) director.goToPose(p, 2.4, p.params)
  }
  if (demo.annotate) ui.anatomy = true
  ui.codex = false
}
</script>

<template>
  <Transition name="codex">
    <div
      v-if="ui.codex"
      class="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6"
      @click.self="ui.codex = false"
    >
      <div class="absolute inset-0 bg-void/80 backdrop-blur-md"></div>

      <div class="panel relative z-10 flex h-[86vh] w-full max-w-5xl overflow-hidden">
        <!-- Sidebar -->
        <aside class="flex w-[260px] shrink-0 flex-col border-r border-instrument-steel/15">
          <div class="border-b border-instrument-steel/15 p-4">
            <div class="mb-3 flex items-center gap-2">
              <Icon name="info" :size="16" class="text-instrument-cyan" />
              <span class="font-display text-sm tracking-widest text-slate-100">CODEX</span>
            </div>
            <label class="relative block">
              <input
                v-model="q"
                type="text"
                placeholder="Search the Codex…"
                class="w-full rounded-md border border-instrument-steel/25 bg-void/60 px-3 py-2 text-xs text-slate-100 placeholder:text-instrument-steel/70 focus:border-instrument-cyan/50 focus:outline-none"
              />
            </label>
          </div>

          <nav class="min-h-0 flex-1 overflow-y-auto p-2">
            <!-- Search results -->
            <div v-if="q.trim()">
              <button
                v-for="r in results"
                :key="r.id + r.kind"
                type="button"
                class="flex w-full items-baseline justify-between gap-2 rounded px-2.5 py-2 text-left transition-colors hover:bg-white/5"
                @click="select(r.id)"
              >
                <span class="truncate text-sm text-slate-200">{{ r.title }}</span>
                <span class="shrink-0 text-[9px] uppercase tracking-wider text-instrument-steel/70">{{ r.kind }}</span>
              </button>
              <p v-if="!results.length" class="px-2.5 py-3 text-xs text-instrument-steel">No matches.</p>
            </div>

            <!-- Sections -->
            <div v-else>
              <section v-for="s in CODEX_SECTIONS" :key="s.id" class="mb-3">
                <div class="label-mono px-2.5 py-1.5 text-instrument-cyan/70">{{ s.title }}</div>
                <button
                  v-for="aid in s.articleIds"
                  :key="aid"
                  type="button"
                  class="block w-full truncate rounded px-2.5 py-1.5 text-left text-sm transition-colors"
                  :class="aid === ui.codexArticle ? 'bg-instrument-cyan/10 text-instrument-cyan' : 'text-slate-300 hover:text-slate-100'"
                  @click="select(aid)"
                >
                  {{ getArticle(aid)?.title }}
                </button>
              </section>
            </div>
          </nav>
        </aside>

        <!-- Reading pane -->
        <div ref="mainEl" class="relative min-w-0 flex-1 overflow-y-auto">
          <button
            type="button"
            class="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded bg-abyss/70 text-instrument-steel hover:text-slate-100"
            aria-label="Close Codex"
            @click="ui.codex = false"
          >
            <Icon name="close" :size="18" />
          </button>

          <article class="mx-auto max-w-2xl px-6 py-8 sm:px-10">
            <div class="label-mono mb-2 text-instrument-cyan/80">{{ sectionTitle(article.section) }}</div>
            <h1 class="mb-3 font-display text-3xl text-gargantua-core">{{ article.title }}</h1>
            <p class="mb-5 text-base leading-relaxed text-slate-200">{{ article.summary }}</p>

            <div class="space-y-4">
              <p v-for="(p, i) in article.body" :key="i" class="leading-relaxed text-slate-300">{{ p }}</p>
            </div>

            <button
              v-if="article.demo"
              type="button"
              class="mt-6 inline-flex items-center gap-2 rounded-md border border-instrument-cyan/40 bg-instrument-cyan/10 px-4 py-2 text-xs font-medium tracking-wide text-instrument-cyan transition-colors hover:bg-instrument-cyan/20"
              @click="seeIt(article.demo)"
            >
              <Icon name="target" :size="15" />
              See it in the simulation
            </button>

            <!-- Go deeper -->
            <div v-if="article.deeper || article.equations" class="mt-7">
              <button
                type="button"
                class="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-instrument-steel transition-colors hover:text-instrument-cyan"
                @click="deeperOpen = !deeperOpen"
              >
                <Icon :name="deeperOpen ? 'chevronDown' : 'chevronRight'" :size="14" />
                {{ deeperOpen ? 'Hide detail' : 'Go deeper' }}
              </button>
              <Transition name="deeper">
                <div
                  v-if="deeperOpen"
                  class="mt-4 space-y-4 border-l-2 border-instrument-cyan/25 pl-4"
                >
                  <p v-for="(p, i) in article.deeper" :key="i" class="text-sm leading-relaxed text-slate-300">
                    {{ p }}
                  </p>
                  <div
                    v-for="(eq, i) in article.equations"
                    :key="'eq' + i"
                    class="rounded-md border border-instrument-steel/20 bg-void/50 px-4 py-3"
                  >
                    <div class="readout text-center text-sm text-gargantua-core">{{ eq.expr }}</div>
                    <div v-if="eq.caption" class="mt-1.5 text-center text-[11px] text-instrument-steel">
                      {{ eq.caption }}
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Facts -->
            <dl v-if="article.facts" class="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-instrument-steel/12 pt-5">
              <div v-for="f in article.facts" :key="f.label">
                <dt class="label-mono mb-1">{{ f.label }}</dt>
                <dd class="readout text-sm text-slate-100">{{ f.value }}</dd>
              </div>
            </dl>

            <!-- Related -->
            <div v-if="article.related?.length" class="mt-7 border-t border-instrument-steel/12 pt-5">
              <div class="label-mono mb-2.5">Related</div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="rid in article.related"
                  :key="rid"
                  type="button"
                  class="rounded-full border border-instrument-steel/25 px-3 py-1 text-[11px] text-instrument-steel transition-colors hover:border-instrument-cyan/40 hover:text-instrument-cyan"
                  @click="select(rid)"
                >
                  {{ getArticle(rid)?.title }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.codex-enter-active,
.codex-leave-active {
  transition: opacity 0.3s ease;
}
.codex-enter-from,
.codex-leave-to {
  opacity: 0;
}
.deeper-enter-active,
.deeper-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s var(--ease-out-expo);
}
.deeper-enter-from,
.deeper-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
