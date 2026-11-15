import { gsap } from 'gsap'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { SPRINGS, spring as createSpring, type SpringName } from '#shared/utils/spring'

interface RevealOptions {
  y?: number
  /** Which spring from SPRINGS drives the rise; GSAP runs it over its settle time. */
  spring?: SpringName
  start?: string
  /** Reveal all items together from one trigger, offset by this many seconds. */
  stagger?: number
}

/**
 * Fades `.reveal-item` children in on scroll with a spring. Off under reduced motion,
 * reverted on unmount.
 *
 * Nothing that has already been painted is hidden again: on the first (server-rendered)
 * load, items already on screen stay put and only those below the fold reveal. After a
 * client-side navigation the items are hidden synchronously in `mounted`, before the
 * browser paints the new page, so they never flash in and out.
 */
export function useReveal(root: Ref<HTMLElement | null>, options: RevealOptions = {}) {
  const { y = 24, spring = 'smooth', start = 'top 85%', stagger } = options
  const { ease, settle } = createSpring(SPRINGS[spring])
  const nuxtApp = useNuxtApp()
  let context: gsap.Context | undefined
  let unmounted = false

  onMounted(async () => {
    const element = root.value
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const all = gsap.utils.toArray<HTMLElement>('.reveal-item', element)
    const fold = window.innerHeight
    const items = nuxtApp.isHydrating ? all.filter(item => item.getBoundingClientRect().top >= fold) : all
    if (!items.length) return

    context = gsap.context(() => gsap.set(items, { opacity: 0, y }), element)

    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    if (unmounted) return
    gsap.registerPlugin(ScrollTrigger)

    context.add(() => {
      const to = { opacity: 1, y: 0, duration: settle, ease }
      if (stagger !== undefined) {
        gsap.to(items, { ...to, stagger, scrollTrigger: { trigger: element, start, once: true } })
        return
      }
      for (const item of items) {
        gsap.to(item, { ...to, scrollTrigger: { trigger: item, start, once: true } })
      }
    })
  })

  onBeforeUnmount(() => {
    unmounted = true
    context?.revert()
  })
}
