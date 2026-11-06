<script setup lang="ts">
import geistCyrillic from '@fontsource-variable/geist/files/geist-cyrillic-wght-normal.woff2?url'
import geistLatinExt from '@fontsource-variable/geist/files/geist-latin-ext-wght-normal.woff2?url'
import geistLatin from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'

// Headline and body text use Geist; fetch the subsets this locale needs right away
// instead of after CSS is parsed, so the swap from the fallback happens sooner.
const FONT_PRELOADS: Record<string, string[]> = {
  en: [geistLatin],
  uk: [geistLatin, geistCyrillic],
  pl: [geistLatin, geistLatinExt],
}

const colorMode = useColorMode()
const { locale, localeProperties } = useI18n()
const site = useSite()

const THEME_COLORS = { light: '#f5f5f5', dark: '#060606' }

// The server can't know a saved theme, so it ships both colors and lets the OS pick;
// once the reader chooses a theme, the browser chrome follows that instead.
useHead({
  meta: () => colorMode.preference === 'system'
    ? [
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: THEME_COLORS.light },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: THEME_COLORS.dark },
      ]
    : [{ name: 'theme-color', content: colorMode.value === 'light' ? THEME_COLORS.light : THEME_COLORS.dark }],
})

useHead({
  link: () => (FONT_PRELOADS[locale.value] ?? [geistLatin]).map(href => ({
    rel: 'preload',
    as: 'font',
    type: 'font/woff2',
    crossorigin: '',
    href,
  })),
})

useSeoMeta({
  ogSiteName: () => site.value.name,
  ogType: 'website',
  ogLocale: () => localeProperties.value.language,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
