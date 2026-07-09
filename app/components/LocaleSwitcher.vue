<script setup lang="ts">
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/vue'

const COUNTRY_CODES: Record<string, string> = {
  en: 'gb',
  uk: 'ua',
  pl: 'pl',
}

function flagUrl(localeCode: string) {
  return `https://flagcdn.com/w80/${COUNTRY_CODES[localeCode]}.png`
}

const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => locales.value as Array<{ code: string, name?: string }>)
const currentFlagUrl = computed(() => flagUrl(locale.value))

const root = ref<HTMLElement | null>(null)
const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

async function select(code: string) {
  close()
  if (code === locale.value) return
  const path = switchLocalePath(code as typeof locale.value)
  if (path) await navigateTo(path)
}

function onClickOutside(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
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
  <div ref="root" class="relative">
    <button
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="t('nav.language')"
      class="flex h-8 items-center gap-1 rounded-lg px-1.5 text-muted transition-colors duration-200 hover:text-ink"
      @click="toggle"
    >
      <span class="block h-4 w-4 shrink-0 overflow-hidden rounded-full">
        <img :src="currentFlagUrl" alt="" class="h-full w-full object-cover">
      </span>
      <RiArrowDownSLine
        size="14px"
        class="transition-transform duration-200"
        :class="open && 'rotate-180'"
      />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        role="listbox"
        class="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lg"
      >
        <li v-for="l in availableLocales" :key="l.code">
          <button
            type="button"
            role="option"
            :aria-selected="l.code === locale"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors duration-150"
            :class="l.code === locale ? 'text-ink' : 'text-muted hover:bg-ink/[0.04] hover:text-ink'"
            @click="select(l.code)"
          >
            <span class="block h-4 w-4 shrink-0 overflow-hidden rounded-full">
              <img :src="flagUrl(l.code)" alt="" class="h-full w-full object-cover">
            </span>
            <span class="flex-1">{{ l.name }}</span>
            <RiCheckLine v-if="l.code === locale" size="14px" class="text-accent" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
