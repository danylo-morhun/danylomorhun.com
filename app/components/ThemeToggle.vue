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
    class="relative flex size-11 shrink-0 items-center justify-center rounded-lg theme-toggle text-muted hover:text-ink motion-safe:active:scale-[0.94] pointer-fine:size-8"
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
.theme-toggle {
  transition:
    color 200ms ease,
    scale var(--duration-spring-press) var(--ease-spring-press);
}

/* Rare and playful, so the incoming icon gets a little overshoot. */
.theme-icon {
  transition:
    opacity 200ms ease,
    transform var(--duration-spring-bouncy) var(--ease-spring-bouncy);
}

.dark .theme-icon-moon,
.light .theme-icon-sun {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .dark .theme-icon-moon,
  .light .theme-icon-sun {
    transform: rotate(45deg) scale(0.7);
  }
}
</style>
