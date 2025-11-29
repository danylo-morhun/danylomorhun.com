<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Project } from '../data/types';

interface Props {
  project: Project;
}

const props = defineProps<Props>();

const displayMetrics = computed(() => {
  if (!props.project.metrics || props.project.metrics.length === 0) return [];
  return props.project.metrics.slice(0, 2);
});

const getMetricIcon = (type: 'positive' | 'neutral' | 'negative') => {
  switch (type) {
    case 'positive':
      return 'ri-arrow-up-line';
    case 'negative':
      return 'ri-arrow-down-line';
    default:
      return 'ri-arrow-right-line';
  }
};

const titleParts = computed(() => {
  const title = props.project.title;
  const firstSpace = title.indexOf(' ');
  if (firstSpace === -1) {
    return { first: title, rest: '' };
  }
  return {
    first: title.substring(0, firstSpace),
    rest: title.substring(firstSpace + 1)
  };
});

const isModalOpen = ref(false);
const imageContainer = ref<HTMLElement | null>(null);
const currentImageIndex = ref(0);

const allImages = computed(() => {
  if (props.project.imageUrls && props.project.imageUrls.length > 0) {
    return props.project.imageUrls;
  }
  if (props.project.imageUrl) {
    return [props.project.imageUrl];
  }
  return [];
});

const hasMultipleImages = computed(() => allImages.value.length > 1);

const openModal = () => {
  if (allImages.value.length > 0) {
    currentImageIndex.value = 0;
    isModalOpen.value = true;
    document.body.style.overflow = 'hidden';
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = '';
};

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
};

const goToNext = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % allImages.value.length;
  }
};

const goToPrevious = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value = (currentImageIndex.value - 1 + allImages.value.length) % allImages.value.length;
  }
};

const goToImage = (index: number) => {
  currentImageIndex.value = index;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isModalOpen.value) return;
  
  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'ArrowLeft') {
    goToPrevious();
  } else if (e.key === 'ArrowRight') {
    goToNext();
  }
};

const handleImageContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  return false;
};

const handleImageDragStart = (e: DragEvent) => {
  e.preventDefault();
  return false;
};
</script>

