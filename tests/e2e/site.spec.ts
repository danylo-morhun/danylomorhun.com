import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || /hydration/i.test(message.text())) errors.push(message.text())
  })
  page.on('pageerror', error => errors.push(error.message))
  return errors
}

async function waitForIntro(page: Page) {
  await expect(page.locator('.app-loader')).toHaveCount(0, { timeout: 3_000 })
}

for (const colorScheme of ['dark', 'light'] as const) {
  for (const path of ['/', '/uk', '/pl', '/work/grx-pay', '/uk/lab/seikatsu']) {
    test(`${path} renders without errors or hydration mismatches (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme })
      const errors = collectErrors(page)

      const response = await page.goto(path, { waitUntil: 'networkidle' })
      expect(response?.ok()).toBe(true)
      await expect(page.locator('h1')).toBeVisible()
      expect(errors).toEqual([])
    })
  }
}

test('the intro lifts within a second and only plays on the home page', async ({ page }) => {
  await page.goto('/')
  await waitForIntro(page)

  await page.goto('/work/grx-pay')
  await expect(page.locator('.app-loader')).toHaveCount(0)
})

test('content is readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.locator('.app-loader')).toBeHidden()
  await expect(page.locator('h1')).toBeVisible()
  await context.close()
})

test('reduced motion skips the intro entirely', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.app-loader')).toBeHidden()
  await expect(page.locator('h1')).toBeInViewport()
})

test('the theme toggle shows the icon for the theme it switches to', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/work/grx-pay')
  const toggle = page.getByRole('button', { name: 'Toggle color theme' })

  await expect(toggle.locator('.theme-icon-sun')).toHaveCSS('opacity', '1')
  await expect(toggle.locator('.theme-icon-moon')).toHaveCSS('opacity', '0')

  await toggle.click()
  await expect(page.locator('html')).toHaveClass(/light/)
  await expect(toggle.locator('.theme-icon-moon')).toHaveCSS('opacity', '1')
})

test('nav links on a case study lead to the home page sections', async ({ page }) => {
  await page.goto('/work/grx-pay')
  await page.locator('nav').getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()

  await page.goto('/uk/work/grx-pay')
  await page.locator('nav').getByRole('link', { name: 'Досвід' }).click()
  await expect(page).toHaveURL(/\/uk#experience$/)
  await expect(page.locator('#experience')).toBeInViewport()
})

test('nav link scrolls to the work section on the home page', async ({ page }) => {
  await page.goto('/')
  await waitForIntro(page)
  await page.locator('nav').getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/#work$/)
  await expect(page.locator('#work')).toBeInViewport()
})

test('the lightbox is a named, focus-trapping dialog that restores focus', async ({ page }) => {
  await page.goto('/work/grx-pay')
  const opener = page.getByRole('button', { name: /^Enlarge: Dashboard/ })
  await opener.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAccessibleName(/Dashboard/)

  // A modal <dialog> makes the page behind it inert: Tab cycles through the
  // dialog and the browser UI, never back into the page.
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => {
      const active = document.activeElement
      return !active || active === document.body || !!active.closest('dialog')
    })).toBe(true)
  }

  await page.keyboard.press('ArrowRight')
  await expect(dialog).toHaveAccessibleName(/Assets/)

  const scrollBefore = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 600)
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(opener).toBeFocused()
})

test('the language menu works from the keyboard and keeps the reader in place', async ({ page }) => {
  await page.goto('/work/grx-pay')
  const button = page.locator('nav button[aria-expanded]').first()
  await button.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('link', { name: 'English' })).toBeFocused()

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/uk\/work\/grx-pay$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk-UA')

  await button.click()
  await page.keyboard.press('Escape')
  await expect(page.locator('#__nuxt ul a[hreflang]')).toHaveCount(0)
  await expect(button).toBeFocused()
})

test('gallery images load a size that fits the slot', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  const page = await context.newPage()
  await page.goto('/lab/seikatsu')
  const image = page.locator('article figure img').first()
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/-960w\.webp$/)
  await context.close()
})

test('Ukrainian and Polish pages show localized dates', async ({ page }) => {
  await page.goto('/uk')
  await expect(page.locator('#experience')).toContainText('лют. 2026 — серп. 2026')
  await page.goto('/pl/work/grx-pay')
  await expect(page.locator('article header')).toContainText('lut 2026 – sie 2026')
})

test('unknown pages get the site 404 in the current language', async ({ page }) => {
  const response = await page.goto('/uk/nope')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Сторінку не знайдено')
  await expect(page.locator('nav')).toBeVisible()
  await expect(page).toHaveTitle(/Danylo Morhun/)
})

test('every page has share metadata', async ({ page }) => {
  for (const path of ['/', '/uk/work/grx-pay', '/pl/lab/seikatsu']) {
    await page.goto(path)
    for (const property of ['og:title', 'og:description', 'og:image']) {
      await expect(page.locator(`meta[property="${property}"]`)).toHaveAttribute('content', /.+/)
    }
  }
})

for (const colorScheme of ['dark', 'light'] as const) {
  test(`no axe violations with menus and dialogs open (${colorScheme})`, async ({ page }) => {
    // Reduced motion so axe sees settled colors, not elements mid-fade.
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('button', { name: 'Language' }).click()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])

    await page.goto('/work/grx-pay')
    await page.getByRole('button', { name: /^Enlarge: Dashboard/ }).click()
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])

    await page.goto('/nope')
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  })
}

test('security headers are set', async ({ request }) => {
  const response = await request.get('/')
  const headers = response.headers()
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['content-security-policy']).toContain('frame-ancestors \'none\'')
  expect(headers['x-powered-by']).toBeUndefined()
})

test('the old resume url redirects permanently', async ({ request }) => {
  const response = await request.get('/resume.pdf', { maxRedirects: 0 })
  expect(response.status()).toBe(301)
  expect(response.headers().location).toBe('/Danylo_Morhun_Fullstack_Engineer_Resume.pdf')
})

test('non-canonical urls point at the canonical page', async ({ request }) => {
  const mixedCase = await request.get('/WORK/grx-pay', { maxRedirects: 0 })
  expect(mixedCase.status()).toBe(301)
  expect(mixedCase.headers().location).toBe('/work/grx-pay')

  // Prerendered files are served before middleware runs, so a trailing slash
  // still renders; its canonical link points search engines at the clean URL.
  const trailingSlash = await request.get('/uk/work/grx-pay/')
  expect(await trailingSlash.text()).toContain('<link rel="canonical" href="https://www.danylomorhun.com/uk/work/grx-pay">')
})
