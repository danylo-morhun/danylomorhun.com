<script setup lang="ts">
interface Props {
  height?: string;
  viewBox?: string;
  path?: string;
  strokeWidth?: string;
}

withDefaults(defineProps<Props>(), {
  height: '10',
  viewBox: '0 0 200 10',
  path: 'M 2,7 Q 20,2 40,5 Q 60,3 80,6 Q 100,2 120,5 Q 140,3 160,6 Q 180,2 198,7',
  strokeWidth: '3',
});
</script>

<template>
  <svg
    class="absolute -bottom-1 left-0 w-full"
    :height="height"
    :viewBox="viewBox"
    preserveAspectRatio="none"
    style="overflow: visible;"
  >
    <path
      :d="path"
      stroke="var(--color-primary)"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
      style="filter: drop-shadow(0 1px 1px var(--color-primary-shadow));"
    />
  </svg>
</template>

