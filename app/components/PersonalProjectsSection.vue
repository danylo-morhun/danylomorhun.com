<script setup lang="ts">
import { RiArrowRightUpLine } from '@remixicon/vue'
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'
import { personalProjects } from '~/data/personal-projects'

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
  <section id="lab" class="border-t border-line">
    <div class="mx-auto max-w-content px-6 py-24 md:py-32">
      <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">Personal projects</h2>
      <p class="mt-3 max-w-[60ch] text-muted">
        Things I've built for myself, end to end — no client, no handoff, every decision mine to own.
      </p>

      <div ref="list" class="mt-16 grid gap-8 md:grid-cols-3">
        <NuxtLink
          v-for="project in personalProjects"
          :key="project.slug"
          :to="`/lab/${project.slug}`"
          class="reveal-item group flex flex-col"
        >
          <div class="relative overflow-hidden rounded-xl border border-line shadow-lg">
            <img
              :src="project.gallery[0]?.src"
              :alt="project.gallery[0]?.alt ?? project.name"
              width="960"
              height="600"
              loading="lazy"
              class="aspect-[8/5] w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            >
          </div>

          <p class="mt-5 font-mono text-xs text-accent">{{ project.tag }}</p>
          <h3 class="mt-2 flex items-center gap-1.5 text-lg font-medium text-ink">
            <span class="underline decoration-line underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">{{ project.name }}</span>
            <RiArrowRightUpLine
              size="16px"
              class="mt-0.5 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
            />
          </h3>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            {{ project.overview }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
