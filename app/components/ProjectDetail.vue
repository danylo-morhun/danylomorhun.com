<script setup lang="ts">
import type { LocalizedCaseStudy } from '~/composables/useCaseStudies'
import type ImageLightbox from './ImageLightbox.vue'

const props = defineProps<{
  project: LocalizedCaseStudy
  backPath: string
  backLabel: string
  topAligned?: boolean
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const section = ref<HTMLElement | null>(null)
const lightbox = ref<InstanceType<typeof ImageLightbox> | null>(null)
const allImages = computed(() => [...props.project.gallery, ...(props.project.library ?? [])])

function openLightbox(src: string) {
  lightbox.value?.open(src)
}

useReveal(section)
</script>

<template>
  <article
    ref="section"
    class="mx-auto max-w-content px-6 py-24 md:py-32"
  >
    <NuxtLink
      :to="localePath(backPath)"
      class="reveal-item -my-3 inline-flex items-center gap-1.5 py-3 text-sm text-muted transition-colors duration-200 hover:text-ink"
    >
      <AppIcon
        name="arrow-left-line"
        :size="16"
      />
      {{ backLabel }}
    </NuxtLink>

    <header class="reveal-item mt-8">
      <p class="font-mono text-xs text-accent">
        {{ project.tag }}
      </p>
      <h1 class="mt-2 text-3xl font-medium tracking-tightest text-ink md:text-5xl">
        {{ project.name }}
      </h1>
      <p class="mt-4 text-sm text-muted">
        {{ project.role }}<template v-if="project.dates">
          · {{ project.dates }}
        </template>
      </p>
      <span
        v-if="project.nda"
        class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted"
      >
        <AppIcon
          name="lock-line"
          :size="13"
        />
        {{ t('project.ndaBadge') }}
      </span>
    </header>

    <p class="reveal-item mt-10 max-w-[70ch] text-lg leading-relaxed text-muted">
      {{ project.overview }}
    </p>

    <section class="reveal-item mt-16 border-t border-line pt-10">
      <h2 class="text-xl font-medium text-ink md:text-2xl">
        {{ t('project.theChallenge') }}
      </h2>
      <p class="mt-4 max-w-[70ch] text-base leading-relaxed text-muted">
        {{ project.challenge }}
      </p>
    </section>

    <section class="reveal-item mt-16 border-t border-line pt-10">
      <h2 class="text-xl font-medium text-ink md:text-2xl">
        {{ t('project.theApproach') }}
      </h2>
      <ul class="mt-6 space-y-4">
        <li
          v-for="point in project.approach"
          :key="point"
          class="relative max-w-[70ch] pl-5 text-base leading-relaxed text-muted"
        >
          <span
            class="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="reveal-item mt-16 border-t border-line pt-10">
      <h2 class="text-xl font-medium text-ink md:text-2xl">
        {{ t('project.theOutcome') }}
      </h2>
      <div class="mt-8 flex flex-wrap gap-x-12 gap-y-8">
        <div
          v-for="metric in project.outcome"
          :key="metric.label"
        >
          <p class="text-4xl font-semibold tracking-tightest text-ink md:text-5xl">
            {{ metric.value }}
          </p>
          <p class="mt-2 max-w-[26ch] text-sm text-muted">
            {{ metric.label }}
          </p>
        </div>
      </div>
    </section>

    <section
      v-if="project.gallery.length"
      class="reveal-item mt-16 border-t border-line pt-10"
    >
      <ProjectGalleryImage
        :image="project.gallery[0]!"
        sizes="(min-width: 1200px) 1152px, calc(100vw - 48px)"
        :top-aligned="topAligned"
        @open="openLightbox"
      />

      <div
        v-if="project.gallery.length > 1"
        class="mt-8 grid gap-8 md:grid-cols-2"
      >
        <ProjectGalleryImage
          v-for="image in project.gallery.slice(1)"
          :key="image.src"
          :image="image"
          sizes="(min-width: 1200px) 560px, (min-width: 768px) calc(50vw - 40px), calc(100vw - 48px)"
          :top-aligned="topAligned"
          @open="openLightbox"
        />
      </div>
    </section>

    <section
      v-if="project.library?.length"
      class="reveal-item mt-16 border-t border-line pt-10"
    >
      <h2 class="text-xl font-medium text-ink md:text-2xl">
        {{ project.librarySectionTitle }}
      </h2>
      <div class="mt-8 grid gap-8 md:grid-cols-2">
        <figure
          v-for="image in project.library"
          :key="image.src"
        >
          <button
            type="button"
            :aria-label="t('project.enlargeAria', { caption: image.caption })"
            class="group relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-lg"
            @click="openLightbox(image.src)"
          >
            <img
              :src="image.src"
              :srcset="imageSrcset(image.src)"
              sizes="(min-width: 768px) 336px, calc(100vw - 96px)"
              :alt="image.alt"
              width="1440"
              height="900"
              loading="lazy"
              class="max-h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-90"
            >
            <span class="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
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
      </div>
    </section>

    <footer class="reveal-item mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-10">
      <a
        v-if="project.liveUrl"
        :href="project.liveUrl"
        target="_blank"
        rel="noreferrer noopener"
        class="inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
      >
        {{ t('project.visitLive') }}
        <AppIcon
          name="external-link-line"
          :size="16"
        />
      </a>
      <NuxtLink
        :to="localePath(backPath)"
        class="inline-flex items-center gap-1.5 rounded-xl border border-line px-6 py-3 text-sm text-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
      >
        <AppIcon
          name="arrow-left-line"
          :size="16"
        />
        {{ backLabel }}
      </NuxtLink>
    </footer>

    <ImageLightbox
      v-if="allImages.length"
      ref="lightbox"
      :images="allImages"
    />
  </article>
</template>
