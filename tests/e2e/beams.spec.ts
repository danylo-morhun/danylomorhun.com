import { expect, test } from '@playwright/test'

// Software WebGL, so the hero background renders on CI machines without a GPU.
test.use({ launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } })

test('the hero background comes back after its WebGL context is lost for good', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Needs Chromium\'s software WebGL')

  await page.goto('/')
  const canvas = page.locator('#hero canvas')
  await expect(canvas).toHaveCSS('opacity', '1', { timeout: 10_000 })

  // WEBGL_lose_context without restoreContext() is the "browser never gives it back" case.
  await canvas.evaluate((element: HTMLCanvasElement) => {
    element.dataset.old = 'true'
    element.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext()
  })

  const fresh = page.locator('#hero canvas:not([data-old])')
  await expect(fresh).toHaveCount(1, { timeout: 5_000 })
  await expect(fresh).toHaveCSS('opacity', '1')
  expect(await fresh.evaluate((element: HTMLCanvasElement) => element.getContext('webgl2')!.isContextLost())).toBe(false)
  await expect(page.locator('#hero canvas')).toHaveCount(1)
})
