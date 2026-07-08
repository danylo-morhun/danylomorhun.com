<script setup lang="ts">
import { site } from '~/data/site'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
]
</script>

<template>
  <header class="fixed inset-x-0 top-3 z-40 px-4">
    <nav
      class="mx-auto flex max-w-2xl items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md"
    >
      <a href="#top" class="font-sans text-lg font-bold tracking-tight text-ink" aria-label="Home">
        {{ site.name }}
      </a>

      <div class="hidden items-center gap-8 sm:flex">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-sm text-white/60 transition-colors duration-200 hover:text-white"
        >{{ link.label }}</a>
      </div>

      <a
        href="#contact"
        class="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink transition-opacity duration-200 hover:opacity-85"
      >Contact</a>
    </nav>
  </header>
</template>
