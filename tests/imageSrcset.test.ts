import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import variants from '../app/data/image-variants.json'
import { caseStudies } from '../app/data/case-studies'
import { personalProjects } from '../app/data/personal-projects'
import { imageSrcset } from '../app/utils/imageSrcset'

const publicFile = (src: string) => join(__dirname, '../public', src)

describe('imageSrcset', () => {
  it('lists smaller variants before the original', () => {
    expect(imageSrcset('/case-studies/grx-pay-assets.webp')).toBe(
      '/case-studies/grx-pay-assets-480w.webp 480w, /case-studies/grx-pay-assets-960w.webp 960w, /case-studies/grx-pay-assets-1440w.webp 1440w, /case-studies/grx-pay-assets.webp 2880w',
    )
  })

  it('returns undefined for unknown images', () => {
    expect(imageSrcset('/nope.webp')).toBeUndefined()
  })

  it('has a generated entry for every gallery image, and every variant exists on disk', () => {
    const images = [...caseStudies, ...personalProjects].flatMap(project => [...project.gallery, ...(project.library ?? [])])

    for (const { src } of images) {
      const entry = (variants as Record<string, { variants: number[] }>)[src]
      expect(entry, src).toBeDefined()
      expect(existsSync(publicFile(src)), src).toBe(true)

      for (const width of entry!.variants) {
        expect(existsSync(publicFile(src.replace(/\.webp$/, `-${width}w.webp`))), `${src} @${width}`).toBe(true)
      }
    }
  })
})
