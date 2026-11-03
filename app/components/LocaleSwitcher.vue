<script setup lang="ts">
const COUNTRY_CODES: Record<string, string> = {
  en: 'gb',
  uk: 'ua',
  pl: 'pl',
}

function flagUrl(localeCode: string) {
  return `/flags/${COUNTRY_CODES[localeCode]}.svg`
}

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => locales.value as Array<{ code: typeof locale.value, name?: string, language?: string }>)

const root = ref<HTMLElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
const list = ref<HTMLElement | null>(null)
const open = ref(false)

function close(returnFocus = false) {
  open.value = false
  if (returnFocus) button.value?.focus()
}

function onClickOutside(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !root.value?.contains(next)) close()
}

function focusLink(move: (index: number, count: number) => number) {
  const links = Array.from(list.value?.querySelectorAll('a') ?? [])
  if (!links.length) return
  const current = links.indexOf(document.activeElement as HTMLAnchorElement)
  links[move(current, links.length)]?.focus()
}

async function onButtonKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  open.value = true
  await nextTick()
  focusLink((_, count) => (event.key === 'ArrowDown' ? 0 : count - 1))
}

function onListKeydown(event: KeyboardEvent) {
  const moves: Record<string, (index: number, count: number) => number> = {
    ArrowDown: (index, count) => (index + 1) % count,
    ArrowUp: (index, count) => (index - 1 + count) % count,
    Home: () => 0,
    End: (_, count) => count - 1,
  }
  const move = moves[event.key]
  if (!move) return
  event.preventDefault()
  focusLink(move)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) close(true)
}

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
  <div
    ref="root"
    class="relative"
    @focusout="onFocusOut"
  >
    <button
      ref="button"
      type="button"
      :aria-expanded="open"
      :aria-label="t('nav.language')"
      class="flex h-8 items-center gap-1 rounded-lg px-1.5 text-muted transition-colors duration-200 hover:text-ink"
      @click="open = !open"
      @keydown="onButtonKeydown"
    >
      <img
        :src="flagUrl(locale)"
        alt=""
        width="16"
        height="16"
        class="h-4 w-4 shrink-0 rounded-full"
      >
      <AppIcon
        name="arrow-down-s-line"
        :size="14"
        class="transition-transform duration-200"
        :class="open && 'rotate-180'"
      />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        ref="list"
        class="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lg"
        @keydown="onListKeydown"
      >
        <li
          v-for="l in availableLocales"
          :key="l.code"
        >
          <NuxtLink
            :to="switchLocalePath(l.code)"
            :hreflang="l.language"
            :lang="l.language"
            :aria-current="l.code === locale ? 'true' : undefined"
            class="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors duration-150"
            :class="l.code === locale ? 'text-ink' : 'text-muted hover:bg-ink/[0.04] hover:text-ink'"
            @click="close()"
          >
            <img
              :src="flagUrl(l.code)"
              alt=""
              width="16"
              height="16"
              class="h-4 w-4 shrink-0 rounded-full"
            >
            <span class="flex-1">{{ l.name }}</span>
            <AppIcon
              v-if="l.code === locale"
              name="check-line"
              :size="14"
              class="text-accent"
            />
          </NuxtLink>
        </li>
      </ul>
    </Transition>
  </div>
</template>
