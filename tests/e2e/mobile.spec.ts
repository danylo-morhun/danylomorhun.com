import { expect, test } from '@playwright/test'
import { gotoHydrated } from './helpers'

for (const width of [320, 360, 390]) {
  for (const path of ['/', '/uk', '/pl', '/uk/work/enterprise-bi-dashboard']) {
    test(`${path} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 740 })
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBe(0)

      const nav = page.locator('nav')
      const box = await nav.boundingBox()
      expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    })
  }
}

test('the mobile menu reaches every section', async ({ page }) => {
  await gotoHydrated(page, '/work/grx-pay')
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.locator('#mobile-menu').getByRole('link', { name: 'Experience' }).click()
  await expect(page).toHaveURL(/\/#experience$/)
  await expect(page.locator('#experience')).toBeInViewport()
  await expect(page.locator('#mobile-menu')).toHaveCount(0)
})

test('the lightbox can be paged on a phone', async ({ page }) => {
  await gotoHydrated(page, '/work/grx-pay')
  await page.getByRole('button', { name: /^Enlarge: Dashboard/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: 'Next image' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Next image' }).click()
  await expect(dialog).toHaveAccessibleName(/Assets/)
})
