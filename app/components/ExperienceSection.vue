<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'
import { experience } from '~/data/experience'

const list = ref<HTMLElement | null>(null)

onMounted(async () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || !list.value) return

  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const items = list.value.querySelectorAll('.reveal-item')
  items.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    })
  })
})
</script>

<template>
  <section id="experience" class="border-t border-line bg-surface/40">
    <div class="mx-auto max-w-content px-6 py-24 md:py-32">
      <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">Experience</h2>

      <div ref="list" class="mt-16 space-y-12">
        <div
          v-for="entry in experience"
          :key="entry.company"
          class="reveal-item grid gap-3 sm:grid-cols-[140px_1fr] sm:gap-10"
        >
          <p class="font-mono text-xs text-muted">{{ entry.start }} — {{ entry.end }}</p>

          <div class="relative border-l border-line pl-8">
            <span class="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            <h3 class="text-lg font-medium text-ink md:text-xl">
              {{ entry.role }} <span class="text-muted">· {{ entry.company }}</span>
            </h3>
            <p class="mt-2 max-w-[60ch] leading-relaxed text-muted">{{ entry.summary }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