<template>
  <div class="w-full group">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <div class="space-y-6 lg:space-y-8 order-2 lg:order-1">
        <div v-if="project.client" class="space-y-3">
          <p class="text-xs md:text-sm text-text/60 font-medium uppercase tracking-wider">
              Client
            </p>
            
            <div class="flex items-center gap-4">
              <div 
              v-if="project.clientLogo"
              class="relative flex-shrink-0"
            >
              <div class="h-10 md:h-12 px-3 md:px-5 rounded-lg bg-white/90 border border-gray-200/50 shadow-sm hover:border-gray-300/70 hover:shadow-md transition-all duration-300 flex items-center justify-center">
                <img
                  :src="project.clientLogo"
                  :alt="`${project.client} logo`"
                  class="h-7 md:h-9 w-auto max-w-[120px] md:max-w-[160px] object-contain object-center"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div class="flex items-center gap-2.5 flex-1 min-w-0">
              <div class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
              <p class="text-lg md:text-xl text-text font-semibold truncate">
                {{ project.client }}
              </p>
            </div>
          </div>
        </div>

        <h3 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text leading-tight">
          <span class="relative inline-block">
            {{ titleParts.first }}
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
          <span v-if="titleParts.rest"> {{ titleParts.rest }}</span>
        </h3>

        <div v-if="project.challenge || project.solution" class="space-y-5 pt-2">
          <div v-if="project.challenge" class="space-y-2.5">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
              <h4 class="text-sm font-semibold text-text uppercase tracking-wide">Challenge</h4>
            </div>
            <p class="text-sm md:text-base text-text leading-relaxed pl-4">
              {{ project.challenge }}
            </p>
          </div>

          <div v-if="project.solution" class="space-y-2.5">
            <div class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
              <h4 class="text-sm font-semibold text-text uppercase tracking-wide">Solution</h4>
            </div>
            <p class="text-sm md:text-base text-text leading-relaxed pl-4">
              {{ project.solution }}
            </p>
          </div>
        </div>

        <div v-if="displayMetrics.length > 0" class="flex flex-wrap gap-3 pt-2">
          <div
            v-for="(metric, index) in displayMetrics"
            :key="index"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm md:text-base transition-all duration-300 group/metric',
              metric.type === 'positive' 
                ? 'bg-primary/10 text-text border-2 border-primary/20 hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium' 
                : metric.type === 'negative'
                ? 'bg-red-50 text-red-900 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 hover:shadow-medium'
                : 'bg-gray-100 text-text border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 hover:shadow-medium'
            ]"
          >
            <i 
              :class="[
                getMetricIcon(metric.type),
                'text-base transition-transform group-hover/metric:scale-110',
                metric.type === 'positive' ? 'text-primary' : metric.type === 'negative' ? 'text-red-600' : 'text-gray-600'
              ]"
            ></i>
            <span>{{ metric.label }}</span>
          </div>
        </div>
      </div>

      <div class="relative order-1 lg:order-2">
        <div class="relative group/image">
          <div class="absolute -inset-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 blur-xl"></div>
          
          <div 
            ref="imageContainer"
            class="relative bg-white rounded-2xl overflow-hidden shadow-large border border-gray-100 group-hover:shadow-2xl group-hover:border-primary/20 transition-all duration-500 cursor-pointer"
            @click="openModal"
          >
            <div class="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <div class="absolute inset-0">
                <img
                  v-if="allImages.length > 0"
                  :src="allImages[0]"
                  :alt="project.title"
                  class="w-full h-full object-cover object-left-top scale-100 transition-transform duration-500 ease-out"
                  @contextmenu="handleImageContextMenu"
                  @dragstart="handleImageDragStart"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100"
                >
                  <div class="text-center">
                    <i class="ri-image-line text-5xl mb-3 opacity-50"></i>
                    <p class="text-sm text-gray-500">Project Preview</p>
                  </div>
                </div>
              </div>
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none"></div>
              
              <div class="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <div class="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <i class="ri-zoom-in-line text-base"></i>
                  <span>Click to enlarge</span>
                </div>
              </div>
              
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div class="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
          
          <div class="absolute -z-10 inset-0 bg-gray-200/50 rounded-2xl blur-2xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 transform translate-y-2"></div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click="handleBackdropClick"
          @keydown="handleKeyDown"
        >
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          <div class="relative z-10 max-w-7xl w-full max-h-[90vh] flex flex-col">
            <button
              @click="closeModal"
              class="absolute -top-12 right-0 text-white hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
            >
              <span class="text-sm font-medium">Close</span>
              <div class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                <i class="ri-close-line text-xl"></i>
              </div>
            </button>
            
            <div class="bg-white rounded-2xl overflow-hidden shadow-2xl relative">
              <button
                v-if="hasMultipleImages"
                @click.stop="goToPrevious"
                class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl text-text hover:text-primary transition-all duration-200 flex items-center justify-center hover:scale-110 group"
                aria-label="Previous image"
              >
                <i class="ri-arrow-left-line text-2xl group-hover:translate-x-[-2px] transition-transform"></i>
              </button>
              
              <button
                v-if="hasMultipleImages"
                @click.stop="goToNext"
                class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl text-text hover:text-primary transition-all duration-200 flex items-center justify-center hover:scale-110 group"
                aria-label="Next image"
              >
                <i class="ri-arrow-right-line text-2xl group-hover:translate-x-[2px] transition-transform"></i>
              </button>
              
              <div class="relative overflow-hidden">
                <Transition name="carousel-fade" mode="out-in">
                  <div
                    :key="currentImageIndex"
                    class="relative"
                  >
                    <img
                      :src="allImages[currentImageIndex]"
                      :alt="`${project.title} - Image ${currentImageIndex + 1}`"
                      class="w-full h-auto max-h-[90vh] object-contain"
                      @contextmenu="handleImageContextMenu"
                      @dragstart="handleImageDragStart"
                    />
                  </div>
                </Transition>
              </div>
              
              <div
                v-if="hasMultipleImages"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
              >
                <button
                  v-for="(_, index) in allImages"
                  :key="index"
                  @click.stop="goToImage(index)"
                  :class="[
                    'w-2 h-2 rounded-full transition-all duration-200',
                    index === currentImageIndex
                      ? 'bg-primary w-8 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  ]"
                  :aria-label="`Go to image ${index + 1}`"
                />
              </div>
              
              <div
                v-if="hasMultipleImages"
                class="absolute top-4 right-4 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full"
              >
                {{ currentImageIndex + 1 }} / {{ allImages.length }}
              </div>
              
              <div class="px-6 py-4 bg-white border-t border-gray-100">
                <h4 class="text-lg font-semibold text-text mb-1">{{ project.title }}</h4>
                <p v-if="project.client" class="text-sm text-text/60">{{ project.client }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
img {
  image-rendering: auto;
  -webkit-image-rendering: auto;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

img[alt*="logo"] {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

img[src] {
  opacity: 1;
  transition: opacity 0.4s ease-in-out;
}

.group:hover img,
.group img {
  transform-origin: top left;
  object-position: left top;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-active .absolute,
.modal-leave-active .absolute {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.modal-enter-to .relative,
.modal-leave-from .relative {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.carousel-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.carousel-fade-enter-to,
.carousel-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
