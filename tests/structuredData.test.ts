import { describe, expect, it } from 'vitest'
import { absoluteUrl, profilePageGraph, projectPageGraph } from '../app/utils/structuredData'

const site = {
  url: 'https://example.com',
  name: 'Jane Doe',
  jobTitle: 'Engineer',
  email: 'jane@example.com',
  sameAs: ['https://github.com/jane'],
}

const page = {
  url: 'https://example.com/uk/work/pay',
  language: 'uk-UA',
  title: 'Pay — Jane Doe',
  description: 'A payment app.',
}

type Node = Record<string, unknown> & { '@type': string, '@id'?: string }
const nodes = (graph: object) => (graph as { '@graph': Node[] })['@graph']
const byType = (graph: object, type: string) => nodes(graph).find(node => node['@type'] === type)!

describe('absoluteUrl', () => {
  it('drops the trailing slash on the root, like the canonical link', () => {
    expect(absoluteUrl('https://example.com/', '/')).toBe('https://example.com')
    expect(absoluteUrl('https://example.com', '/uk')).toBe('https://example.com/uk')
  })
})

describe('profilePageGraph', () => {
  const graph = profilePageGraph(site, { ...page, url: 'https://example.com' })

  it('makes the person the main entity of the page', () => {
    const person = byType(graph, 'Person')
    expect(byType(graph, 'ProfilePage').mainEntity).toEqual({ '@id': person['@id'] })
    expect(person).toMatchObject({ name: 'Jane Doe', jobTitle: 'Engineer', email: 'mailto:jane@example.com', sameAs: site.sameAs })
  })

  it('ties the page to the site in the page language', () => {
    const website = byType(graph, 'WebSite')
    expect(byType(graph, 'ProfilePage')).toMatchObject({ isPartOf: { '@id': website['@id'] }, inLanguage: 'uk-UA' })
  })
})

describe('projectPageGraph', () => {
  const graph = projectPageGraph(site, page, {
    name: 'Pay',
    description: 'A payment app.',
    image: 'https://example.com/pay.webp',
    home: { name: 'Головна', url: 'https://example.com/uk' },
  })

  it('credits the person as the creator of the work', () => {
    const person = byType(graph, 'Person')
    expect(byType(graph, 'CreativeWork')).toMatchObject({ name: 'Pay', image: 'https://example.com/pay.webp', creator: { '@id': person['@id'] } })
  })

  it('has a breadcrumb from the localized home page to the project', () => {
    const items = byType(graph, 'BreadcrumbList').itemListElement as Array<Record<string, unknown>>
    expect(items).toEqual([
      { '@type': 'ListItem', 'position': 1, 'name': 'Головна', 'item': 'https://example.com/uk' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Pay', 'item': page.url },
    ])
  })

  it('references only nodes that exist in the graph', () => {
    const ids = new Set(nodes(graph).map(node => node['@id']))
    const refs = JSON.stringify(graph).match(/\{"@id":"[^"]+"\}/g)!.map(ref => JSON.parse(ref)['@id'])
    expect(refs.every(ref => ids.has(ref))).toBe(true)
  })

  it('leaves out the image when the project has none', () => {
    const noImage = projectPageGraph(site, page, { name: 'Pay', description: '', home: { name: 'Home', url: site.url } })
    expect(byType(noImage, 'CreativeWork')).not.toHaveProperty('image')
  })
})
