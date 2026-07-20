import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import { caseStudies } from '../app/data/case-studies'

describe('projects data consistency', () => {
  it('contains valid project references', () => {
    expect(projects.length).toBeGreaterThan(0)
    for (const p of projects) {
      expect(p.slug).toBeTruthy()
      expect(p.metricsCount).toBeGreaterThan(0)
    }
  })

  it('maps each project slug to an existing case study', () => {
    const csSlugs = new Set(caseStudies.map(cs => cs.slug))
    for (const p of projects) {
      expect(csSlugs.has(p.slug)).toBe(true)
    }
  })
})
