<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

interface NavItem {
  id: string;
  label: string;
  icon: string;
  isRoute?: boolean;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: 'ri-home-line' },
  { id: 'case-studies', label: 'Case Studies', icon: 'ri-briefcase-line' },
  { id: 'experience', label: 'Experience', icon: 'ri-briefcase-4-line' },
  { id: 'playground', label: 'Playground', icon: 'ri-code-s-slash-line' },
  { id: 'about', label: 'About', icon: 'ri-user-line', isRoute: true },
];

const activeSection = ref<string>('hero');
const isVisible = ref(false);
const activeIndex = ref(0);

watch(() => route.path, (newPath) => {
  if (newPath === '/about') {
    const aboutIndex = navItems.findIndex(item => item.id === 'about');
    if (aboutIndex !== -1) {
      activeIndex.value = aboutIndex;
      activeSection.value = 'about';
    }
  } else if (newPath === '/') {
    activeSection.value = 'hero';
    activeIndex.value = 0;
  }
}, { immediate: true });

const handleNavClick = async (item: NavItem) => {
  if (item.isRoute) {
    router.push(`/${item.id}`);
  } else {
    if (route.path !== '/') {
      router.push('/');
      await nextTick();
      setTimeout(() => {
        scrollToSection(item.id);
      }, 100);
    } else {
      scrollToSection(item.id);
    }
  }
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    const index = navItems.findIndex(item => item.id === sectionId);
    if (index !== -1) {
      activeIndex.value = index;
      activeSection.value = sectionId;
    }

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

const handleScroll = () => {
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    isVisible.value = heroBottom < window.innerHeight * 0.5;
  }

  // If we're at the top of the page, default to hero section
  if (window.scrollY < 100) {
    if (activeSection.value !== 'hero') {
      activeSection.value = 'hero';
      activeIndex.value = 0;
    }
    return;
  }

  const sections = navItems
    .filter(item => !item.isRoute)
    .map(item => ({
      id: item.id,
      element: document.getElementById(item.id),
    }))
    .filter(section => section.element !== null);

  const scrollPosition = window.scrollY + 150;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.element) {
      const sectionTop = section.element.offsetTop;
      if (scrollPosition >= sectionTop) {
        const newActiveId = section.id;
        if (activeSection.value !== newActiveId) {
          activeSection.value = newActiveId;
          const index = navItems.findIndex(item => item.id === newActiveId);
          if (index !== -1) {
            activeIndex.value = index;
          }
        }
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Wait for the page to be fully laid out before checking scroll position
  nextTick(() => {
    setTimeout(() => {
      handleScroll();
    }, 100);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    :class="[
      'fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-500',
      'hidden lg:block',
    ]"
  >
    <div class="relative bg-white/90 backdrop-blur-lg rounded-full shadow-large border border-gray-200/50 p-2 flex flex-col gap-1.5">
      <div
        class="absolute left-2 right-2 rounded-full bg-primary/10 transition-all duration-500 ease-out"
        :style="{
          top: `${activeIndex * (48 + 6)}px`,
          height: '48px',
        }"
      ></div>
      
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="handleNavClick(item)"
        :class="[
          'group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 ease-out z-10',
          'hover:bg-primary/15 hover:shadow-medium',
          (activeSection === item.id || (item.isRoute && route.path === `/${item.id}`))
            ? 'text-primary shadow-soft scale-105'
            : 'text-text hover:text-primary'
        ]"
        :aria-label="item.label"
      >
        <div
          :class="[
            'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full transition-all duration-500 ease-out',
            activeSection === item.id ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
          ]"
        ></div>
        
        <i
          :class="[
            'text-xl transition-all duration-500',
            activeSection === item.id ? 'scale-110' : 'scale-100 group-hover:scale-110',
            item.icon
          ]"
        ></i>
        
        <div
          class="absolute left-full ml-3 px-3 py-2 bg-surface text-white text-sm font-semibold rounded-lg shadow-large whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50"
        >
          {{ item.label }}
          <div class="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-surface"></div>
        </div>
      </button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  will-change: transform, opacity;
}
</style>

