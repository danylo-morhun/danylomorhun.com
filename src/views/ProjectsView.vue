<script setup lang="ts">
import { ref, computed } from 'vue';
import SectionTitle from '../components/SectionTitle.vue';
import ProjectCard from '../components/ProjectCard.vue';
import { projects } from '../data/projects';

const selectedCategory = ref<string>('all');
const categories = ['all', 'fullstack', 'backend', 'frontend', 'data-engineering'] as const;

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return projects;
  }
  return projects.filter(
    p => p.category === selectedCategory.value
  );
});
</script>

<template>
  <div class="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-7xl">
      <SectionTitle
        title="My Projects"
        subtitle="A collection of projects showcasing full-stack development and data engineering expertise"
      />

      <div class="flex flex-wrap justify-center gap-3 mb-16">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300',
            selectedCategory === category
              ? 'bg-surface text-white shadow-medium hover:shadow-large'
              : 'bg-white text-text hover:bg-surface hover:text-white shadow-soft hover:shadow-medium'
          ]"
        >
          {{ category === 'all' ? 'All Projects' : category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </div>

      <div
        v-if="filteredProjects.length === 0"
        class="text-center py-20"
      >
        <i class="ri-folder-open-line text-6xl text-text/30 mb-4"></i>
        <p class="text-text text-lg font-medium">No projects found in this category.</p>
      </div>
    </div>
  </div>
</template>

