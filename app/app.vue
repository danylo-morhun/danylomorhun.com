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
const siteConfig = useSiteConfig()

useHead({
  meta: [
    { name: 'theme-color', content: computed(() => (colorMode.value === 'light' ? '#f5f5f5' : '#060606')) },
  ],
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

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': site.value.name,
        'url': siteConfig.url,
        'jobTitle': site.value.title,
        'email': `mailto:${site.value.email}`,
        'sameAs': [site.value.github, site.value.linkedin],
      }),
    },
  ],
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
