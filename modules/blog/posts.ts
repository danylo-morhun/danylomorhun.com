import { Marked } from 'marked'
import { parse as parseYaml } from 'yaml'

export interface PostMeta {
  slug: string
  title: string
  description: string
  /** YYYY-MM-DD */
  date: string
  /** YYYY-MM-DD, when the post was meaningfully revised. */
  updated?: string
  tags: string[]
  draft: boolean
  readingMinutes: number
}

export interface Post {
  meta: PostMeta
  /** Markdown without the frontmatter. */
  body: string
}

/** Turns code into highlighted HTML (a full `<pre>` block). */
export type Highlight = (code: string, lang: string) => string

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const WORDS_PER_MINUTE = 220

/** Reads a post file: YAML frontmatter, then markdown. Throws on a missing or malformed field. */
export function parsePost(slug: string, source: string): Post {
  const match = source.match(FRONTMATTER)
  if (!match) throw new Error(`${slug}: missing frontmatter`)

  const data = (parseYaml(match[1]!) ?? {}) as Record<string, unknown>
  const body = source.slice(match[0].length)
  const fail = (reason: string) => new Error(`${slug}: ${reason}`)

  const text = (key: string) => {
    const value = data[key]
    if (typeof value !== 'string' || !value.trim()) throw fail(`"${key}" must be a non-empty string`)
    return value.trim()
  }
  const date = (key: string) => {
    const value = text(key)
    if (!DATE.test(value)) throw fail(`"${key}" must be YYYY-MM-DD, got "${value}"`)
    return value
  }

  const tags = data.tags ?? []
  if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) throw fail('"tags" must be a list of strings')

  return {
    meta: {
      slug,
      title: text('title'),
      description: text('description'),
      date: date('date'),
      ...(data.updated !== undefined && { updated: date('updated') }),
      tags: tags as string[],
      draft: data.draft === true,
      readingMinutes: readingMinutes(body),
    },
    body,
  }
}

export function readingMinutes(markdown: string) {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/**
 * What's live: published posts dated today or earlier, newest first.
 * `preview` also shows drafts and scheduled (future-dated) posts, for review.
 */
export function publishedPosts<T extends { meta: PostMeta }>(posts: T[], { preview, today }: { preview: boolean, today: string }) {
  return posts
    .filter(post => preview || (!post.meta.draft && post.meta.date <= today))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date) || a.meta.slug.localeCompare(b.meta.slug))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/[\s-]+/g, '-')
}

/** Markdown to HTML: linkable headings, highlighted code, external links in a new tab, lazy images. */
export function renderMarkdown(markdown: string, highlight: Highlight) {
  const seen = new Map<string, number>()
  const uniqueId = (text: string) => {
    const base = slugify(text) || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count ? `${base}-${count}` : base
  }

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens)
        if (depth === 1) return `<h2>${inner}</h2>\n`
        const id = uniqueId(inner)
        return `<h${depth} id="${id}"><a href="#${id}">${inner}</a></h${depth}>\n`
      },
      code({ text, lang }) {
        return highlight(text, lang?.trim().split(/\s+/)[0] || 'text')
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens)
        const titleAttr = title ? ` title="${title}"` : ''
        const external = /^https?:\/\//.test(href) ? ' target="_blank" rel="noreferrer noopener"' : ''
        return `<a href="${href}"${titleAttr}${external}>${inner}</a>`
      },
      image({ href, title, text }) {
        const titleAttr = title ? ` title="${title}"` : ''
        return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" decoding="async">`
      },
    },
  })

  return marked.parse(markdown, { async: false })
}
