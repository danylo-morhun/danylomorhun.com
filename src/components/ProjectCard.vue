<script setup lang="ts">
import type { Project } from '../data/types';

interface Props {
  project: Project;
}

defineProps<Props>();
</script>

<template>
  <router-link
    :to="`/projects/${project.id}`"
    class="card group cursor-pointer h-full flex flex-col block"
  >
    <div class="flex-1">
      <div class="flex items-center justify-between mb-5">
        <span
          class="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide"
        >
          {{ project.category.replace('-', ' ') }}
        </span>
        <span
          v-if="project.featured"
          class="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/20 text-primary"
        >
          <i class="ri-star-fill mr-1"></i>
          Featured
        </span>
      </div>

      <h3 class="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
        {{ project.title }}
      </h3>

      <p class="text-text text-base leading-relaxed mb-6">
        {{ project.description }}
      </p>

      <div class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="tech in project.technologies.slice(0, 5)"
          :key="tech"
          class="text-xs px-3 py-1.5 bg-background text-text rounded-full font-medium border border-white/50"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > 5"
          class="text-xs px-3 py-1.5 bg-background text-text rounded-full font-medium border border-white/50"
        >
          +{{ project.technologies.length - 5 }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between pt-6 border-t border-white/20">
      <div class="flex items-center gap-4">
      <a
        v-if="project.githubUrl"
          @click.stop
        :href="project.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-background text-text hover:text-primary hover:bg-primary/10 transition-all duration-300"
        aria-label="View on GitHub"
      >
          <i class="ri-github-fill text-lg"></i>
      </a>
      <a
        v-if="project.liveUrl"
          @click.stop
        :href="project.liveUrl"
        target="_blank"
        rel="noopener noreferrer"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-background text-text hover:text-primary hover:bg-primary/10 transition-all duration-300"
        aria-label="View live site"
      >
          <i class="ri-external-link-line text-lg"></i>
      </a>
      </div>
      <span class="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
        View Details
        <i class="ri-arrow-right-line"></i>
      </span>
    </div>
  </router-link>
</template>

