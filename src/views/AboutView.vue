<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SideNavigation from '../components/SideNavigation.vue';
import { useTextUnderline } from '../composables/useTextUnderline';
import { useImageCarousel } from '../composables/useImageCarousel';
import UnderlineSvg from '../components/UnderlineSvg.vue';

const underlinePhrases = [
  'Middle Frontend Engineer',
  'millions of events',
  'production-ready solutions',
  'balance'
];

const { processTextWithUnderlines } = useTextUnderline(underlinePhrases);

const developerText = `Hey there again, I'm Danylo, a Middle Frontend Engineer crafting Resilient Systems that process millions of events daily. I bridge the gap between massive backend datasets and frictionless UI, building scalable web applications and data pipelines that transform complex technical challenges into elegant, production-ready solutions.`;

const personalPhotos = [
  '/img/myself/IMG_2828.JPG',
  '/img/myself/IMG_4496.JPG',
  '/img/myself/IMG_1851.JPG',
];

const {
  isModalOpen: isPhotoModalOpen,
  currentImageIndex: currentPhotoIndex,
  hasMultipleImages: hasMultiplePhotos,
  openModal: openPhotoModal,
  closeModal: closePhotoModal,
  handleBackdropClick: handlePhotoBackdropClick,
  goToNext: goToNextPhoto,
  goToPrevious: goToPreviousPhoto,
  goToImage: goToPhoto,
  handleKeyDown: handlePhotoKeyDown,
} = useImageCarousel(personalPhotos);

