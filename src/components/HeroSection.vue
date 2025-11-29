<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { skills } from '../data/skills';

const router = useRouter();

const handleLetsMeet = () => {
  window.open('https://calendly.com', '_blank');
};

const handleCaseStudies = () => {
  router.push('/projects');
};

const techStack = computed(() => {
  const keySkills = skills.filter(skill => 
    ['Vue.js', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'Python', 'Django', 'GraphQL', 'REST APIs', 'Docker', 'Git'].includes(skill.name)
  );
  return keySkills.map(skill => ({
    name: skill.name,
    icon: skill.icon || 'ri-code-s-slash-line'
  }));
});

const duplicatedStack = computed(() => [...techStack.value, ...techStack.value]);

const hoveredTech = ref<string | null>(null);
const tooltipPosition = ref({ x: 0, y: 0 });

const handleMouseEnter = (techName: string, event: MouseEvent) => {
  hoveredTech.value = techName;
  updateTooltipPosition(event);
};

const handleMouseLeave = () => {
  hoveredTech.value = null;
};

const handleMouseMove = (event: MouseEvent) => {
  if (hoveredTech.value) {
    updateTooltipPosition(event);
  }
};

const updateTooltipPosition = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  tooltipPosition.value = {
    x: rect.left + rect.width / 2,
    y: rect.top - 8,
  };
};
</script>

<template>
  <section id="hero" class="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="container mx-auto max-w-6xl text-left relative z-10">
      <div class="mb-6 animate-fade-in-up" style="animation-delay: 0.1s">
        <p class="text-lg md:text-xl lg:text-2xl text-text font-medium">
          <span class="relative inline-block px-1">
            Frontend Engineer
            <svg
              class="absolute -bottom-1 left-0 w-full"
              height="10"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              style="overflow: visible;"
            >
              <path
                d="M 2,7 Q 20,2 40,5 Q 60,3 80,6 Q 100,2 120,5 Q 140,3 160,6 Q 180,2 198,7"
                stroke="#f08c00"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
                style="filter: drop-shadow(0 1px 1px rgba(240, 140, 0, 0.3));"
              />
            </svg>
          </span>
        </p>
      </div>
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight animate-fade-in-up max-w-4xl" style="animation-delay: 0.2s">
        I empower stakeholders to scale revenue and maximize operational efficiency.
      </h1>

      <p class="text-sm md:text-base lg:text-lg text-text max-w-3xl mb-10 leading-relaxed animate-fade-in-up" style="animation-delay: 0.3s">
        I engineer resilient web applications that transform massive datasets into clear, actionable insights bridging the gap between data-heavy backend logic and frictionless UI.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 items-start animate-fade-in-up" style="animation-delay: 0.4s">
        <button
          @click="handleLetsMeet"
          class="px-6 py-2.5 md:px-8 md:py-3 bg-primary text-white rounded-full font-semibold text-sm md:text-base hover:bg-primary/90 hover:shadow-large hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 group"
        >
          Let's meet
          <i class="ri-arrow-right-line text-base group-hover:translate-x-1 transition-transform"></i>
        </button>

        <button
          @click="handleCaseStudies"
          class="px-6 py-2.5 md:px-8 md:py-3 bg-primary/10 text-primary border-2 border-primary/20 rounded-full font-semibold text-sm md:text-base hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 group"
        >
          Case studies
          <i class="ri-arrow-right-line text-base group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>

      <div class="mt-16 relative overflow-visible">
        <div class="relative">
          <div class="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style="background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));"></div>
          <div class="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style="background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));"></div>
          
          <div class="marquee-container relative py-6 overflow-x-hidden">
            <div class="marquee-content">
              <div
                v-for="(tech, index) in duplicatedStack"
                :key="`${tech.name}-${index}`"
                class="marquee-item"
              >
                <div
                  class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 text-primary border-2 border-primary/20 flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium hover:scale-105 active:scale-100 transition-all duration-300 group relative cursor-pointer"
                  @mouseenter="handleMouseEnter(tech.name, $event)"
                  @mouseleave="handleMouseLeave"
                  @mousemove="handleMouseMove"
                >
                  <i :class="[tech.icon, 'text-lg md:text-xl group-hover:text-primary transition-colors']"></i>
                </div>
              </div>
            </div>
            <div class="marquee-content" aria-hidden="true">
              <div
                v-for="(tech, index) in duplicatedStack"
                :key="`duplicate-${tech.name}-${index}`"
                class="marquee-item"
              >
                <div
                  class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 text-primary border-2 border-primary/20 flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium hover:scale-105 active:scale-100 transition-all duration-300 group relative cursor-pointer"
                >
                  <i :class="[tech.icon, 'text-lg md:text-xl group-hover:text-primary transition-colors']"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="hoveredTech"
          class="tooltip fixed z-50 pointer-events-none"
          :style="{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
          }"
        >
          <div class="bg-heading text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-large whitespace-nowrap">
            {{ hoveredTech }}
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-heading"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}

.marquee-container {
  display: flex;
  width: 100%;
  overflow-x: hidden;
  overflow-y: visible;
  position: relative;
}

.marquee-content {
  display: flex;
  gap: 1.5rem;
  animation: marquee 30s linear infinite;
  flex-shrink: 0;
  align-items: center;
}

.marquee-content:hover {
  animation-play-state: paused;
}

.marquee-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (min-width: 768px) {
  .marquee-content {
    gap: 2rem;
  }
}

.tooltip {
  margin-bottom: 8px;
}
</style>

