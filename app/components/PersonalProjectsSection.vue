<script setup lang="ts">
import { ref } from 'vue'
import { usePersonalProjects } from '~/composables/usePersonalProjects'

const { t } = useI18n()
const localePath = useLocalePath()
const personalProjects = usePersonalProjects()
const list = ref<HTMLElement | null>(null)

useReveal(list)
</script>

<template>
  <section
    id="lab"
    class="border-t border-line"
  >
    <div class="mx-auto max-w-content px-6 py-24 md:py-32">
      <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">
        {{ t('lab.heading') }}
      </h2>
      <p class="mt-3 max-w-[60ch] text-muted">
        {{ t('lab.subheading') }}
      </p>

      <div
        ref="list"
        class="mt-16 grid gap-8 md:grid-cols-3"
      >
        <NuxtLink
          v-for="project in personalProjects"
          :key="project.slug"
          :to="localePath(`/lab/${project.slug}`)"
          class="reveal-item group flex flex-col"
        >
          <div class="relative overflow-hidden rounded-xl border border-line shadow-lg">
            <img
              :src="project.gallery[0]?.src"
              :srcset="project.gallery[0] ? imageSrcset(project.gallery[0].src) : undefined"
              sizes="(min-width: 1200px) 368px, (min-width: 768px) calc(33vw - 32px), calc(100vw - 48px)"
              :alt="project.gallery[0]?.alt ?? project.name"
              width="1440"
              height="900"
              loading="lazy"
              class="aspect-8/5 w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            >
          </div>

          <p class="mt-5 font-mono text-xs text-accent">{{ project.tag }}</p>
          <h3 class="mt-2 flex items-center gap-1.5 text-lg font-medium text-ink">
            <span class="underline decoration-line underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">{{ project.name }}</span>
            <AppIcon
              name="arrow-right-up-line"
              :size="16"
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
