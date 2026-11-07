import posts from '#blog-posts'
import { blog } from '#shared/blog'

export default defineEventHandler((event) => {
  const siteUrl = getSiteConfig(event).url
  const url = (path: string) => absoluteUrl(siteUrl, path)

  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  return buildRss(
    { title: blog.title, description: blog.description, link: url(blog.path), feedUrl: url(blog.feedPath), language: 'en-US' },
    posts.map(post => ({
      title: post.title,
      description: post.description,
      link: url(`${blog.path}/${post.slug}`),
      date: post.date,
      categories: post.tags,
    })),
  )
})
