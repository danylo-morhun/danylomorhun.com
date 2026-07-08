<script setup lang="ts">
import { RiGithubFill, RiLinkedinBoxFill } from '@remixicon/vue'
import { site } from '~/data/site'
</script>

<template>
  <section id="contact" class="border-t border-line">
    <div class="mx-auto max-w-content px-6 py-28 text-center md:py-36">
      <h2 class="mx-auto max-w-2xl text-3xl font-medium tracking-tightest text-ink md:text-5xl">
        Open to frontend roles — let's talk.
      </h2>
      <p class="mx-auto mt-4 max-w-[50ch] text-muted">
        {{ site.email }} — or reach out on GitHub / LinkedIn.
      </p>

      <div class="mt-10 flex justify-center">
        <a
          :href="`mailto:${site.email}`"
          class="rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
        >Contact</a>
      </div>

      <div class="mt-8 flex justify-center gap-6">
        <a
          :href="site.github"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          class="text-muted transition-colors duration-200 hover:text-accent"
        ><RiGithubFill size="22px" /></a>
        <a
          :href="site.linkedin"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="LinkedIn"
          class="text-muted transition-colors duration-200 hover:text-accent"
        ><RiLinkedinBoxFill size="22px" /></a>
      </div>
    </div>
  </section>
</template>
