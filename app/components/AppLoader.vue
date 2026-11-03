<script setup lang="ts">
import { gsap } from 'gsap'

// First-load intro on the home page only, capped so it never costs a reader more
// than a second. CSS in this file also lifts it without JS or if the bundle fails.
const INTRO_MS = 800

const nuxtApp = useNuxtApp()
const introDone = useHeroIntro()

const visible = ref(import.meta.server || Boolean(nuxtApp.isHydrating))
const percent = ref(1)

function finish() {
  visible.value = false
  introDone.value = true
}

useHead({
  noscript: [{ innerHTML: '<style>.app-loader{display:none}</style>' }],
})

onMounted(() => {
  if (!visible.value) {
    introDone.value = true
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish()
    return
  }

  // The counter is decoration; a timer, not the animation frame loop, decides when
  // the intro ends, so a busy main thread can't hold the page hostage.
  const progress = { value: 1 }
  const counter = gsap.to(progress, {
    value: 100,
    duration: INTRO_MS / 1000,
    ease: 'power2.out',
    onUpdate: () => {
      percent.value = Math.round(progress.value)
    },
  })

  setTimeout(() => {
    counter.kill()
    percent.value = 100
    finish()
  }, INTRO_MS)
})
</script>

<template>
  <Transition
    name="loader-fade"
    type="transition"
  >
    <div
      v-if="visible"
      class="app-loader pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <span class="font-mono text-2xl tabular-nums text-ink md:text-3xl">{{ percent }}%</span>
    </div>
  </Transition>
</template>

<style>
.app-loader {
  animation: app-loader-failsafe 1ms linear 2500ms forwards;
}

.loader-fade-leave-active {
  transition: opacity 300ms ease-out;
}

.loader-fade-leave-to {
  opacity: 0;
}

@keyframes app-loader-failsafe {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-loader {
    display: none;
  }
}
</style>
