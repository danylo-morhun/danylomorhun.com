<script setup lang="ts">
import { gsap } from 'gsap'
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useSite } from '~/composables/useSite'

const BeamsBackground = defineAsyncComponent(() => import('~/components/BeamsBackground.vue'))

const { t, tm, rt } = useI18n()
const site = useSite()
const headlineWords = computed(() => (tm('hero.headline') as unknown[]).map(entry => rt(entry as never)))

const heroRef = ref<HTMLElement | null>(null)
const subtext = ref<HTMLElement | null>(null)
const ctas = ref<HTMLElement | null>(null)

const nuxtApp = useNuxtApp()
const introDone = useHeroIntro()
const showBeams = ref(false)

let hasStarted = false

function startEntrance() {
  if (hasStarted) return
  hasStarted = true

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const words = heroRef.value?.querySelectorAll<HTMLElement>('.word-reveal') ?? []

  gsap.timeline()
    .from(words, {
      yPercent: 110,
      duration: 0.85,
      ease: 'expo.out',
      stagger: 0.045,
    })
    .from(subtext.value, { opacity: 0, y: 20, duration: 0.6, ease: 'expo.out' }, '-=0.5')
    .from(ctas.value, { opacity: 0, y: 20, duration: 0.6, ease: 'expo.out' }, '-=0.4')
}

function canAffordBeams() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const { connection, deviceMemory } = navigator as Navigator & {
    connection?: { saveData?: boolean }
    deviceMemory?: number
  }
  return !connection?.saveData && (deviceMemory ?? 8) >= 4
}

// On a first load the intro lifts first, so the entrance is actually seen.
// On a client-side return to home there's no intro to wait for.
const waitsForIntro = Boolean(nuxtApp.isHydrating) && !introDone.value

watch(introDone, (done) => {
  if (done) startEntrance()
})

onMounted(() => {
  if (!waitsForIntro) startEntrance()

  if (canAffordBeams()) {
    setTimeout(() => {
      showBeams.value = true
    }, 800)
  }
})
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden"
  >
    <ClientOnly>
      <div
        v-if="showBeams"
        class="absolute inset-0 -z-20"
      >
        <BeamsBackground
          light-color="#ffffff"
          :beam-width="3"
          :beam-height="30"
          :beam-number="20"
          :speed="2"
          :noise-intensity="1.75"
          :scale="0.2"
          :rotation="30"
        />
      </div>
    </ClientOnly>

    <div
      class="absolute inset-0 -z-10 bg-bg/40"
      aria-hidden="true"
    />
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-b from-bg/50 via-transparent to-bg/70"
      aria-hidden="true"
    />

    <div class="relative mx-auto w-full max-w-3xl px-6 py-24 text-center">
      <h1 class="font-sans text-3xl font-bold leading-[1.15] tracking-tightest text-ink sm:text-5xl md:text-6xl lg:text-[clamp(3rem,6vw,6rem)]">
        <span class="flex flex-col items-center gap-y-1">
          <template
            v-for="(word, wi) in headlineWords"
            :key="wi"
          >
            <span class="shrink-0 overflow-hidden pb-1">
              <span class="word-reveal inline-block whitespace-nowrap">{{ word }}</span>
            </span>{{ wi < headlineWords.length - 1 ? ' ' : '' }}
          </template>
        </span>
      </h1>

      <p
        ref="subtext"
        class="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-muted"
      >
        {{ site.oneLiner }}
      </p>

      <div
        ref="ctas"
        class="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="#contact"
          class="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
        >{{ t('hero.contact') }}</a>
        <a
          href="#work"
          class="rounded-xl border border-line bg-ink/10 px-6 py-3 text-sm text-ink transition-transform duration-200 hover:scale-[1.03] hover:bg-ink/15 active:scale-[0.97]"
        >{{ t('hero.viewWork') }}</a>
      </div>
      <span id="hero-end" />
    </div>

    <a
      href="#work"
      :aria-label="t('hero.scrollToWork')"
      class="scroll-cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-muted transition-colors duration-200 hover:text-ink lg:block"
    >
      <AppIcon
        name="arrow-down-s-line"
        :size="20"
      />
    </a>
  </section>
</template>

<style scoped>
.word-reveal {
  will-change: transform;
}

.scroll-cue {
  animation: float 2.2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, 6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue {
    animation: none;
  }
}
</style>
