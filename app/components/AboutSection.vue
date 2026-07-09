<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'
import { useSite } from '~/composables/useSite'

const { t } = useI18n()
const site = useSite()
const section = ref<HTMLElement | null>(null)

onMounted(async () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || !section.value) return

  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsap.from(section.value.querySelectorAll('.reveal-item'), {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: section.value,
      start: 'top 80%',
      once: true,
    },
  })
})
</script>

<template>
  <section id="about" ref="section" class="border-t border-line">
    <div class="mx-auto grid max-w-content gap-10 px-6 py-24 md:py-32 lg:grid-cols-12 lg:gap-16">
      <div class="reveal-item lg:col-span-4">
        <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">{{ t('about.heading') }}</h2>
        <ul class="mt-6 flex flex-wrap gap-2">
          <li
            v-for="tech in site.stack"
            :key="tech"
            class="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted"
          >{{ tech }}</li>
        </ul>
      </div>

      <div class="reveal-item space-y-5 lg:col-span-8">
        <p v-for="paragraph in site.bio" :key="paragraph" class="max-w-[65ch] text-lg leading-relaxed text-muted">
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>
