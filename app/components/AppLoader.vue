<script setup lang="ts">
import { gsap } from 'gsap'

const heroReady = useHeroReady()
const percent = ref(1)
const done = ref(false)
const show = computed(() => !done.value)

let reduceMotion = false
const progress = { value: 1 }
let fakeTween: gsap.core.Tween | null = null

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  fakeTween = gsap.to(progress, {
    value: 90,
    duration: reduceMotion ? 0.3 : 3.2,
    ease: 'power2.out',
    onUpdate: () => {
      percent.value = Math.round(progress.value)
    },
  })
})

watch(heroReady, (ready) => {
  if (!ready) return
  fakeTween?.kill()
  gsap.to(progress, {
    value: 100,
    duration: reduceMotion ? 0.1 : 0.4,
    ease: 'power1.out',
    onUpdate: () => {
      percent.value = Math.round(progress.value)
    },
    onComplete: () => {
      setTimeout(() => {
        done.value = true
      }, 250)
    },
  })
})
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="show"
      class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <span class="font-mono text-2xl tabular-nums text-ink md:text-3xl">{{ percent }}%</span>
    </div>
  </Transition>
</template>

<style scoped>
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>
