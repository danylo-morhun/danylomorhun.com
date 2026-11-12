<script setup lang="ts">
import { useSite } from '~/composables/useSite'

const { t } = useI18n()
const site = useSite()
const year = new Date().getFullYear()
const { copied, copyEmail } = useCopyEmail()
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex max-w-content flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="font-sans text-base font-semibold tracking-tight text-ink">
          {{ site.name }}
        </p>
        <p class="font-mono text-xs text-muted">
          {{ site.title }}
        </p>
      </div>

      <div class="flex items-center gap-6">
        <button
          type="button"
          :aria-label="t('footer.copyEmailAria')"
          class="-m-3 p-3 text-muted transition-colors duration-200 hover:text-accent"
          @click="copyEmail"
        >
          <AppIcon
            v-if="copied"
            name="mail-check-fill"
            :size="20"
          /><AppIcon
            v-else
            name="mail-fill"
            :size="20"
          />
        </button>
        <a
          :href="site.github"
          target="_blank"
          rel="noreferrer noopener"
          :aria-label="t('footer.githubAria')"
          class="-m-3 p-3 text-muted transition-colors duration-200 hover:text-accent"
        ><AppIcon
          name="github-fill"
          :size="20"
        /></a>
        <a
          :href="site.linkedin"
          target="_blank"
          rel="noreferrer noopener"
          :aria-label="t('footer.linkedinAria')"
          class="-m-3 p-3 text-muted transition-colors duration-200 hover:text-accent"
        ><AppIcon
          name="linkedin-box-fill"
          :size="20"
        /></a>
        <a
          :href="`mailto:${site.email}`"
          class="relative rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink transition-transform duration-200 after:absolute after:inset-x-0 after:-inset-y-1.5 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97]"
        >{{ t('footer.contact') }}</a>
      </div>
    </div>

    <p class="border-t border-line px-6 py-4 text-center font-mono text-xs text-muted">
      &copy; {{ year }} {{ site.name }}
    </p>

    <CopyToast
      :show="copied"
      :message="t('footer.emailCopiedToast')"
    />
  </footer>
</template>
