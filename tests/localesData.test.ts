import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { caseStudies } from '../app/data/case-studies'
import { personalProjects } from '../app/data/personal-projects'

const codes = ['en', 'uk', 'pl'] as const
const locales = Object.fromEntries(codes.map(code => [code, JSON.parse(readFileSync(join(__dirname, `../i18n/locales/${code}.json`), 'utf-8'))]))

function keys(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return [`${prefix}[${value.length}]`, ...value.flatMap((item, i) => keys(item, `${prefix}[${i}]`))]
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, child]) => keys(child, prefix ? `${prefix}.${key}` : key))
  return [prefix]
}

describe('locale files', () => {
  it('have the same keys and list lengths in every language', () => {
    const english = keys(locales.en).sort()
    for (const code of codes) expect(keys(locales[code]).sort(), code).toEqual(english)
  })

  it('keep meta descriptions within search-snippet length', () => {
    for (const code of codes) {
      for (const project of [...Object.values(locales[code].caseStudies), ...Object.values(locales[code].personalProjects)] as { metaDescription: string }[]) {
        expect(project.metaDescription.length, `${code}: ${project.metaDescription}`).toBeLessThanOrEqual(165)
      }
    }
  })

  it('have copy for every outcome and gallery image', () => {
    for (const code of codes) {
      for (const study of caseStudies) {
        const copy = locales[code].caseStudies[study.slug]
        expect(copy.outcome, `${code} ${study.slug}`).toHaveLength(study.outcome.length)
        expect(copy.gallery, `${code} ${study.slug}`).toHaveLength(study.gallery.length)
      }
      for (const project of personalProjects) {
        const copy = locales[code].personalProjects[project.slug]
        expect(copy.outcome, `${code} ${project.slug}`).toHaveLength(copy.outcomeValues.length)
        expect(copy.gallery, `${code} ${project.slug}`).toHaveLength(project.gallery.length)
      }
    }
  })
})
