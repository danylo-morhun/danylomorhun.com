<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue';
import SelectedWorkSection from '../components/SelectedWorkSection.vue';
import ExperienceSection from '../components/ExperienceSection.vue';
import PlaygroundSection from '../components/PlaygroundSection.vue';
import SideNavigation from '../components/SideNavigation.vue';
import { useScrollAnimation } from '../composables/useScrollAnimation';

useScrollAnimation();
</script>

<template>
  <div>
    <SideNavigation />
    <HeroSection />
    <SelectedWorkSection />
    <ExperienceSection />
    <PlaygroundSection />
  </div>
</template>

