<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="['text-center mb-16', props.class]">
    <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="text-text text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
      {{ subtitle }}
    </p>
  </div>
</template>

