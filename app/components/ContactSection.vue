<script setup lang="ts">
import { RiGithubFill, RiLinkedinBoxFill } from '@remixicon/vue'
import { ref } from 'vue'
import { site } from '~/data/site'

const copied = ref(false)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(site.email)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  }
  catch {
    // clipboard unavailable — mailto link still works
  }
}
</script>

<template>
  <section id="contact" class="border-t border-line">
    <div class="mx-auto max-w-content px-6 py-28 text-center md:py-36">
      <h2 class="mx-auto max-w-2xl text-3xl font-medium tracking-tightest text-ink md:text-5xl">
        Open to React, Next.js, Vue, or Nuxt roles — let's talk.
      </h2>
      <p class="mx-auto mt-4 max-w-[50ch] text-muted">
        <a
          :href="`mailto:${site.email}`"
          class="underline decoration-dotted underline-offset-4 transition-colors duration-200 hover:text-accent"
          @click="copyEmail"
        >{{ site.email }}</a>
        <span v-if="copied" class="ml-2 text-xs text-accent">Copied</span>
        — or reach out on GitHub / LinkedIn.
      </p>

      <div class="mt-10 flex justify-center">
        <a
          :href="`mailto:${site.email}`"
          class="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
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
