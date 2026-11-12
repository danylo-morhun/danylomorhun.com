<script setup lang="ts">
import { site } from '~/data/site'

const { t } = useI18n()
const { copied, copyEmail } = useCopyEmail()
</script>

<template>
  <section
    id="contact"
    class="border-t border-line"
  >
    <div class="mx-auto max-w-content px-6 py-28 text-center md:py-36">
      <h2 class="mx-auto max-w-2xl text-3xl font-medium tracking-tightest text-ink md:text-5xl">
        {{ t('contact.heading') }}
      </h2>
      <p class="mx-auto mt-4 max-w-[50ch] text-muted">
        <a
          :href="`mailto:${site.email}`"
          class="underline decoration-dotted underline-offset-4 transition-colors duration-200 hover:text-accent"
        >{{ site.email }}</a>
        <button
          type="button"
          :aria-label="t('footer.copyEmailAria')"
          class="relative mx-1 inline-flex size-6 items-center justify-center rounded-md align-[-0.2em] text-muted transition-colors duration-200 after:absolute after:-inset-2.5 hover:text-ink"
          @click="copyEmail"
        >
          <AppIcon
            :name="copied ? 'mail-check-fill' : 'mail-fill'"
            :size="16"
          />
        </button>
        {{ t('contact.reachOut') }}
      </p>

      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <a
          :href="`mailto:${site.email}`"
          class="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97]"
        >{{ t('contact.contact') }}</a>
        <a
          v-if="site.resumeUrl"
          :href="site.resumeUrl"
          download
          class="flex items-center gap-1.5 rounded-xl border border-line-strong px-6 py-3 text-sm text-ink transition-transform duration-200 motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97]"
        ><AppIcon
          name="download-line"
          :size="16"
        /> {{ t('contact.resume') }}</a>
      </div>

      <div class="mt-8 flex justify-center gap-6">
        <a
          :href="site.github"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          class="-m-2.75 p-2.75 text-muted transition-colors duration-200 hover:text-accent"
        ><AppIcon
          name="github-fill"
          :size="22"
        /></a>
        <a
          :href="site.linkedin"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="LinkedIn"
          class="-m-2.75 p-2.75 text-muted transition-colors duration-200 hover:text-accent"
        ><AppIcon
          name="linkedin-box-fill"
          :size="22"
        /></a>
      </div>
    </div>

    <CopyToast
      :show="copied"
      :message="t('footer.emailCopiedToast')"
    />
  </section>
</template>
