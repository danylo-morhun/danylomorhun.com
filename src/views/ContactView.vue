<script setup lang="ts">
import { ref } from 'vue';
import SectionTitle from '../components/SectionTitle.vue';
import { personalInfo } from '../data/personal';
import { useSEO } from '../composables/useSEO';

useSEO({
  title: 'Contact',
  description: 'Get in touch with Danylo Morhun - Middle Full-Stack Engineer & Data Engineering Specialist. Available for freelance projects and opportunities.',
  url: 'https://www.danylomorhun.com/contact',
  keywords: ['contact', 'hire', 'freelance', 'full-stack engineer', 'web developer', 'San Francisco']
});

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  isSubmitting.value = true;
  
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  isSubmitting.value = false;
  submitSuccess.value = true;
  
  // Reset form
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  
  setTimeout(() => {
    submitSuccess.value = false;
  }, 5000);
};
</script>

<template>
  <div class="pt-20 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto max-w-6xl">
      <SectionTitle
        title="Get In Touch"
        subtitle="Have a project in mind? Let's discuss how we can work together"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div class="bg-white rounded-2xl shadow-medium p-10 md:p-12">
          <h3 class="text-3xl font-bold text-text mb-8">Contact Information</h3>
          <div class="space-y-8">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <i class="ri-mail-fill text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-text mb-1 text-lg">Email</h4>
                <a
                  :href="`mailto:${personalInfo.email}`"
                  class="text-text hover:text-primary transition-colors"
                >
                  {{ personalInfo.email }}
                </a>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <i class="ri-map-pin-fill text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-text mb-1 text-lg">Location</h4>
                <p class="text-text">{{ personalInfo.location }}</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <i class="ri-links-fill text-xl"></i>
              </div>
              <div>
                <h4 class="font-bold text-text mb-4 text-lg">Social Links</h4>
                <div class="flex gap-4">
                  <a
                    v-for="link in personalInfo.socialLinks"
                    :key="link.name"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-10 h-10 flex items-center justify-center rounded-full bg-background text-text hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                    :aria-label="link.name"
                  >
                    <i :class="[link.icon, 'text-xl']"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-medium p-10 md:p-12">
          <h3 class="text-3xl font-bold text-text mb-8">Send a Message</h3>
          <form @submit="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-semibold text-text mb-2">
                Name
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-5 py-3 border border-white/30 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="Your name"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-semibold text-text mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full px-5 py-3 border border-white/30 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="danymorhun@gmail.com"
              />
            </div>
            <div>
              <label for="subject" class="block text-sm font-semibold text-text mb-2">
                Subject
              </label>
              <input
                id="subject"
                v-model="formData.subject"
                type="text"
                required
                class="w-full px-5 py-3 border border-white/30 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-background"
                placeholder="Project inquiry"
              />
            </div>
            <div>
              <label for="message" class="block text-sm font-semibold text-text mb-2">
                Message
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="5"
                class="w-full px-5 py-3 border border-white/30 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none bg-background"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isSubmitting" class="flex items-center justify-center gap-2">
                Send Message
                <i class="ri-send-plane-fill"></i>
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <i class="ri-loader-4-line animate-spin"></i>
                Sending...
              </span>
            </button>
            <div
              v-if="submitSuccess"
              class="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-sm flex items-center gap-2"
            >
              <i class="ri-checkbox-circle-fill text-lg"></i>
              Message sent successfully! I'll get back to you soon.
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

