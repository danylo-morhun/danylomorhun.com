<script setup lang="ts">
import { RiDownloadLine } from '@remixicon/vue'
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
      class="mx-auto flex max-w-2xl items-center justify-between rounded-xl border border-ink/10 bg-ink/[0.04] px-4 py-3 backdrop-blur-md"
    >
      <a href="#top" class="font-sans text-lg font-bold tracking-tight text-ink" aria-label="Home">
        {{ site.name }}
      </a>

      <div class="hidden items-center gap-8 sm:flex">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-sm text-muted transition-colors duration-200 hover:text-ink"
        >{{ link.label }}</a>
      </div>

      <div class="flex items-center gap-3">
        <a
          v-if="site.resumeUrl"
          :href="site.resumeUrl"
          download
          class="hidden items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-ink sm:flex"
        ><RiDownloadLine size="16px" /> Resume</a>

        <ThemeToggle />

        <a
          href="#contact"
          class="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink transition-opacity duration-200 hover:opacity-85"
        >Contact</a>
      </div>
    </nav>
  </header>
</template>
