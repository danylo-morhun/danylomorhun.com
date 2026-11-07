import { describe, expect, it } from 'vitest'
import { parsePost, publishedPosts, readingMinutes, renderMarkdown, slugify } from '../modules/blog/posts'

const highlight = (code: string, lang: string) => `<pre data-lang="${lang}">${code}</pre>`

const source = (frontmatter: string, body = 'Hello.') => `---\n${frontmatter}\n---\n${body}`

describe('parsePost', () => {
  it('reads the frontmatter and keeps the markdown body', () => {
    const post = parsePost('hello', source('title: Hello\ndescription: First post.\ndate: 2026-11-07\ntags: [webgl]', '# Body'))
    expect(post.meta).toEqual({
      slug: 'hello',
      title: 'Hello',
      description: 'First post.',
      date: '2026-11-07',
      tags: ['webgl'],
      draft: false,
      readingMinutes: 1,
    })
    expect(post.body).toBe('# Body')
  })

  it('names the post and the field when something is wrong', () => {
    expect(() => parsePost('hello', 'no frontmatter')).toThrow('hello: missing frontmatter')
    expect(() => parsePost('hello', source('description: x\ndate: 2026-11-07'))).toThrow('hello: "title"')
    expect(() => parsePost('hello', source('title: x\ndescription: x\ndate: 7 Nov 2026'))).toThrow('YYYY-MM-DD')
    expect(() => parsePost('hello', source('title: x\ndescription: x\ndate: 2026-11-07\ntags: webgl'))).toThrow('"tags"')
  })
})

describe('publishedPosts', () => {
  const post = (slug: string, date: string, draft = false) => ({ meta: { slug, date, draft } as never })
  const slugs = (posts: Array<{ meta: unknown }>) => posts.map(p => (p.meta as { slug: string }).slug)
  const posts = [post('old', '2026-01-01'), post('today', '2026-11-07'), post('wip', '2026-10-01', true), post('next', '2026-11-16')]

  it('shows published posts up to today, newest first', () => {
    expect(slugs(publishedPosts(posts, { preview: false, today: '2026-11-07' }))).toEqual(['today', 'old'])
  })

  it('publishes a scheduled post on its date', () => {
    expect(slugs(publishedPosts(posts, { preview: false, today: '2026-11-16' }))).toEqual(['next', 'today', 'old'])
  })

  it('shows drafts and scheduled posts in preview', () => {
    expect(slugs(publishedPosts(posts, { preview: true, today: '2026-11-07' }))).toEqual(['next', 'today', 'wip', 'old'])
  })
})

describe('readingMinutes', () => {
  it('is at least one minute', () => {
    expect(readingMinutes('one word')).toBe(1)
    expect(readingMinutes('word '.repeat(1100))).toBe(5)
  })
})

describe('slugify', () => {
  it('keeps letters and digits, joins words with hyphens', () => {
    expect(slugify('Dispose properly, or make it <code>worse</code>!')).toBe('dispose-properly-or-make-it-worse')
  })
})

describe('renderMarkdown', () => {
  it('gives subheadings unique, linkable ids', () => {
    const html = renderMarkdown('## Fix\n\n## Fix', highlight)
    expect(html).toContain('<h2 id="fix"><a href="#fix">Fix</a></h2>')
    expect(html).toContain('<h2 id="fix-1">')
  })

  it('keeps the page to one h1', () => {
    expect(renderMarkdown('# Title', highlight)).toBe('<h2>Title</h2>\n')
  })

  it('highlights code by its language', () => {
    expect(renderMarkdown('```ts {1}\nlet a\n```', highlight)).toBe('<pre data-lang="ts">let a</pre>')
    expect(renderMarkdown('```\nplain\n```', highlight)).toBe('<pre data-lang="text">plain</pre>')
  })

  it('opens external links in a new tab, internal ones in place', () => {
    expect(renderMarkdown('[a](https://x.dev) [b](/work)', highlight))
      .toBe('<p><a href="https://x.dev" target="_blank" rel="noreferrer noopener">a</a> <a href="/work">b</a></p>\n')
  })

  it('lazy-loads images', () => {
    expect(renderMarkdown('![Beams](/beams.webp)', highlight)).toContain('<img src="/beams.webp" alt="Beams" loading="lazy" decoding="async">')
  })
})
