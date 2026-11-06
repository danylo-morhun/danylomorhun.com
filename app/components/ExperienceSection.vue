<script setup lang="ts">
import { ref } from 'vue'
import { useExperience } from '~/composables/useExperience'

const { t } = useI18n()
const experience = useExperience()
const list = ref<HTMLElement | null>(null)

useReveal(list, { y: 20, duration: 0.6, start: 'top 88%' })
</script>

<template>
  <section
    id="experience"
    class="border-t border-line"
  >
    <div class="mx-auto max-w-content px-6 py-24 md:py-32">
      <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">
        {{ t('experience.heading') }}
      </h2>

      <div
        ref="list"
        class="mt-16 space-y-12"
      >
        <div
          v-for="entry in experience"
          :key="entry.company"
          class="reveal-item grid gap-3 sm:grid-cols-[140px_1fr] sm:gap-10"
        >
          <p class="font-mono text-xs text-muted">
            {{ entry.dates }}
          </p>

          <div class="relative pl-8">
            <span
              class="absolute left-0 top-0 h-full w-px -translate-x-1/2 bg-line"
              aria-hidden="true"
            />
            <span
              class="absolute left-0 top-1 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent"
              aria-hidden="true"
            />
            <h3 class="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-medium text-ink md:text-xl">
              <span>{{ entry.role }}</span>
              <!-- On phones the company gets its own line, so the dot would start it. -->
              <span class="inline-flex items-center gap-x-2 max-sm:basis-full">
                <span class="text-muted"><span class="max-sm:hidden">· </span>{{ entry.company }}</span>
                <span class="group relative inline-flex self-center">
                  <img
                    :src="`/flags/${entry.countryCode}.svg`"
                    :alt="entry.country"
                    width="24"
                    height="24"
                    tabindex="0"
                    class="h-[1em] w-[1em] shrink-0 rounded-full"
                  >
                  <span
                    class="pointer-events-none absolute -top-8 right-0 z-10 whitespace-nowrap sm:left-1/2 sm:right-auto sm:-translate-x-1/2 rounded-md border border-line bg-surface px-2 py-1 font-sans text-xs font-normal text-ink opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                    aria-hidden="true"
                  >{{ entry.country }}</span>
                </span>
              </span>
            </h3>
            <p class="mt-2 max-w-[60ch] leading-relaxed text-muted">
              {{ entry.summary }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
