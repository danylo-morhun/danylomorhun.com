<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

const isNotFound = computed(() => props.error.statusCode === 404)
const heading = computed(() => t(isNotFound.value ? 'error.notFoundTitle' : 'error.genericTitle'))

useSeoMeta({
  title: () => `${heading.value} · Danylo Morhun`,
  robots: 'noindex',
})

function goHome() {
  return clearError({ redirect: localePath('/') })
}
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto flex min-h-[80dvh] max-w-content flex-col items-start justify-center px-6 py-24">
      <p class="font-mono text-xs text-muted">
        {{ error.statusCode }}
      </p>
      <h1 class="mt-3 text-3xl font-medium tracking-tightest text-ink md:text-5xl">
        {{ heading }}
      </h1>
      <p class="mt-4 max-w-[50ch] text-lg leading-relaxed text-muted">
        {{ t(isNotFound ? 'error.notFoundBody' : 'error.genericBody') }}
      </p>
      <a
        :href="localePath('/')"
        class="mt-10 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
        @click.prevent="goHome"
      >{{ t('error.backHome') }}</a>
    </section>
  </NuxtLayout>
</template>
