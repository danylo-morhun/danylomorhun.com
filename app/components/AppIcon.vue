<script setup lang="ts">
import { icons, type IconName } from '~/data/icons'

withDefaults(defineProps<{ name: IconName, size?: number }>(), { size: 24 })
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="icons[name]" />
  </svg>
</template>
