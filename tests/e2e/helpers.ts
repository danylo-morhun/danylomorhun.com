import type { Page } from '@playwright/test'

/** Navigates and waits until Vue has hydrated, so clicks reach real handlers. */
export async function gotoHydrated(page: Page, path: string) {
  await page.goto(path)
  await page.waitForFunction(() => {
    const app = (document.querySelector('#__nuxt') as { __vue_app__?: { $nuxt?: { isHydrating?: boolean } } } | null)?.__vue_app__
    return app?.$nuxt?.isHydrating === false
  })
}
