<script setup lang="ts">
import { useTextUnderline } from '../composables/useTextUnderline';
import UnderlineSvg from './UnderlineSvg.vue';

const underlinePhrases = [
  'Middle Frontend Engineer',
  'millions of events',
  'production-ready solutions'
];

const { processTextWithUnderlines } = useTextUnderline(underlinePhrases);

const introText = `Hey there again! My name is Danylo, I am a Middle Frontend Engineer crafting Resilient Systems that process millions of events daily. I bridge the gap between massive backend datasets and frictionless UI, building scalable web applications and data pipelines that transform complex technical challenges into elegant, production-ready solutions.`;
</script>

<template>
  <section id="about" class="py-24 px-4 sm:px-6 lg:px-8 bg-white">
    <div class="container mx-auto max-w-6xl">
      <!-- Title -->
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
          <span class="relative inline-block px-1">
            Peekabo
            <UnderlineSvg height="12" viewBox="0 0 180 12" path="M 2,8 Q 15,3 30,6 Q 45,2 60,7 Q 75,4 90,5 Q 105,3 120,7 Q 135,2 150,6 Q 165,4 178,8" stroke-width="3.5" />
          </span>
          at my life
        </h2>
      </div>

      <!-- Intro Text -->
      <div class="max-w-4xl mx-auto mb-16">
        <p class="text-lg md:text-xl lg:text-2xl text-text leading-relaxed">
          <template v-for="(part, partIndex) in processTextWithUnderlines(introText)" :key="partIndex">
            <span v-if="part.shouldUnderline" class="relative inline-block">
              {{ part.text }}
              <UnderlineSvg />
            </span>
            <span v-else>{{ part.text }}</span>
          </template>
        </p>
      </div>
    </div>
  </section>
</template>

