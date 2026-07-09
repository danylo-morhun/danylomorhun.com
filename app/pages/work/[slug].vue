<script setup lang="ts">
import { RiArrowLeftLine, RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine, RiExternalLinkLine, RiLockLine, RiZoomInLine } from '@remixicon/vue'
import { gsap } from 'gsap'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useCaseStudy } from '~/composables/useCaseStudies'

const { t } = useI18n()
const route = useRoute()

const studyRef = useCaseStudy(route.params.slug as string)

if (!studyRef.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found' })
}

const study = computed(() => studyRef.value!)

useSeoMeta({
  title: () => `${study.value.name} — Danylo Morhun`,
  description: () => study.value.overview,
})

const section = ref<HTMLElement | null>(null)

const allImages = computed(() => [...study.value.gallery, ...(study.value.library ?? [])])
const lightboxIndex = ref<number | null>(null)
const lightbox = computed(() => (lightboxIndex.value === null ? null : allImages.value[lightboxIndex.value]))

function openLightbox(src: string) {
  const index = allImages.value.findIndex(image => image.src === src)
  if (index !== -1) lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = null
}

function nextImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value + 1) % allImages.value.length
}

function prevImage() {
  if (lightboxIndex.value === null) return
  lightboxIndex.value = (lightboxIndex.value - 1 + allImages.value.length) % allImages.value.length
}

function onKeydown(e: KeyboardEvent) {
  if (lightboxIndex.value === null) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

onMounted(async () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || !section.value) return

  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  const items = section.value.querySelectorAll('.reveal-item')
  items.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })
  })
})
</script>

