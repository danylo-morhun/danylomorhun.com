<script setup lang="ts">
import { ref } from 'vue';
import { personalInfo } from '../data/personal';

const isCopied = ref(false);

const handleResumeClick = () => {
  window.open('/resume.pdf', '_blank');
};

const handleCopyEmail = async () => {
  try {
    await navigator.clipboard.writeText(personalInfo.email);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy email:', err);
  }
};

const linkedInLink = personalInfo.socialLinks.find(link => link.name === 'LinkedIn');
</script>

<template>
  <footer class="bg-white border-t border-gray-100 mt-32">
    <div class="container mx-auto px-auto py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div class="flex flex-col gap-1 text-sm md:text-base text-text/70">
          <p>© {{ new Date().getFullYear() }} Portfolio by {{ personalInfo.name }}</p>
        </div>

        <div class="flex items-center gap-3 flex-wrap justify-center md:justify-end">
          <button
            @click="handleResumeClick"
            class="px-6 py-2.5 md:px-8 md:py-3 bg-primary/10 text-primary border-2 border-primary/20 rounded-full font-semibold text-sm md:text-base hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 group"
          >
            Resume
            <i class="ri-arrow-right-line text-base group-hover:translate-x-1 transition-transform"></i>
          </button>

          <a
            v-if="linkedInLink"
            :href="linkedInLink.url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-6 py-2.5 md:px-8 md:py-3 bg-primary/10 text-primary border-2 border-primary/20 rounded-full font-semibold text-sm md:text-base hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 group"
          >
            LinkedIn
            <i class="ri-arrow-right-line text-base group-hover:translate-x-1 transition-transform"></i>
          </a>

          <button
            @click="handleCopyEmail"
            class="px-6 py-2.5 md:px-8 md:py-3 bg-primary/10 text-primary border-2 border-primary/20 rounded-full font-semibold text-sm md:text-base hover:bg-primary/15 hover:border-primary/30 hover:shadow-medium hover:scale-105 active:scale-100 transition-all duration-300 flex items-center gap-2 group"
          >
            <span class="hidden sm:inline">{{ personalInfo.email }}</span>
            <span class="sm:hidden">Email</span>
            <i class="ri-file-copy-line text-base group-hover:scale-110 transition-transform" v-if="!isCopied"></i>
            <i class="ri-check-line text-base text-green-500" v-else></i>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

