<script setup lang="ts">
import { site } from '~/data/site'

useSeoMeta({
  title: `${site.name} — ${site.title}`,
  description: site.oneLiner,
})
</script>

<template>
  <div>
    <HeroSection />
    <WorkSection />
    <ExperienceSection />
    <AboutSection />
    <ContactSection />
  </div>
</template>
