<script setup lang="ts">
import { useSite } from '~/composables/useSite'

const { t } = useI18n()
const site = useSite()

const title = computed(() => `${site.value.name} — ${site.value.title}`)

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description: () => site.value.oneLiner,
  ogDescription: () => site.value.oneLiner,
  twitterDescription: () => site.value.oneLiner,
})

// The hero is vertically centered, so painting it before its last line is parsed
// shifts the headline up when the rest arrives. Hold first paint until it's all there.
useHead({
  link: [{ rel: 'expect', href: '#hero-end', blocking: 'render' }],
})

defineOgImage('Default', {
  title: () => site.value.name,
  subtitle: () => site.value.title,
  tagline: () => t('og.tagline'),
})
</script>

<template>
  <div>
    <AppLoader />
    <HeroSection />
    <WorkSection />
    <PersonalProjectsSection />
    <ExperienceSection />
    <AboutSection />
    <ContactSection />
  </div>
</template>
