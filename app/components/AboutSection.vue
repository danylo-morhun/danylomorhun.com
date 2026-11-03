<script setup lang="ts">
import { ref } from 'vue'
import { useSite } from '~/composables/useSite'

const { t } = useI18n()
const site = useSite()
const section = ref<HTMLElement | null>(null)

useReveal(section, { y: 20, duration: 0.6, start: 'top 80%', stagger: 0.1 })
</script>

<template>
  <section
    id="about"
    ref="section"
    class="border-t border-line"
  >
    <div class="mx-auto grid max-w-content gap-10 px-6 py-24 md:py-32 lg:grid-cols-12 lg:gap-16">
      <div class="reveal-item lg:col-span-4">
        <h2 class="text-3xl font-medium tracking-tightest text-ink md:text-4xl">
          {{ t('about.heading') }}
        </h2>
      </div>

      <div class="reveal-item space-y-5 lg:col-span-8">
        <p
          v-for="paragraph in site.bio"
          :key="paragraph"
          class="max-w-[65ch] text-lg leading-relaxed text-muted"
        >
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>
