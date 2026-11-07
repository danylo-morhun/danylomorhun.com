export interface RssChannel {
  title: string
  description: string
  /** Absolute URL of the blog. */
  link: string
  /** Absolute URL of this feed. */
  feedUrl: string
  language: string
}

export interface RssItem {
  title: string
  description: string
  /** Absolute URL of the post. */
  link: string
  /** YYYY-MM-DD */
  date: string
  categories: string[]
}

const escapeXml = (text: string) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString()

/** RSS 2.0 feed. Items are written in the order given. */
export function buildRss(channel: RssChannel, items: RssItem[]) {
  const entries = items.map(item => [
    '    <item>',
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(item.link)}</guid>`,
    `      <description>${escapeXml(item.description)}</description>`,
    `      <pubDate>${rfc822(item.date)}</pubDate>`,
    ...item.categories.map(category => `      <category>${escapeXml(category)}</category>`),
    '    </item>',
  ].join('\n'))

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(channel.link)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
    `    <language>${escapeXml(channel.language)}</language>`,
    `    <atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml"/>`,
    ...(items[0] ? [`    <lastBuildDate>${rfc822(items[0].date)}</lastBuildDate>`] : []),
    ...entries,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
