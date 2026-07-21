<script setup lang="ts">
import { RiArrowRightUpLine } from '@remixicon/vue'
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'
import { useProjects } from '~/composables/useProjects'

const { t } = useI18n()
const localePath = useLocalePath()
const projects = useProjects()
const list = ref<HTMLElement | null>(null)

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || !list.value) return

  setTimeout(async () => {
    if (!list.value) return
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
  }, 100)
})
</script>

<template>
  <section id="work" class="border-t border-line">
    <div class="mx-auto max-w-content px-6 py-24 md:py-32">
      <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">{{ t('work.heading') }}</h2>
      <p class="mt-3 max-w-[60ch] text-muted">
        {{ t('work.subheading') }}
      </p>

      <div ref="list" class="mt-16 divide-y divide-line">
        <NuxtLink
          v-for="project in projects"
          :key="project.slug"
          :to="localePath(`/work/${project.slug}`)"
          class="reveal-item group grid gap-6 py-10 first:pt-0 lg:grid-cols-12 lg:gap-8"
        >
          <div class="lg:col-span-5">
            <p class="font-mono text-xs text-accent">{{ project.tag }}</p>
            <h3 class="mt-2 flex items-center gap-2 text-xl font-medium text-ink md:text-2xl">
              <span class="underline decoration-line underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">{{ project.name }}</span>
              <RiArrowRightUpLine
                size="18px"
                class="mt-1 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </h3>
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
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
