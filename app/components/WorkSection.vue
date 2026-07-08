<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'
import { projects } from '~/data/projects'

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
      y: 24,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })
  })
})
</script>

<template>
  <section id="work" class="border-t border-line">
    <div class="mx-auto max-w-content px-6 py-24 md:py-32">
      <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">Selected work</h2>
      <p class="mt-3 max-w-[60ch] text-muted">
        Four production builds across fintech and B2B SaaS — the architecture calls and the outcomes they produced.
      </p>

      <div ref="list" class="mt-16 divide-y divide-line">
        <article
          v-for="project in projects"
          :key="project.name"
          class="reveal-item grid gap-6 py-10 first:pt-0 lg:grid-cols-12 lg:gap-8"
        >
          <div class="lg:col-span-5">
            <p class="font-mono text-xs text-accent">{{ project.tag }}</p>
            <h3 class="mt-2 text-xl font-medium text-ink md:text-2xl">{{ project.name }}</h3>
            <p class="mt-2 text-sm text-muted">{{ project.role }}</p>
          </div>

          <p class="text-base leading-relaxed text-muted lg:col-span-4">
            {{ project.description }}
          </p>

          <div class="flex flex-row gap-8 lg:col-span-3 lg:flex-col lg:gap-4">
            <div v-for="metric in project.metrics" :key="metric.label">
              <p class="text-2xl font-semibold text-ink">{{ metric.value }}</p>
              <p class="mt-1 max-w-[24ch] text-xs text-muted">{{ metric.label }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
