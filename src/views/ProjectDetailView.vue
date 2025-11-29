<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { projects } from '../data/projects';

const route = useRoute();
const router = useRouter();

const project = computed(() => {
  return projects.find(p => p.id === route.params.id as string);
});

if (!project.value) {
  router.push('/projects');
}
</script>

<template>
  <div v-if="project" class="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-5xl">
      <button
        @click="router.back()"
        class="flex items-center gap-2 text-text hover:text-primary transition-colors mb-10 px-5 py-2.5 rounded-full hover:bg-white/50"
      >
        <i class="ri-arrow-left-line"></i>
        <span class="font-medium">Back to Projects</span>
      </button>

      <div class="bg-white rounded-2xl shadow-medium p-10 md:p-12 mb-8">
        <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
          <span
            class="text-sm font-semibold px-4 py-2 rounded-full bg-primary/10 text-primary uppercase tracking-wide"
          >
            {{ project.category.replace('-', ' ') }}
          </span>
          <span
            v-if="project.featured"
            class="text-sm font-semibold px-4 py-2 rounded-full bg-primary/20 text-primary flex items-center gap-2"
          >
            <i class="ri-star-fill"></i>
            Featured
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-text mb-6 leading-tight">
          {{ project.title }}
        </h1>
        <p class="text-xl md:text-2xl text-text mb-8 leading-relaxed">
          {{ project.description }}
        </p>
        <div class="flex items-center gap-4 flex-wrap">
          <a
            v-if="project.githubUrl"
            :href="project.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            <i class="ri-github-fill mr-2"></i>
            View on GitHub
          </a>
          <a
            v-if="project.liveUrl"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary"
          >
            <i class="ri-external-link-line mr-2"></i>
            Live Demo
          </a>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-medium p-10 md:p-12 mb-8">
        <h2 class="text-3xl font-bold text-text mb-6">About This Project</h2>
        <p class="text-text text-lg leading-relaxed">
          {{ project.longDescription }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-medium p-10 md:p-12">
        <h2 class="text-3xl font-bold text-text mb-6">Technologies Used</h2>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="tech in project.technologies"
            :key="tech"
            class="px-5 py-2.5 bg-background text-text rounded-full font-medium border border-white/50"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

