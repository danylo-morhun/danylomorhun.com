// Renders one frame of the hero beams (no text) as the share-image background.
// Usage: build + start the site on :3000, then `node scripts/capture-og-beams.mjs`.
import { chromium } from 'playwright'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630
const OUT = 'public/og/beams.jpg'

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] })
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1, colorScheme: 'dark' })
await page.goto(process.env.SITE_URL ?? 'http://localhost:3000/')

const canvas = page.locator('#hero canvas')
await canvas.waitFor({ state: 'visible', timeout: 15_000 })
await page.waitForFunction(() => getComputedStyle(document.querySelector('#hero canvas')).opacity === '1')
// Let the beams drift into a settled frame.
await page.waitForTimeout(4_000)

// Keep only the canvas: hide the nav, the headline and everything else in the hero.
await page.addStyleTag({ content: 'header, .app-loader, #hero > :not(:has(canvas)) { visibility: hidden !important }' })
await page.evaluate(() => {
  const hero = document.querySelector('#hero')
  for (const el of hero.querySelectorAll('*')) {
    if (!el.querySelector('canvas') && el.tagName !== 'CANVAS') el.style.visibility = 'hidden'
  }
})

const png = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } })
// Social sites shrink share images to ~480px and re-encode them as JPEG.
// The shader's film grain turns into blocky noise there, so smooth it out first.
await sharp(png).blur(1.6).jpeg({ quality: 90, mozjpeg: true }).toFile(OUT)
await browser.close()
console.log(`wrote ${OUT}`)
