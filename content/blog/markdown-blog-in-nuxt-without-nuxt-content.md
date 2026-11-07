---
title: A markdown blog in Nuxt, without Nuxt Content
description: How this blog turns markdown into HTML at build time with a small Vite plugin, so no markdown parser or database ships to the browser, and how it publishes scheduled posts.
date: 2026-11-30
tags: [nuxt, vite, markdown]
---

When I added a blog to this site, the obvious choice was Nuxt Content. It's a good module: collections, queries, MDC components, a studio. But my needs were small: a handful of markdown files, a list page, a post page and an RSS feed. Nuxt Content v3 stores content in SQLite and, on client-side navigation, queries it in the browser through a WASM build. That's a lot of machinery for a list of posts.

So I wrote about 150 lines instead. Here's how it works.

## The idea: markdown is a build-time input

Every page on this site is prerendered. The markdown never changes between deploys. So there's no reason to parse it at runtime, on the server or in the browser. Parse it once, during the build, and ship HTML.

Vite already has the right tool for "turn this file into a JavaScript module": a plugin with a `transform` hook.

## Each post becomes a module

A post is a file in `content/blog/` with YAML frontmatter:

```md
---
title: When the WebGL context never comes back
description: My site's three.js hero sometimes went blank and stayed blank.
date: 2026-11-07
tags: [three.js, webgl, debugging]
---

The hero on this site is a three.js scene...
```

The plugin turns each `.md` file into a module whose default export is the rendered HTML:

```ts
async transform(code, id) {
  if (!id.startsWith(POSTS_DIR) || !id.endsWith('.md')) return
  highlight ??= createHighlight()
  const html = renderMarkdown(parsePost(slugOf(id), code).body, await highlight)
  return { code: `export default ${JSON.stringify(html)}`, map: null }
}
```

`renderMarkdown` uses `marked` with a few custom renderers: headings get ids and anchor links, code blocks go through Shiki, external links open in a new tab, images are lazy. Shiki renders both light and dark colors as CSS variables, so the theme toggle works without re-highlighting.

Because all of this runs inside Vite, `marked` and Shiki are build tools. Neither ends up in the browser bundle.

## A virtual module for the list

Pages need the list of posts without loading every post's HTML. The plugin serves a virtual module, `virtual:blog`, with the metadata and a lazy loader per post:

```ts
load(id) {
  if (id !== RESOLVED_ID) return
  const posts = loadPosts({ dev })
  const loaders = posts.map(post => `${JSON.stringify(post.meta.slug)}: () => import(${JSON.stringify(post.file)})`)
  return `export const posts = ${JSON.stringify(posts.map(post => post.meta))}\n`
    + `export const loaders = {${loaders.join(',')}}\n`
}
```

The dynamic `import()` is the important part. Vite turns each post into its own chunk, so opening one post downloads that post's HTML and nothing else. The list page only gets titles, dates and descriptions, about a kilobyte.

The post page loads its HTML with `useAsyncData`, so on the first visit the HTML comes from the prerendered page and isn't fetched again:

```ts
const { data: html } = await useAsyncData(`blog-${slug}`, () => loadPostHtml(slug))
```

## Keep the rules pure

Parsing, validating and sorting posts are plain functions with no file system and no Vite in them:

- `parsePost(slug, source)` reads the frontmatter and throws a clear error if a field is missing or a date isn't `YYYY-MM-DD`.
- `renderMarkdown(markdown, highlight)` takes the highlighter as an argument, so tests pass in a fake one.
- `publishedPosts(posts, { preview, today })` decides what's live.

The Vite plugin and the Nuxt module are thin adapters around them. That makes the interesting parts easy to unit test, and a typo in a post's frontmatter fails the build instead of quietly breaking a page.

## Drafts and scheduled posts

`publishedPosts` is also where publishing rules live:

```ts
export function publishedPosts(posts, { preview, today }) {
  return posts
    .filter(post => preview || (!post.meta.draft && post.meta.date <= today))
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
}
```

A post with `draft: true` or a date in the future isn't in the production build. Preview deploys show everything, so I can read a post on a real URL before it goes out.

A future date alone doesn't publish anything, though. The site is static, so a scheduled post only appears when the site is rebuilt on or after its date. A GitHub Actions workflow runs every morning, checks whether any post is dated today, and if so calls a Vercel deploy hook. The rebuild picks up the post, and the RSS feed and sitemap with it.

## The rest: RSS, sitemap, structured data

The same post list feeds the other places that need it:

- **RSS** is a Nitro route, prerendered to a static `rss.xml`. Nitro doesn't go through Vite, so the Nuxt module hands it the post list as a virtual import.
- **The sitemap** gets each post with its `lastmod` date.
- **Each post page** has `BlogPosting` JSON-LD, with the author linked to the same `Person` as the rest of the site.

## Would I do it again?

For a personal blog with a few posts, yes. The whole thing is small enough to read in one sitting, and every part of it is something I can change. If I needed queries across hundreds of documents, or components inside markdown, I'd reach for Nuxt Content.
