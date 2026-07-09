<script setup lang="ts">
import { useSite } from '~/composables/useSite'

const site = useSite()

useSeoMeta({
  title: () => `${site.value.name} — ${site.value.title}`,
  description: () => site.value.oneLiner,
})
</script>

<template>
  <div>
    <HeroSection />
    <WorkSection />
    <PersonalProjectsSection />
    <ExperienceSection />
    <AboutSection />
    <ContactSection />
  </div>
</template>
