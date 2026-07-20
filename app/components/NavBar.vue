<script setup lang="ts">
import { site } from '~/data/site'

const { t } = useI18n()

const links = computed(() => [
  { href: '#work', label: t('nav.work') },
  { href: '#lab', label: t('nav.lab') },
  { href: '#experience', label: t('nav.experience') },
  { href: '#about', label: t('nav.about') },
])
</script>

<template>
  <header class="fixed inset-x-0 top-3 z-40 px-4">
    <nav
      class="mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-xl border border-ink/10 bg-ink/[0.04] px-4 py-3 backdrop-blur-md"
    >
      <a href="#top" class="shrink-0 whitespace-nowrap font-sans text-lg font-bold tracking-tight text-ink" :aria-label="`${site.name} - ${t('nav.home')}`">
        {{ site.name }}
      </a>

      <div class="hidden min-w-0 items-center gap-6 lg:flex">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="whitespace-nowrap text-sm text-muted transition-colors duration-200 hover:text-ink"
        >{{ link.label }}</a>
      </div>

      <div class="flex shrink-0 items-center gap-4">
        <div class="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        <a
          href="#contact"
          class="whitespace-nowrap rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink transition-opacity duration-200 hover:opacity-85"
        >{{ t('nav.contact') }}</a>
      </div>
    </nav>
  </header>
</template>
