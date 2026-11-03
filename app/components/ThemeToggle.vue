<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

// The server can't know the theme, so which icon shows is left to the root
// `.dark` / `.light` class that color-mode sets before first paint.
function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:text-ink active:scale-90"
    :aria-label="t('themeToggle.label')"
    @click="toggle"
  >
    <AppIcon
      name="sun-line"
      :size="16"
      class="theme-icon theme-icon-sun absolute"
    />
    <AppIcon
      name="moon-line"
      :size="16"
      class="theme-icon theme-icon-moon absolute"
    />
  </button>
</template>

<style>
.theme-icon {
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}

.dark .theme-icon-moon,
.light .theme-icon-sun {
  opacity: 0;
  transform: rotate(45deg) scale(0.7);
}
</style>
