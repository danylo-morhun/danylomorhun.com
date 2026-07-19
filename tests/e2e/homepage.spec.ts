import { expect, test } from '@playwright/test'

const locales = [
  { code: 'en', path: '/' },
  { code: 'uk', path: '/uk' },
  { code: 'pl', path: '/pl' },
]

for (const { code, path } of locales) {
  test(`homepage renders without console errors (${code})`, async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error')
        consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    const response = await page.goto(path, { waitUntil: 'networkidle' })
    expect(response?.ok()).toBe(true)

    await expect(page.locator('#hero')).toBeVisible()
    expect(consoleErrors).toEqual([])
  })
}

test('nav link scrolls to the work section', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.locator('a[href="#work"]').first().click()
  await expect(page).toHaveURL(/#work$/)
  await expect(page.locator('#work')).toBeInViewport()
})
