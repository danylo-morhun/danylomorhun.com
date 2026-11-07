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
      position: relative;
      width: 1200px;
      height: 600px;
      background-color: #060606;
      font-family: Geist OG;
    "
  >
    <!-- A frame of the hero beams (scripts/capture-og-beams.mjs), darkened on the left where the text sits. -->
    <img
      src="/og/beams.jpg"
      width="1200"
      height="600"
      style="position: absolute; top: 0; left: 0; width: 1200px; height: 600px;"
    >
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 0;
        width: 1200px;
        height: 600px;
        box-sizing: border-box;
        padding: 72px;
        background-image: linear-gradient(90deg, rgba(6, 6, 6, 0.92) 0%, rgba(6, 6, 6, 0.7) 45%, rgba(6, 6, 6, 0.1) 100%);
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

      <div style="display: flex; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.14); padding-top: 32px;">
        <span style="font-family: Geist Mono OG; font-size: 20px; color: #8a8a8a;">
          {{ tagline }}
        </span>
      </div>
    </div>
  </div>
</template>
