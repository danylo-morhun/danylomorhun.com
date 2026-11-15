import type { RouterConfig } from '@nuxt/schema'
import type { RouteLocationNormalized } from 'vue-router'
import { START_LOCATION } from 'vue-router'
import { nextTick } from 'vue'

/** `/uk/work/x` → `/work/x`: the same page in another language. */
function withoutLocale(path: string, locales: string[]) {
  const [, first, ...rest] = path.replace(/\/$/, '').split('/')
  return first && locales.includes(first) ? `/${rest.join('/')}` : path.replace(/\/$/, '') || '/'
}

function hashTop(hash: string) {
  const element = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!element) return 0
  return (Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0)
    + (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)
}

function position(to: RouteLocationNormalized, saved: { left: number, top: number } | null) {
  // `instant`, not `auto`: `html { scroll-behavior: smooth }` would otherwise animate
  // every page change as a long scroll up. Smooth stays for jumps within a page.
  if (saved) return { ...saved, behavior: 'instant' as const }
  if (to.hash) return { el: to.hash, top: hashTop(to.hash), behavior: 'instant' as const }
  return { left: 0, top: 0, behavior: 'instant' as const }
}

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()

    // Same page: only a hash change scrolls, and that one is smooth (CSS decides,
    // so reduced motion turns it off).
    if (to.path === from.path) {
      if (to.hash && to.hash !== from.hash) return { el: to.hash, top: hashTop(to.hash) }
      if (from.hash && !to.hash) return savedPosition ?? { left: 0, top: 0 }
      return false
    }

    // Switching language keeps the reader where they are.
    const locales = nuxtApp.$i18n.localeCodes.value
    if (!to.hash && from !== START_LOCATION && withoutLocale(to.path, locales) === withoutLocale(from.path, locales)) {
      return false
    }

    if (from === START_LOCATION) return position(to, savedPosition)

    // Wait for the new page to render, so a saved position or hash has something to land on,
    // but scroll in the same task: deferring to the next frame lets the browser paint the new
    // page at the old offset first, and then it visibly jumps.
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce('page:loading:end', () => nextTick(() => resolve(position(to, savedPosition))))
    })
  },
}
