<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleResumeClick = () => {
  window.open('/Frontend_Developer_Morhun_Danylo.pdf', '_blank');
};
</script>

<template>
  <header
    :class="[
      'top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-soft' : 'bg-background'
    ]"
  >
    <nav class="px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto max-w-6xl flex items-center justify-between h-16 md:h-20">
        <button
          @click="router.push('/')"
          class="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src="/img/logo.png"
            alt="Danylo Morhun"
            class="h-8 md:h-10 w-auto select-none"
            draggable="false"
            @contextmenu.prevent
          />
        </button>

        <button
          @click="handleResumeClick"
          class="px-6 py-2.5 md:px-8 md:py-3 bg-primary/10 text-primary border-2 border-primary/20 rounded-full font-semibold text-sm md:text-base hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 group"
        >
          Resume
          <i class="ri-arrow-right-line text-base group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>

