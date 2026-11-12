/** The blog is English-only, so its copy lives here instead of the locale files. */
export const blog = {
  path: '/blog',
  feedPath: '/blog/rss.xml',
  name: 'Blog',
  title: 'Blog · Danylo Morhun',
  heading: 'Writing',
  description: 'Notes from building web products: bugs worth explaining, architecture decisions, and what I learned shipping them.',
  backToBlog: 'All posts',
  minRead: (minutes: number) => `${minutes} min read`,
  rss: 'RSS',
} as const

/** 2026-11-07 → Nov 7, 2026 */
export function formatPostDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}
