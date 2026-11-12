<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCaseStudies } from '~/composables/useCaseStudies'

const { t } = useI18n()
const localePath = useLocalePath()
const projects = useCaseStudies()
// A recruiter skims: the strongest four get the full row, the rest a one-line index.
const FEATURED_COUNT = 4
const featured = computed(() => projects.value.slice(0, FEATURED_COUNT))
const more = computed(() => projects.value.slice(FEATURED_COUNT))
const list = ref<HTMLElement | null>(null)

useReveal(list)
</script>

<template>
  <section
    id="work"
    class="border-t border-line"
  >
    <div class="mx-auto max-w-content px-6 py-24 md:py-32">
      <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">
        {{ t('work.heading') }}
      </h2>
      <p class="mt-3 max-w-[60ch] text-muted">
        {{ t('work.subheading') }}
      </p>

      <div
        ref="list"
        class="mt-16 divide-y divide-line"
      >
        <NuxtLink
          v-for="project in featured"
          :key="project.slug"
          :to="localePath(`/work/${project.slug}`)"
          class="reveal-item group grid gap-6 py-10 first:pt-0 lg:grid-cols-12 lg:gap-8"
        >
          <div class="lg:col-span-5">
            <p class="font-mono text-xs text-accent">{{ project.tag }}</p>
            <h3 class="mt-2 flex items-center gap-2 text-xl font-medium text-ink md:text-2xl">
              <span class="underline decoration-line underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">{{ project.name }}</span>
              <AppIcon
                name="arrow-right-up-line"
                :size="18"
                class="mt-1 text-muted transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 group-hover:text-accent"
              />
            </h3>
            <p
              v-if="project.meta"
              class="mt-2 text-sm text-muted"
            >
              {{ project.meta }}
            </p>
          </div>

          <p class="text-base leading-relaxed text-muted lg:col-span-4">
            {{ project.description }}
          </p>

          <div class="flex flex-row gap-8 lg:col-span-3 lg:flex-col lg:gap-4">
            <div
              v-for="metric in project.outcome"
              :key="metric.label"
            >
              <p class="text-2xl font-semibold text-ink">{{ metric.value }}</p>
              <p class="mt-1 max-w-[24ch] text-xs text-muted">{{ metric.label }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div
        v-if="more.length"
        class="mt-6 border-t border-line pt-10"
      >
        <h3 class="text-lg font-medium text-ink">
          {{ t('work.moreHeading') }}
        </h3>
        <ul class="mt-4 divide-y divide-line">
          <li
            v-for="project in more"
            :key="project.slug"
          >
            <NuxtLink
              :to="localePath(`/work/${project.slug}`)"
              class="group grid gap-x-8 gap-y-1 py-4 sm:grid-cols-12 sm:items-baseline"
            >
              <span class="flex items-center gap-1.5 font-medium text-ink sm:col-span-4">
                <span class="underline decoration-line underline-offset-4 transition-colors duration-200 group-hover:decoration-ink">{{ project.name }}</span>
                <AppIcon
                  name="arrow-right-up-line"
                  :size="16"
                  class="text-muted transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </span>
              <span class="font-mono text-xs text-muted sm:col-span-4">{{ project.tag }}</span>
              <span class="text-sm text-muted sm:col-span-4 sm:text-right">{{ project.meta }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
