import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'
import satori from 'satori'
import { html as toSatoriNodes } from 'satori-html'
import DefaultSatori from '../app/components/OgImage/Default.satori.vue'
import { caseStudies } from '../app/data/case-studies'
import { personalProjects } from '../app/data/personal-projects'

const locale = (code: string) => JSON.parse(readFileSync(join(__dirname, `../i18n/locales/${code}.json`), 'utf-8'))
const font = (file: string) => readFileSync(join(__dirname, '../public/fonts/og', file))

// nuxt-og-image inlines public files at build; raw Satori needs the data itself.
const beams = `data:image/jpeg;base64,${readFileSync(join(__dirname, '../public/og/beams.jpg')).toString('base64')}`

const WIDTH = 1200
const HEIGHT = 600

const fonts = [
  { name: 'Geist OG', data: font('Geist-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
  { name: 'Geist OG', data: font('Geist-SemiBold.ttf'), weight: 600 as const, style: 'normal' as const },
  { name: 'Geist Mono OG', data: font('GeistMono-Regular.ttf'), weight: 400 as const, style: 'normal' as const },
]

// The real OG fonts as the only fonts, so a missing glyph fails loudly instead
// of rendering a "no glyph" box.
async function renderOgImageSvg(props: { title: string, subtitle?: string, tag?: string, tagline?: string }) {
  const html = (await renderToString(createSSRApp(DefaultSatori, props))).replace('src="/og/beams.jpg"', `src="${beams}"`)
  const wrapperStyle = `display: flex; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden;`
  let missing = ''

  const svg = await satori(toSatoriNodes(`<div style="${wrapperStyle}">${html}</div>`) as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
    loadAdditionalAsset: async (_code, segment) => {
      missing += segment
      return []
    },
  })

  return { svg, missing }
}

describe('OG image generation (Satori)', () => {
  for (const code of ['en', 'uk', 'pl']) {
    const copy = locale(code)

    it(`renders every case study and personal project in ${code} with real glyphs`, async () => {
      for (const { slug } of caseStudies) {
        const study = copy.caseStudies[slug]
        const { svg, missing } = await renderOgImageSvg({ title: study.name, subtitle: study.role, tag: study.tag, tagline: copy.og.tagline })
        expect(svg).toContain('<svg')
        expect(missing).toBe('')
      }

      for (const { slug } of personalProjects) {
        const project = copy.personalProjects[slug]
        const { missing } = await renderOgImageSvg({ title: project.name, subtitle: project.role, tag: project.tag, tagline: copy.og.tagline })
        expect(missing).toBe('')
      }
    })
  }

  it('keeps the tagline inside the canvas', async () => {
    const withTagline = await renderOgImageSvg({ title: 'Title', tagline: 'Tagline' })
    const without = await renderOgImageSvg({ title: 'Title', tagline: '' })
    expect(withTagline.svg.length).toBeGreaterThan(without.svg.length)
  })
})
