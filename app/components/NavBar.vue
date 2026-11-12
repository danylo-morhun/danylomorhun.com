<script setup lang="ts">
import { blog } from '#shared/blog'
import { site } from '~/data/site'

const { t } = useI18n()
const route = useRoute()
const { anchorHref, onAnchorClick } = useAnchorNav()

const links = computed(() => [
  { hash: '#work', label: t('nav.work') },
  { hash: '#lab', label: t('nav.lab') },
  { hash: '#experience', label: t('nav.experience') },
  { hash: '#about', label: t('nav.about') },
])

const header = ref<HTMLElement | null>(null)
const menuButton = ref<HTMLButtonElement | null>(null)
const menuOpen = ref(false)

function closeMenu(returnFocus = false) {
  menuOpen.value = false
  if (returnFocus) menuButton.value?.focus()
}

function onMenuLink(event: MouseEvent, hash: string) {
  closeMenu()
  void onAnchorClick(event, hash)
}

function onClickOutside(event: MouseEvent) {
  if (menuOpen.value && !header.value?.contains(event.target as Node)) closeMenu()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && menuOpen.value) closeMenu(true)
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (menuOpen.value && next && !header.value?.contains(next)) closeMenu()
}

watch(() => route.fullPath, () => closeMenu())

onMounted(() => {
  window.addEventListener('mousedown', onClickOutside)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', onClickOutside)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header
    ref="header"
    class="fixed inset-x-0 top-3 z-40 px-2 sm:px-4"
    @focusout="onFocusOut"
  >
    <nav
      class="mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-xl border bg-bg/70 px-3 py-1.5 backdrop-blur-md sm:gap-4 sm:px-4 sm:py-3"
    >
      <a
        :href="anchorHref('#top')"
        class="-my-2.5 min-w-0 truncate py-2.5 font-sans text-base font-bold tracking-tight text-ink sm:shrink-0 sm:text-lg"
        :aria-label="`${site.name} - ${t('nav.home')}`"
        @click="onAnchorClick($event, '#top')"
      >
        {{ site.name }}
      </a>

      <div class="hidden min-w-0 items-center gap-6 lg:flex">
        <a
          v-for="link in links"
          :key="link.hash"
          :href="anchorHref(link.hash)"
          class="whitespace-nowrap text-sm text-muted transition-colors duration-200 hover:text-ink"
          @click="onAnchorClick($event, link.hash)"
        >{{ link.label }}</a>
        <NuxtLink
          :to="blog.path"
          class="whitespace-nowrap text-sm text-muted transition-colors duration-200 hover:text-ink"
        >{{ t('nav.blog') }}</NuxtLink>
      </div>

      <div class="flex shrink-0 items-center gap-1 sm:gap-4">
        <div class="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        <a
          :href="anchorHref('#contact')"
          class="hidden whitespace-nowrap rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-accent-ink transition-opacity duration-200 hover:opacity-85 sm:block"
          @click="onAnchorClick($event, '#contact')"
        >{{ t('nav.contact') }}</a>

        <button
          ref="menuButton"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="t('nav.menu')"
          class="flex size-11 shrink-0 items-center justify-center rounded-lg text-ink sm:size-8 lg:hidden"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon
            v-if="menuOpen"
            name="close-line"
            :size="20"
          />
          <AppIcon
            v-else
            name="menu-line"
            :size="20"
          />
        </button>
      </div>
    </nav>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="menuOpen"
        id="mobile-menu"
        class="mx-auto mt-2 max-w-3xl rounded-xl border border-line bg-surface p-2 shadow-lg lg:hidden"
      >
        <a
          v-for="link in links"
          :key="link.hash"
          :href="anchorHref(link.hash)"
          class="flex min-h-11 items-center rounded-lg px-3 text-sm text-ink transition-colors duration-150"
          @click="onMenuLink($event, link.hash)"
        >{{ link.label }}</a>
        <NuxtLink
          :to="blog.path"
          class="flex min-h-11 items-center rounded-lg px-3 text-sm text-ink transition-colors duration-150"
          @click="closeMenu()"
        >{{ t('nav.blog') }}</NuxtLink>
        <a
          :href="anchorHref('#contact')"
          class="mt-1 flex min-h-11 items-center justify-center rounded-lg bg-accent px-3 text-sm font-medium text-accent-ink sm:hidden"
          @click="onMenuLink($event, '#contact')"
        >{{ t('nav.contact') }}</a>
      </div>
    </Transition>
  </header>
</template>
