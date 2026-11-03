<script setup lang="ts">
import type { CaseStudyGalleryImage } from '~/composables/useCaseStudies'

defineProps<{
  image: CaseStudyGalleryImage
  sizes: string
  topAligned?: boolean
}>()

defineEmits<{ open: [src: string] }>()

const { t } = useI18n()
</script>

<template>
  <figure>
    <button
      type="button"
      :aria-label="t('project.enlargeAria', { caption: image.caption })"
      class="group relative block w-full"
      @click="$emit('open', image.src)"
    >
      <img
        :src="image.src"
        :srcset="imageSrcset(image.src)"
        :sizes="sizes"
        :alt="image.alt"
        width="1440"
        height="900"
        loading="lazy"
        class="aspect-[8/5] w-full rounded-xl border border-line object-cover shadow-lg transition-opacity duration-200 group-hover:opacity-90"
        :class="topAligned && 'object-top'"
      >
      <span class="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        <AppIcon
          name="zoom-in-line"
          :size="18"
        />
      </span>
    </button>
    <figcaption class="mt-3 text-sm text-muted">
      {{ image.caption }}
    </figcaption>
  </figure>
</template>
