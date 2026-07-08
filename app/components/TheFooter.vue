<script setup lang="ts">
import { RiGithubFill, RiLinkedinBoxFill, RiMailCheckFill, RiMailFill } from '@remixicon/vue'
import { ref } from 'vue'
import { site } from '~/data/site'

const year = new Date().getFullYear()
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
    // clipboard unavailable — no-op
  }
}
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex max-w-content flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-sans text-base font-semibold tracking-tight text-ink">{{ site.name }}</p>
        <p class="font-mono text-xs text-muted">{{ site.title }}</p>
      </div>

      <div class="flex items-center gap-5">
        <button
          type="button"
          aria-label="Copy email"
          class="text-muted transition-colors duration-200 hover:text-accent"
          @click="copyEmail"
        ><RiMailCheckFill v-if="copied" size="20px" /><RiMailFill v-else size="20px" /></button>
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
          class="rounded-lg border border-accent px-4 py-1.5 text-sm text-accent transition-colors duration-200 hover:bg-accent hover:text-accent-ink"
        >Contact</a>
      </div>
    </div>

    <p class="border-t border-line px-6 py-4 text-center font-mono text-xs text-muted">
      &copy; {{ year }} {{ site.name }}
    </p>

    <CopyToast :show="copied" message="Email copied" />
  </footer>
</template>
