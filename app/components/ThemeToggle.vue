<script setup lang="ts">
import { RiMoonLine, RiSunLine } from '@remixicon/vue'

const { t } = useI18n()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors duration-200 hover:text-ink active:scale-90"
    :aria-label="isDark ? t('themeToggle.toLight') : t('themeToggle.toDark')"
    @click="toggle"
  >
    <Transition name="theme-icon" mode="out-in">
      <RiSunLine v-if="isDark" key="sun" size="16px" />
      <RiMoonLine v-else key="moon" size="16px" />
    </Transition>
  </button>
</template>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-45deg) scale(0.7);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(45deg) scale(0.7);
}
</style>
