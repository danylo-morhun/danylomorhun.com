<script setup lang="ts">
import { computed, ref } from 'vue';
import { projects } from '../data/projects';

const playgroundProjects = computed(() => {
  return projects.filter(p => !p.featured);
});

const isModalOpen = ref(false);
const currentProject = ref<typeof projects[0] | null>(null);
const currentImageIndex = ref(0);

const getAllImages = (project: typeof projects[0]) => {
  if (project.imageUrls && project.imageUrls.length > 0) {
    return project.imageUrls;
  }
  if (project.imageUrl) {
    return [project.imageUrl];
  }
  return [];
};

const hasMultipleImages = (project: typeof projects[0]) => {
  return getAllImages(project).length > 1;
};

const openModal = (project: typeof projects[0]) => {
  const images = getAllImages(project);
  if (images.length > 0) {
    currentProject.value = project;
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
  if (currentProject.value) {
    const images = getAllImages(currentProject.value);
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  }
};

const goToPrevious = () => {
  if (currentProject.value) {
    const images = getAllImages(currentProject.value);
    currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length;
  }
};

const goToImage = (index: number) => {
  currentImageIndex.value = index;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isModalOpen.value || !currentProject.value) return;
  
  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'ArrowLeft') {
    goToPrevious();
  } else if (e.key === 'ArrowRight') {
    goToNext();
  }
};

const currentImages = computed(() => {
  if (!currentProject.value) return [];
  return getAllImages(currentProject.value);
});
</script>

<template>
  <section id="playground" class="pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-7xl">
      <div class="text-center mb-16 md:mb-20 animate-on-scroll">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
          <span class="relative inline-block px-1">
            Playground
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
          Side projects and experiments exploring new technologies and ideas
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="project in playgroundProjects"
          :key="project.id"
          class="group bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100 hover:shadow-large hover:border-primary/20 transition-all duration-300 animate-on-scroll"
        >
          <div 
            v-if="getAllImages(project).length > 0"
            class="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
            @click="openModal(project)"
          >
            <img
              :src="getAllImages(project)[0]"
              :alt="project.title"
              class="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center pointer-events-none">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <i class="ri-zoom-in-line text-base"></i>
                <span>View project</span>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div class="p-6">
            <div class="mb-3">
              <span class="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                {{ project.category.replace('-', ' ') }}
              </span>
            </div>

            <h3 class="text-xl md:text-2xl font-bold text-text mb-2 leading-tight">
              {{ project.title }}
            </h3>

            <p class="text-text text-sm md:text-base leading-relaxed mb-4">
              {{ project.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-5">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="text-xs px-3 py-1.5 bg-gray-50 text-text border border-gray-200 rounded-full font-medium hover:bg-primary/5 hover:border-primary/20 transition-colors duration-200"
              >
                {{ tech }}
              </span>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-full bg-primary/10 text-primary border-2 border-primary/20 hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium transition-all duration-300 flex items-center justify-center group/link"
                aria-label="View on GitHub"
              >
                <i class="ri-github-fill text-lg group-hover/link:scale-110 transition-transform"></i>
              </a>
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-full bg-primary/10 text-primary border-2 border-primary/20 hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium transition-all duration-300 flex items-center justify-center group/link"
                aria-label="View live site"
              >
                <i class="ri-external-link-line text-lg group-hover/link:scale-110 transition-transform"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isModalOpen && currentProject"
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
                v-if="hasMultipleImages(currentProject)"
                @click.stop="goToPrevious"
                class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl text-text hover:text-primary transition-all duration-200 flex items-center justify-center hover:scale-110 group"
                aria-label="Previous image"
              >
                <i class="ri-arrow-left-line text-2xl group-hover:translate-x-[-2px] transition-transform"></i>
              </button>
              
              <button
                v-if="hasMultipleImages(currentProject)"
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
                      :src="currentImages[currentImageIndex]"
                      :alt="`${currentProject.title} - Image ${currentImageIndex + 1}`"
                      class="w-full h-auto max-h-[90vh] object-contain"
                    />
                  </div>
                </Transition>
              </div>
              
              <div
                v-if="hasMultipleImages(currentProject)"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
              >
                <button
                  v-for="(_, index) in currentImages"
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
                v-if="hasMultipleImages(currentProject)"
                class="absolute top-4 right-4 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full"
              >
                {{ currentImageIndex + 1 }} / {{ currentImages.length }}
              </div>
              
              <div class="px-6 py-4 bg-white border-t border-gray-100">
                <h4 class="text-lg font-semibold text-text mb-1">{{ currentProject.title }}</h4>
                <p class="text-sm text-text/60">{{ currentProject.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
img {
  image-rendering: auto;
  -webkit-image-rendering: auto;
  user-select: none;
  -webkit-user-select: none;
  pointer-events: none;
}

img[src] {
  opacity: 1;
  transition: opacity 0.4s ease-in-out;
}

.group:hover img {
  transform-origin: center center;
  object-position: center center;
}

.modal-enter-active,
.modal-leave-active {
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
