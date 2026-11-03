import { gsap } from 'gsap'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

interface RevealOptions {
  y?: number
  duration?: number
  start?: string
  /** Reveal all items together from one trigger, offset by this many seconds. */
  stagger?: number
}

/** Fades `.reveal-item` children in on scroll. Off under reduced motion, reverted on unmount. */
export function useReveal(root: Ref<HTMLElement | null>, options: RevealOptions = {}) {
  const { y = 24, duration = 0.7, start = 'top 85%', stagger } = options
  let context: gsap.Context | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let unmounted = false

  onMounted(() => {
    if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    timer = setTimeout(async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const element = root.value
      if (unmounted || !element) return

      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
        const base = { opacity: 0, y, duration, ease: 'power3.out' }
        const items = gsap.utils.toArray<HTMLElement>('.reveal-item', element)

        if (stagger !== undefined) {
          gsap.from(items, { ...base, stagger, scrollTrigger: { trigger: element, start, once: true } })
          return
        }

        for (const item of items) {
          gsap.from(item, { ...base, scrollTrigger: { trigger: item, start, once: true } })
        }
      }, element)
    }, 100)
  })

  onBeforeUnmount(() => {
    unmounted = true
    clearTimeout(timer)
    context?.revert()
  })
}
