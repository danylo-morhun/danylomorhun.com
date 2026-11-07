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

<!--
  Social sites show this at ~400px wide (LinkedIn shrinks it to 480×240 and
  re-encodes it), so every piece of text is sized to stay readable at a third
  of its size, and there are no hairlines to turn into compression artifacts.
-->
<template>
  <div
    style="
      display: flex;
      position: relative;
      width: 1200px;
      height: 630px;
      background-color: #060606;
      font-family: Geist OG;
    "
  >
    <!-- A frame of the hero beams (scripts/capture-og-beams.mjs), darkened on the left where the text sits. -->
    <img
      src="/og/beams.jpg"
      width="1200"
      height="630"
      style="position: absolute; top: 0; left: 0; width: 1200px; height: 630px;"
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
        height: 630px;
        box-sizing: border-box;
        padding: 64px 72px;
        background-image: linear-gradient(90deg, rgba(6, 6, 6, 0.92) 0%, rgba(6, 6, 6, 0.6) 45%, rgba(6, 6, 6, 0) 100%);
      "
    >
      <span style="font-family: Geist Mono OG; font-size: 28px; letter-spacing: 1px; color: #a6a6a6; text-transform: uppercase;">
        {{ tag }}
      </span>

      <div style="display: flex; flex-direction: column; max-width: 1040px;">
        <span style="font-size: 80px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.05; color: #ffffff;">
          {{ title }}
        </span>
        <span
          v-if="subtitle"
          style="margin-top: 24px; font-size: 34px; line-height: 1.3; color: #c4c4c4;"
        >
          {{ subtitle }}
        </span>
      </div>

      <span style="font-size: 28px; color: #a6a6a6;">
        {{ tagline }}
      </span>
    </div>
  </div>
</template>
