<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  tag?: string
  tagline?: string
}>(), {
  subtitle: '',
  tag: 'danylomorhun.com',
  tagline: 'Fullstack Engineer — Fintech, Business Intelligence',
})
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 1200px;
      height: 600px;
      box-sizing: border-box;
      padding: 72px;
      background-color: #0d0d0d;
      font-family: Geist OG;
    "
  >
    <div style="display: flex; align-items: center;">
      <span style="font-family: Geist Mono OG; font-size: 22px; letter-spacing: 2px; color: #8a8a8a; text-transform: uppercase;">
        {{ tag }}
      </span>
    </div>

    <div style="display: flex; flex-direction: column; max-width: 920px;">
      <span style="font-size: 72px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05; color: #f5f5f5;">
        {{ title }}
      </span>
      <span
        v-if="subtitle"
        style="margin-top: 28px; font-size: 30px; line-height: 1.4; color: #a6a6a6;"
      >
        {{ subtitle }}
      </span>
    </div>

    <div style="display: flex; align-items: center; border-top: 1px solid #333333; padding-top: 32px;">
      <span style="font-family: Geist Mono OG; font-size: 20px; color: #8a8a8a;">
        {{ tagline }}
      </span>
    </div>
  </div>
</template>
