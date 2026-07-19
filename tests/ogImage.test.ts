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

const en = JSON.parse(readFileSync(join(__dirname, '../i18n/locales/en.json'), 'utf-8'))

const fallbackFont = readFileSync(
  join(__dirname, '../node_modules/nuxt-og-image/dist/runtime/public/_og-fonts/inter-400-latin.ttf'),
)

const WIDTH = 1200
const HEIGHT = 600

async function renderOgImageSvg(props: { title: string, subtitle?: string, tag?: string }) {
  const app = createSSRApp(DefaultSatori, props)
  const html = await renderToString(app)

  const wrapperStyle = `position: relative; display: flex; margin: 0 auto; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden;`
  const vnodeTree = toSatoriNodes(`<div style="${wrapperStyle}">${html}</div>`)

  return satori(vnodeTree as any, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [{ name: 'Geist', data: fallbackFont, weight: 400, style: 'normal' }],
  })
}

describe('OG image generation (Satori)', () => {
  it('renders a real case study without throwing', async () => {
    const slug = caseStudies[0]!.slug
    const copy = en.caseStudies[slug]

    const svg = await renderOgImageSvg({ title: copy.name, subtitle: copy.role, tag: copy.tag })

    expect(svg).toContain('<svg')
  })

  it('renders a real personal project without throwing', async () => {
    const slug = personalProjects[0]!.slug
    const copy = en.personalProjects[slug]

    const svg = await renderOgImageSvg({ title: copy.name, subtitle: copy.role, tag: copy.tag })

    expect(svg).toContain('<svg')
  })
})
