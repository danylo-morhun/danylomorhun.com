import { onBeforeUnmount, ref } from 'vue'
import { site } from '~/data/site'

export function useCopyEmail() {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, 1500)
    }
    catch {
      // Clipboard unavailable: the visible address and mailto link still work.
    }
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { copied, copyEmail }
}