<template>
  <article v-if="study" ref="section" class="mx-auto max-w-content px-6 py-24 md:py-32">
    <NuxtLink
      to="/#work"
      class="reveal-item inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-ink"
    >
      <RiArrowLeftLine size="16px" />
      {{ t('project.backToWork') }}
    </NuxtLink>

    <header class="reveal-item mt-8">
      <p class="font-mono text-xs text-accent">{{ study.tag }}</p>
      <h1 class="mt-2 text-3xl font-medium tracking-tightest text-ink md:text-5xl">{{ study.name }}</h1>
      <p class="mt-4 text-sm text-muted">
        {{ study.role }}<template v-if="study.dates"> · {{ study.dates }}</template>
      </p>
      <span
        v-if="study.nda"
        class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted"
      >
        <RiLockLine size="13px" />
        {{ t('project.ndaBadge') }}
      </span>
    </header>

    <p class="reveal-item mt-10 max-w-[70ch] text-lg leading-relaxed text-muted">
      {{ study.overview }}
    </p>

    <section class="reveal-item mt-16 border-t border-line pt-10">
      <h2 class="text-xl font-medium text-ink md:text-2xl">{{ t('project.theChallenge') }}</h2>
      <p class="mt-4 max-w-[70ch] text-base leading-relaxed text-muted">{{ study.challenge }}</p>
    </section>

    <section class="reveal-item mt-16 border-t border-line pt-10">
      <h2 class="text-xl font-medium text-ink md:text-2xl">{{ t('project.theApproach') }}</h2>
      <ul class="mt-6 space-y-4">
        <li
          v-for="point in study.approach"
          :key="point"
          class="relative max-w-[70ch] pl-5 text-base leading-relaxed text-muted"
        >
          <span class="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="reveal-item mt-16 border-t border-line pt-10">
      <h2 class="text-xl font-medium text-ink md:text-2xl">{{ t('project.theOutcome') }}</h2>
      <div class="mt-8 flex flex-wrap gap-x-12 gap-y-8">
        <div v-for="metric in study.outcome" :key="metric.label">
          <p class="text-4xl font-semibold tracking-tightest text-ink md:text-5xl">{{ metric.value }}</p>
          <p class="mt-2 max-w-[26ch] text-sm text-muted">{{ metric.label }}</p>
        </div>
      </div>
    </section>

    <section v-if="study.gallery.length" class="reveal-item mt-16 border-t border-line pt-10">
      <figure v-if="study.gallery[0]">
        <button
          type="button"
          :aria-label="t('project.enlargeAria', { caption: study.gallery[0].caption })"
          class="group relative block w-full"
          @click="openLightbox(study.gallery[0].src)"
        >
          <img
            :src="study.gallery[0].src"
            :alt="study.gallery[0].alt"
            width="1440"
            height="900"
            loading="lazy"
            class="aspect-[8/5] w-full rounded-xl border border-line object-cover shadow-lg transition-opacity duration-200 group-hover:opacity-90"
          >
          <span class="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            <RiZoomInLine size="18px" />
          </span>
        </button>
        <figcaption class="mt-3 text-sm text-muted">{{ study.gallery[0].caption }}</figcaption>
      </figure>

      <div v-if="study.gallery.length > 1" class="mt-8 grid gap-8 md:grid-cols-2">
        <figure v-for="image in study.gallery.slice(1)" :key="image.src">
          <button
            type="button"
            :aria-label="t('project.enlargeAria', { caption: image.caption })"
            class="group relative block w-full"
            @click="openLightbox(image.src)"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              width="1440"
              height="900"
              loading="lazy"
              class="aspect-[8/5] w-full rounded-xl border border-line object-cover shadow-lg transition-opacity duration-200 group-hover:opacity-90"
            >
            <span class="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              <RiZoomInLine size="18px" />
            </span>
          </button>
          <figcaption class="mt-3 text-sm text-muted">{{ image.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <section v-if="study.library?.length" class="reveal-item mt-16 border-t border-line pt-10">
      <h2 class="text-xl font-medium text-ink md:text-2xl">{{ study.librarySectionTitle }}</h2>
      <div class="mt-8 grid gap-8 md:grid-cols-2">
        <figure v-for="image in study.library" :key="image.src">
          <button
            type="button"
            :aria-label="t('project.enlargeAria', { caption: image.caption })"
            class="group relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-lg"
            @click="openLightbox(image.src)"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              loading="lazy"
              class="max-h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-90"
            >
            <span class="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-bg/90 text-ink opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              <RiZoomInLine size="18px" />
            </span>
          </button>
          <figcaption class="mt-3 text-sm text-muted">{{ image.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <footer class="reveal-item mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-10">
      <a
        v-if="study.liveUrl"
        :href="study.liveUrl"
        target="_blank"
        rel="noreferrer noopener"
        class="inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
      >
        {{ t('project.visitLive') }}
        <RiExternalLinkLine size="16px" />
      </a>
      <NuxtLink
        to="/#work"
        class="inline-flex items-center gap-1.5 rounded-xl border border-line bg-ink/10 px-6 py-3 text-sm text-ink transition-transform duration-200 hover:scale-[1.03] hover:bg-ink/15 active:scale-[0.97]"
      >
        <RiArrowLeftLine size="16px" />
        {{ t('project.backToWork') }}
      </NuxtLink>
    </footer>
  </article>

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightbox"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 p-6 backdrop-blur-xl"
        @click.self="closeLightbox"
      >
        <button
          type="button"
          :aria-label="t('project.closeAria')"
          class="absolute right-6 top-6 text-muted transition-colors duration-200 hover:text-ink"
          @click="closeLightbox"
        >
          <RiCloseLine size="28px" />
        </button>

        <button
          v-if="allImages.length > 1"
          type="button"
          :aria-label="t('project.prevAria')"
          class="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full p-2 text-muted transition-colors duration-200 hover:text-ink sm:block md:left-6"
          @click.stop="prevImage"
        >
          <RiArrowLeftSLine size="32px" />
        </button>
        <button
          v-if="allImages.length > 1"
          type="button"
          :aria-label="t('project.nextAria')"
          class="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full p-2 text-muted transition-colors duration-200 hover:text-ink sm:block md:right-6"
          @click.stop="nextImage"
        >
          <RiArrowRightSLine size="32px" />
        </button>

        <figure class="max-h-full max-w-5xl">
          <img
            :src="lightbox.src"
            :alt="lightbox.alt"
            class="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl"
          >
          <figcaption class="mt-4 text-center text-sm text-muted">
            {{ lightbox.caption }}
            <span v-if="allImages.length > 1" class="text-muted/70">— {{ lightboxIndex! + 1 }} / {{ allImages.length }}</span>
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>
