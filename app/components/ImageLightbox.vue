<script setup lang="ts">
import type { CaseStudyGalleryImage } from '~/composables/useCaseStudies'

const props = defineProps<{ images: CaseStudyGalleryImage[] }>()

const { t } = useI18n()
const dialog = ref<HTMLDialogElement | null>(null)
const index = ref(0)
const isOpen = ref(false)
const current = computed(() => props.images[index.value])
const hasMany = computed(() => props.images.length > 1)

function open(src: string) {
  const found = props.images.findIndex(image => image.src === src)
  if (found === -1) return
  index.value = found
  isOpen.value = true
  dialog.value?.showModal()
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
}

function close() {
  dialog.value?.close()
}

function onClosed() {
  isOpen.value = false
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
}

function step(delta: number) {
  const count = props.images.length
  index.value = (index.value + delta + count) % count
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') step(1)
  if (event.key === 'ArrowLeft') step(-1)
}

let touchStartX: number | null = null

function onTouchStart(event: TouchEvent) {
  touchStartX = event.touches.length === 1 ? event.touches[0]!.clientX : null
}

function onTouchEnd(event: TouchEvent) {
  if (touchStartX === null || !hasMany.value) return
  const distance = event.changedTouches[0]!.clientX - touchStartX
  touchStartX = null
  if (Math.abs(distance) >= 50) step(distance < 0 ? 1 : -1)
}

onBeforeUnmount(onClosed)

defineExpose({ open })
</script>

<template>
  <dialog
    ref="dialog"
    :aria-label="current?.caption"
    class="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-bg p-6 text-ink"
    @click.self="close"
    @close="onClosed"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div
      v-if="isOpen && current"
      class="flex h-full flex-col items-center justify-center"
      @click.self="close"
    >
      <button
        type="button"
        :aria-label="t('project.closeAria')"
        class="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-ink md:right-6 md:top-6"
        @click="close"
      >
        <AppIcon
          name="close-line"
          :size="28"
        />
      </button>

      <figure class="flex max-h-full min-h-0 max-w-5xl flex-col items-center">
        <img
          :src="current.src"
          :alt="current.alt"
          class="max-h-[72dvh] min-h-0 w-auto rounded-xl object-contain shadow-2xl"
        >
        <figcaption class="mt-4 text-center text-sm text-muted">
          {{ current.caption }}
          <span
            v-if="hasMany"
            class="whitespace-nowrap"
          >— {{ index + 1 }} / {{ images.length }}</span>
        </figcaption>
      </figure>

      <div
        v-if="hasMany"
        class="mt-4 flex gap-2 md:contents"
      >
        <button
          type="button"
          :aria-label="t('project.prevAria')"
          class="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-ink md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2"
          @click="step(-1)"
        >
          <AppIcon
            name="arrow-left-s-line"
            :size="32"
          />
        </button>
        <button
          type="button"
          :aria-label="t('project.nextAria')"
          class="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-ink md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2"
          @click="step(1)"
        >
          <AppIcon
            name="arrow-right-s-line"
            :size="32"
          />
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.lightbox[open] {
  display: block;
  animation: lightbox-in 200ms ease-out;
}

.lightbox::backdrop {
  background: transparent;
}

@keyframes lightbox-in {
  from {
    opacity: 0;
  }
}
</style>
