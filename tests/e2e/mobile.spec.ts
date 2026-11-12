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
  await page.getByRole('button', { name: /^Enlarge: Merchant dashboard/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: 'Next image' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Next image' }).click()
  await expect(dialog).toHaveAccessibleName(/Invoice/)
})

test('controls are easy to tap', async ({ page }) => {
  await gotoHydrated(page, '/pl/work/grx-pay')
  const targets = [
    page.getByRole('button', { name: 'Język' }),
    page.getByRole('button', { name: 'Przełącz motyw' }),
    page.getByRole('button', { name: 'Menu' }),
    page.locator('article').getByRole('link').first(),
    page.locator('footer').getByRole('button'),
    page.locator('footer').getByRole('link', { name: /GitHub/ }),
  ]
  for (const target of targets) {
    const box = (await target.boundingBox())!
    expect(Math.min(box.width, box.height), await target.evaluate(el => el.outerHTML.slice(0, 80))).toBeGreaterThanOrEqual(44)
  }
})

test('the company sits on its own line under the role', async ({ page }) => {
  await page.goto('/uk')
  const heading = page.locator('#experience h3').first()
  const [role, company] = await heading.locator(':scope > span').all()
  expect((await company!.boundingBox())!.y).toBeGreaterThan((await role!.boundingBox())!.y)
  await expect(company!.getByText('·')).toBeHidden()
})
