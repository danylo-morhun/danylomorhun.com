<script setup lang="ts">
import type { Skill } from '../data/types';

interface Props {
  skill: Skill;
}

defineProps<Props>();

const proficiencyColors = {
  expert: 'bg-primary/15 text-primary border-primary/30',
  advanced: 'bg-blue-100/60 text-blue-700 border-blue-200/50',
  intermediate: 'bg-purple-100/60 text-purple-700 border-purple-200/50',
};
</script>

<template>
  <div
    class="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all hover:scale-105 hover:shadow-soft"
    :class="proficiencyColors[skill.proficiency]"
  >
    <i v-if="skill.icon" :class="[skill.icon, 'text-lg']"></i>
    <span class="font-semibold text-sm">{{ skill.name }}</span>
  </div>
</template>

