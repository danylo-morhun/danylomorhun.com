/** Links to home-page sections: real hrefs for every page, native-feeling scroll on home. */
export function useAnchorNav() {
  const localePath = useLocalePath()
  const route = useRoute()
  const router = useRouter()
  const routeBaseName = useRouteBaseName()

  const isHome = computed(() => routeBaseName(route) === 'index')

  function anchorHref(hash: string) {
    return localePath(`/${hash}`)
  }

  async function onAnchorClick(event: MouseEvent, hash: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()

    if (isHome.value) {
      document.querySelector(hash)?.scrollIntoView()
      await router.push({ hash })
      return
    }

    await navigateTo(anchorHref(hash))
  }

  return { anchorHref, onAnchorClick }
}
