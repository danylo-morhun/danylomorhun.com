<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useSite } from '~/composables/useSite'
import { heroPoster } from '~/data/hero-poster'

const BeamsBackground = defineAsyncComponent(() => import('~/components/BeamsBackground.vue'))

const { t, tm, rt } = useI18n()
const site = useSite()
const headlineWords = computed(() => (tm('hero.headline') as unknown[]).map(entry => rt(entry as never)))

const showBeams = ref(false)

function canAffordBeams() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const { connection, deviceMemory } = navigator as Navigator & {
    connection?: { saveData?: boolean }
    deviceMemory?: number
  }
  return !connection?.saveData && (deviceMemory ?? 8) >= 4 && supportsWebGL2()
}

// three.js needs WebGL2. Without it the inlined poster stays, instead of a renderer error.
function supportsWebGL2() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  }
  catch {
    return false
  }
}

// The beams are decoration: they wait until the page has loaded and the main thread is idle.
function whenIdle(callback: () => void) {
  const schedule = () => 'requestIdleCallback' in window
    ? window.requestIdleCallback(callback, { timeout: 2000 })
    : setTimeout(callback, 300)
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
}

onMounted(() => {
  if (canAffordBeams()) {
    whenIdle(() => {
      showBeams.value = true
    })
  }
})
</script>

<template>
  <section
    id="hero"
    class="relative isolate flex min-h-dvh items-center justify-center overflow-hidden"
  >
    <div
      class="hero-poster absolute inset-0 -z-30"
      :style="{ '--poster': `url(${heroPoster.landscape})`, '--poster-portrait': `url(${heroPoster.portrait})` }"
      aria-hidden="true"
    />
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
    <!-- Keeps the headline and muted subtitle legible when a beam crosses behind them. -->
    <div
      class="hero-scrim pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    />

    <div class="relative mx-auto w-full max-w-3xl px-6 py-24 text-center">
      <h1 class="font-sans text-3xl font-bold leading-[1.15] tracking-tightest sm:leading-none text-ink sm:text-5xl md:text-6xl lg:text-[clamp(3rem,6vw,6rem)]">
        <span class="flex flex-col items-center gap-y-1">
          <template
            v-for="(word, wi) in headlineWords"
            :key="wi"
          >
            <span class="shrink-0 overflow-hidden pb-1">
              <span
                class="word-reveal inline-block whitespace-nowrap"
                :style="{ '--i': wi }"
              >{{ word }}</span>
            </span>{{ wi < headlineWords.length - 1 ? ' ' : '' }}
          </template>
        </span>
      </h1>

      <p
        class="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-muted"
      >
        {{ site.oneLiner }}
      </p>

      <div
        class="hero-ctas mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <a
          href="#contact"
          class="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
        >{{ t('hero.contact') }}</a>
        <a
          href="#work"
          class="rounded-xl border border-line px-6 py-3 text-sm text-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
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
/* Upscaled from a tiny still, so a blur hides the pixels; the scale keeps the blurred edges off screen. */
.hero-poster {
  background-image: var(--poster);
  background-size: cover;
  background-position: center;
  filter: blur(12px);
  transform: scale(1.1);
}

@media (orientation: portrait) {
  .hero-poster {
    background-image: var(--poster-portrait);
  }
}

html.light .hero-poster {
  filter: invert(1) blur(12px);
}

.hero-scrim {
  background:
    radial-gradient(ellipse 60% 45% at 50% 50%, color-mix(in oklch, var(--color-bg) 70%, transparent), transparent 75%),
    linear-gradient(to bottom, transparent 70%, var(--color-bg));
}

/* The entrance is pure CSS, so it starts with the first paint instead of waiting for
   hydration. The subtitle stays still: it is the largest text, so it sets LCP. */
.word-reveal {
  animation: word-rise 850ms cubic-bezier(0.16, 1, 0.3, 1) calc(var(--i) * 45ms) both;
}

.hero-ctas {
  animation: fade-rise 600ms cubic-bezier(0.16, 1, 0.3, 1) 350ms both;
}

@keyframes word-rise {
  from {
    transform: translateY(110%);
  }
}

@keyframes fade-rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
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
  .scroll-cue,
  .word-reveal,
  .hero-ctas {
    animation: none;
  }
}
</style>
