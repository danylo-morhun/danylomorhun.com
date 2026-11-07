import { blog } from '#shared/blog'
import { loaders, posts } from 'virtual:blog'
import type { PostMeta } from '~~/modules/blog/posts'

export type { PostMeta }

/** Live posts, newest first. */
export const useBlogPosts = (): PostMeta[] => posts

export const useBlogPost = (slug: string): PostMeta | undefined => posts.find(post => post.slug === slug)

/** The post's rendered HTML, loaded with its own chunk. */
export const loadPostHtml = async (slug: string) => (await loaders[slug]!()).default

/** Title, description, share image and canonical-friendly meta shared by blog pages. */
export function useBlogSeo(page: { title: string, description: string, ogTitle: string, ogSubtitle: string, type: 'website' | 'article' }) {
  const siteConfig = useSiteConfig()

  useSeoMeta({
    title: page.title,
    ogTitle: page.title,
    twitterTitle: page.title,
    description: page.description,
    ogDescription: page.description,
    twitterDescription: page.description,
    ogType: page.type,
    ogImageAlt: page.title,
    twitterImageAlt: page.title,
  })

  useHead({
    link: [{ rel: 'alternate', type: 'application/rss+xml', title: blog.title, href: absoluteUrl(siteConfig.url, blog.feedPath) }],
  })

  defineOgImage('Default', { title: page.ogTitle, subtitle: page.ogSubtitle, tag: 'danylomorhun.com/blog', tagline: blog.title })
}
