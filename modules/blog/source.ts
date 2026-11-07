import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePost, publishedPosts } from './posts'

export const POSTS_DIR = fileURLToPath(new URL('../../content/blog', import.meta.url))

/** Drafts show in dev and on Vercel preview deploys, never in production. */
export const showDrafts = (dev = false) => dev || process.env.VERCEL_ENV === 'preview'

export function postFiles(dir = POSTS_DIR) {
  return readdirSync(dir).filter(name => name.endsWith('.md')).map(name => join(dir, name))
}

export const slugOf = (file: string) => basename(file, '.md')

/** Every post that should be live in this build, newest first. */
export function loadPosts({ dev = false, dir = POSTS_DIR } = {}) {
  const posts = postFiles(dir).map(file => ({ ...parsePost(slugOf(file), readFileSync(file, 'utf8')), file }))
  return publishedPosts(posts, showDrafts(dev))
}
