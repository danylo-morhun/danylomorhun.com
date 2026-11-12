import { describe, expect, it } from 'vitest'
import { caseStudies } from '../app/data/case-studies'
import { personalProjects } from '../app/data/personal-projects'

describe('projects data consistency', () => {
  const all = [...caseStudies, ...personalProjects]

  it('has unique slugs across work and lab', () => {
    const slugs = all.map(project => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('gives every project a stack, at least one metric and a gallery', () => {
    for (const project of all) {
      expect(project.stack, project.slug).toBeTruthy()
      expect(project.outcome.length, project.slug).toBeGreaterThan(0)
      expect(project.gallery.length, project.slug).toBeGreaterThan(0)
    }
  })

  it('links only over https', () => {
    for (const { slug, liveUrl } of all) {
      if (liveUrl) expect(liveUrl, slug).toMatch(/^https:\/\//)
    }
  })
})
