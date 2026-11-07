import { describe, expect, it } from 'vitest'
import { buildRss } from '../shared/utils/rss'

const channel = {
  title: 'Blog — Jane',
  description: 'Notes & bugs',
  link: 'https://example.com/blog',
  feedUrl: 'https://example.com/blog/rss.xml',
  language: 'en-US',
}

describe('buildRss', () => {
  const xml = buildRss(channel, [
    { title: 'Why <canvas> went blank', description: 'A & B', link: 'https://example.com/blog/a', date: '2026-11-07', categories: ['webgl'] },
  ])

  it('escapes text so the feed stays valid XML', () => {
    expect(xml).toContain('<title>Why &lt;canvas&gt; went blank</title>')
    expect(xml).toContain('<description>Notes &amp; bugs</description>')
  })

  it('uses RFC 822 dates and a permalink guid', () => {
    expect(xml).toContain('<pubDate>Sat, 07 Nov 2026 00:00:00 GMT</pubDate>')
    expect(xml).toContain('<guid isPermaLink="true">https://example.com/blog/a</guid>')
    expect(xml).toContain('<lastBuildDate>Sat, 07 Nov 2026 00:00:00 GMT</lastBuildDate>')
  })

  it('links to itself so readers can find the feed URL', () => {
    expect(xml).toContain('<atom:link href="https://example.com/blog/rss.xml" rel="self" type="application/rss+xml"/>')
  })
})
