<script setup lang="ts">
const colorMode = useColorMode()
const { localeProperties } = useI18n()
const site = useSite()

useHead({
  meta: [
    { name: 'theme-color', content: computed(() => (colorMode.value === 'light' ? '#f5f5f5' : '#060606')) },
  ],
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
        name: site.value.name,
        url: 'https://www.danylomorhun.com',
        jobTitle: site.value.title,
        email: `mailto:${site.value.email}`,
        sameAs: [site.value.github, site.value.linkedin],
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
