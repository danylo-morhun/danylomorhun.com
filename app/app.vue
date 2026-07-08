<script setup lang="ts">
const colorMode = useColorMode()

useHead({
  meta: [
    { name: 'theme-color', content: computed(() => (colorMode.value === 'light' ? '#f5f5f5' : '#060606')) },
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