const processTextWithAccents = (text: string, accentWords: string[]) => {
  let processedText = text;
  const sortedWords = accentWords.sort((a, b) => b.length - a.length);
  sortedWords.forEach(word => {
    const regex = new RegExp(`\\b(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
    processedText = processedText.replace(regex, (match) => {
      if (match.includes('<strong')) return match;
      return `<strong class="text-primary font-semibold">${match}</strong>`;
    });
  });
  return processedText;
};

onMounted(() => {
  window.addEventListener('keydown', handlePhotoKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handlePhotoKeyDown);
});
</script>

<template>
  <div>
    <SideNavigation />
    
    <div class="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-6xl">
      <div class="text-center mb-20">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
          <span class="relative inline-block px-1">
            Peekabo
            <UnderlineSvg height="12" viewBox="0 0 180 12" path="M 2,8 Q 15,3 30,6 Q 45,2 60,7 Q 75,4 90,5 Q 105,3 120,7 Q 135,2 150,6 Q 165,4 178,8" stroke-width="3.5" />
          </span>
          at my life
        </h1>
      </div>
      <section class="mb-24">
        <div class="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-large border border-gray-100/50 p-12 md:p-16 hover:shadow-2xl transition-all duration-500 hover:border-primary/20">
          <div class="flex items-center gap-4 mb-10">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <i class="ri-code-s-slash-line text-3xl text-primary"></i>
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
              As a Developer
            </h2>
          </div>
          <div class="max-w-4xl">
            <p class="text-lg md:text-xl lg:text-2xl text-text leading-relaxed">
              <template v-for="(part, partIndex) in processTextWithUnderlines(developerText)" :key="partIndex">
                <span v-if="part.shouldUnderline" class="relative inline-block">
                  {{ part.text }}
                  <!-- Hand-drawn SVG underline - matching style -->
                  <svg
                    class="absolute -bottom-1 left-0 w-full"
                    height="10"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    style="overflow: visible;"
                  >
                    <path
                      d="M 2,7 Q 20,2 40,5 Q 60,3 80,6 Q 100,2 120,5 Q 140,3 160,6 Q 180,2 198,7"
                      stroke="var(--color-primary)"
                      stroke-width="3"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      vector-effect="non-scaling-stroke"
                      style="filter: drop-shadow(0 1px 1px var(--color-primary-shadow));"
                    />
                  </svg>
                </span>
                <span v-else>{{ part.text }}</span>
              </template>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div class="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-large border border-gray-100/50 p-12 md:p-16 hover:shadow-2xl transition-all duration-500 hover:border-primary/20">
          <div class="flex items-center gap-4 mb-10">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <i class="ri-user-heart-line text-3xl text-primary"></i>
            </div>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
              Beyond the code
            </h2>
          </div>
          
          <div class="max-w-4xl mx-auto space-y-8">
            <p class="text-lg md:text-xl text-text leading-relaxed">
              <template v-for="(part, partIndex) in processTextWithUnderlines('Beyond the code, I\'m someone who thrives on balance between pushing technical boundaries and staying grounded through physical activity and continuous learning.')" :key="partIndex">
                <span v-if="part.shouldUnderline" class="relative inline-block">
                  {{ part.text }}
                  <UnderlineSvg />
                </span>
                <span v-else>{{ part.text }}</span>
              </template>
            </p>

            <div class="mb-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
                <div
                  v-for="(photo, index) in personalPhotos"
                  :key="index"
                  class="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 group cursor-pointer"
                  @click="openPhotoModal(index)"
                >
                  <img
                    :src="photo"
                    :alt="`Personal photo ${index + 1}`"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
                      <i class="ri-zoom-in-line text-base"></i>
                      <span>View photo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-200">
              <div class="flex items-start gap-4 p-6 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-primary/5 hover:border-primary/30 hover:shadow-large hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div class="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="group-hover:rotate-3 transition-transform duration-300">
                    <path d="M12 2L12 14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 14L8 18Q6 20 4 20Q2 20 2 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="3" cy="16" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-text mb-2 text-lg group-hover:text-primary transition-colors duration-300">Hockey Player</h4>
                  <p class="text-text/70 leading-relaxed">
                    I play hockey regularly, which keeps me disciplined, focused, and teaches me the value of <strong class="text-primary">teamwork</strong>. These skills translate directly to collaborative development environments.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-6 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-primary/5 hover:border-primary/30 hover:shadow-large hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div class="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <i class="ri-run-line text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-text mb-2 text-lg group-hover:text-primary transition-colors duration-300">Sports Enthusiast</h4>
                  <p class="text-text/70 leading-relaxed">
                    I'm passionate about staying active. Regular exercise helps me maintain the energy and mental clarity needed to tackle <strong class="text-primary">complex technical challenges</strong>.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-6 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-primary/5 hover:border-primary/30 hover:shadow-large hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div class="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <i class="ri-book-open-line text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-text mb-2 text-lg group-hover:text-primary transition-colors duration-300">Always Learning</h4>
                  <p class="text-text/70 leading-relaxed" v-html="processTextWithAccents('I\'m constantly expanding my skill set. Currently diving deep into backend development, UI/UX design, and AI and automation to become a more well-rounded engineer.', ['backend', 'design', 'AI'])"></p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-6 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-primary/5 hover:border-primary/30 hover:shadow-large hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div class="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <i class="ri-lightbulb-line text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-text mb-2 text-lg group-hover:text-primary transition-colors duration-300">Growth Mindset</h4>
                  <p class="text-text/70 leading-relaxed" v-html="processTextWithAccents('I believe in pushing beyond my comfort zone. Whether it\'s learning a new backend framework, exploring design principles, or experimenting with AI tools, I\'m always seeking ways to grow.', ['backend', 'design', 'AI'])"></p>
                </div>
              </div>
            </div>

            <div class="pt-8 border-t border-gray-200">
              <img
                src="/img/quote.png"
                alt="Quote"
                class="w-full max-w-3xl mx-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isPhotoModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click="handlePhotoBackdropClick"
          @keydown="handlePhotoKeyDown"
        >
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          
          <div class="relative z-10 max-w-7xl w-full max-h-[90vh] flex flex-col">
            <button
              @click="closePhotoModal"
              class="absolute -top-12 right-0 text-white hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
            >
              <span class="text-sm font-medium">Close</span>
              <div class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                <i class="ri-close-line text-xl"></i>
              </div>
            </button>
            
            <div class="bg-white rounded-2xl overflow-hidden shadow-2xl relative">
              <button
                v-if="hasMultiplePhotos"
                @click.stop="goToPreviousPhoto"
                class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl text-text hover:text-primary transition-all duration-200 flex items-center justify-center hover:scale-110 group"
                aria-label="Previous photo"
              >
                <i class="ri-arrow-left-line text-2xl group-hover:translate-x-[-2px] transition-transform"></i>
              </button>
              
              <button
                v-if="hasMultiplePhotos"
                @click.stop="goToNextPhoto"
                class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl text-text hover:text-primary transition-all duration-200 flex items-center justify-center hover:scale-110 group"
                aria-label="Next photo"
              >
                <i class="ri-arrow-right-line text-2xl group-hover:translate-x-[2px] transition-transform"></i>
              </button>
              
              <div class="relative overflow-hidden">
                <Transition name="carousel-fade" mode="out-in">
                  <div
                    :key="currentPhotoIndex"
                    class="relative"
                  >
                    <img
                      :src="personalPhotos[currentPhotoIndex]"
                      :alt="`Personal photo ${currentPhotoIndex + 1}`"
                      class="w-full h-auto max-h-[90vh] object-contain"
                    />
                  </div>
                </Transition>
              </div>
              
              <div
                v-if="hasMultiplePhotos"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
              >
                <button
                  v-for="(_, index) in personalPhotos"
                  :key="index"
                  @click.stop="goToPhoto(index)"
                  :class="[
                    'w-2 h-2 rounded-full transition-all duration-200',
                    index === currentPhotoIndex
                      ? 'bg-primary w-8 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  ]"
                  :aria-label="`Go to photo ${index + 1}`"
                />
              </div>
              
              <div
                v-if="hasMultiplePhotos"
                class="absolute top-4 right-4 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full"
              >
                {{ currentPhotoIndex + 1 }} / {{ personalPhotos.length }}
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
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
