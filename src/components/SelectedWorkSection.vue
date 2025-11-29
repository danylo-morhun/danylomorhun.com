<script setup lang="ts">
import { computed } from 'vue';
import { projects } from '../data/projects';
import SelectedWorkCard from './SelectedWorkCard.vue';

const selectedProjects = computed(() => {
  return projects.filter(p => p.featured).slice(0, 3);
});
</script>

<template>
  <section id="case-studies" class="pb-24 md:pb-32 px-4 sm:px-6 lg:px-8 relative">
    <div class="container mx-auto max-w-7xl">
      <div class="text-center mb-16 md:mb-20 animate-on-scroll">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
          Selected 
          <span class="relative inline-block px-1">
            Case Studies
            <svg
              class="absolute -bottom-1 left-0 w-full"
              height="12"
              viewBox="0 0 180 12"
              preserveAspectRatio="none"
              style="overflow: visible;"
            >
              <path
                d="M 2,8 Q 15,3 30,6 Q 45,2 60,7 Q 75,4 90,5 Q 105,3 120,7 Q 135,2 150,6 Q 165,4 178,8"
                stroke="var(--color-primary)"
                stroke-width="3.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
                style="filter: drop-shadow(0 1px 1px var(--color-primary-shadow));"
              />
            </svg>
          </span>
        </h2>
        <p class="text-text text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          A showcase of projects that demonstrate full-stack expertise and impactful results
        </p>
      </div>
      
      <div class="space-y-24 md:space-y-32 lg:space-y-40">
        <SelectedWorkCard
          v-for="(project, index) in selectedProjects"
          :key="project.id"
          :project="project"
          :class="'animate-on-scroll'"
          :style="`animation-delay: ${index * 0.15}s`"
        />
      </div>
    </div>
  </section>
</template>
