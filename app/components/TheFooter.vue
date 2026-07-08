<script setup lang="ts">
import { RiGithubFill, RiLinkedinBoxFill, RiMailFill } from '@remixicon/vue'
import { site } from '~/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex max-w-content flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-sans text-base font-semibold tracking-tight text-ink">{{ site.name }}</p>
        <p class="font-mono text-xs text-muted">{{ site.title }}</p>
      </div>

      <div class="flex items-center gap-5">
        <a
          :href="`mailto:${site.email}`"
          aria-label="Email"
          class="text-muted transition-colors duration-200 hover:text-accent"
        ><RiMailFill size="20px" /></a>
        <a
          :href="site.github"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          class="text-muted transition-colors duration-200 hover:text-accent"
        ><RiGithubFill size="20px" /></a>
        <a
          :href="site.linkedin"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="LinkedIn"
          class="text-muted transition-colors duration-200 hover:text-accent"
        ><RiLinkedinBoxFill size="20px" /></a>
        <a
          :href="`mailto:${site.email}`"
          class="rounded-full border border-accent px-4 py-1.5 text-sm text-accent transition-colors duration-200 hover:bg-accent hover:text-accent-ink"
        >Contact</a>
      </div>
    </div>

    <p class="border-t border-line px-6 py-4 text-center font-mono text-xs text-muted">
      &copy; {{ year }} {{ site.name }}
    </p>
  </footer>
</template>
