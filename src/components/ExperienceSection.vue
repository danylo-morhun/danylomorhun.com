<script setup lang="ts">
import { ref } from 'vue';
import { experiences } from '../data/experience';
import { useTextUnderline } from '../composables/useTextUnderline';
import UnderlineSvg from './UnderlineSvg.vue';

const expandedItems = ref<Set<string>>(new Set(['1']));

const toggleExpanded = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

const isExpanded = (id: string) => {
  return expandedItems.value.has(id);
};

const underlinePhrases = [
  'Architected',
  'millions of records',
  'mentoring',
  'boost in completion rates',
  'AI tooling and n8n automation'
];

const { processTextWithUnderlines } = useTextUnderline(underlinePhrases);
</script>

<template>
  <section id="experience" class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-4xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4">
          Where all I've 
          <span class="relative inline-block px-1">
            worked
            <UnderlineSvg height="12" viewBox="0 0 180 12" path="M 2,8 Q 15,3 30,6 Q 45,2 60,7 Q 75,4 90,5 Q 105,3 120,7 Q 135,2 150,6 Q 165,4 178,8" stroke-width="3.5" />
          </span>
          till today
        </h2>
      </div>

          <div class="space-y-0">
        <div
          v-for="exp in experiences"
          :key="exp.id"
          class="border-b border-gray-200 last:border-b-0"
        >
          <button
            @click="toggleExpanded(exp.id)"
            class="w-full text-left py-6 md:py-8 transition-all duration-300 hover:bg-gray-50/50 -mx-4 px-4 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <h3 class="text-xl md:text-2xl font-bold text-text">
                    {{ exp.position }}
                  </h3>
                  <span class="text-sm text-gray-500 font-medium">
                    {{ exp.duration }}
                  </span>
                </div>
                <p class="text-lg text-primary font-semibold mb-1">
                  {{ exp.company }}
                </p>
                <p v-if="exp.location" class="text-sm text-gray-500">
                  {{ exp.location }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <i
                  :class="[
                    'ri-arrow-down-s-line text-2xl text-gray-400 transition-transform duration-300',
                    isExpanded(exp.id) ? 'transform rotate-180' : ''
                  ]"
                ></i>
              </div>
            </div>
          </button>

          <Transition name="expand">
            <div
              v-if="isExpanded(exp.id)"
              class="pb-6 md:pb-8 px-4"
            >
              <ul class="space-y-3 text-text">
                <li
                  v-for="(desc, descIndex) in exp.description"
                  :key="descIndex"
                  class="flex items-start gap-3"
                >
                  <span class="text-primary flex-shrink-0 mt-1">•</span>
                  <span class="leading-relaxed">
                    <template v-for="(part, partIndex) in processTextWithUnderlines(desc)" :key="partIndex">
                      <span v-if="part.shouldUnderline" class="relative inline-block">
                        {{ part.text }}
                        <UnderlineSvg />
                      </span>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </span>
                </li>
              </ul>
              <div v-if="exp.technologies && exp.technologies.length > 0" class="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
                <span
                  v-for="tech in exp.technologies"
                  :key="tech"
                  class="text-xs px-3 py-1 bg-gray-100 text-text rounded-full font-medium"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.expand-enter-active {
  transition: all 0.3s ease-out;
}

.expand-leave-active {
  transition: all 0.3s ease-in;
}

.expand-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.expand-enter-to {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
