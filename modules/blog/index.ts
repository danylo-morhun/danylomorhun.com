import { fileURLToPath } from 'node:url'
import { addTypeTemplate, addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { createHighlighter } from 'shiki'
import type { Plugin } from 'vite'
import { parsePost, renderMarkdown, type Highlight } from './posts'
import { loadPosts, POSTS_DIR, postFiles, slugOf } from './source'

const VIRTUAL_ID = 'virtual:blog'
const RESOLVED_ID = `\0${VIRTUAL_ID}`
const LANGS = ['ts', 'js', 'vue', 'html', 'css', 'json', 'bash', 'glsl', 'diff']
const THEMES = { light: 'github-light-default', dark: 'github-dark-default' } as const

async function createHighlight(): Promise<Highlight> {
  const highlighter = await createHighlighter({ themes: Object.values(THEMES), langs: LANGS })
  return (code, lang) => highlighter.codeToHtml(code, {
    lang: LANGS.includes(lang) ? lang : 'text',
    themes: THEMES,
    defaultColor: false,
  })
}

/**
 * `virtual:blog` exports the post list and a lazy loader per post.
 * Each `.md` file becomes a module whose default export is its rendered HTML,
 * so markdown is parsed at build time and no parser ships to the browser.
 */
function blogVitePlugin(dev: boolean): Plugin {
  let highlight: Promise<Highlight> | undefined

  return {
    name: 'blog-posts',
    resolveId: id => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return
      postFiles().forEach(file => this.addWatchFile(file))
      const posts = loadPosts({ dev })
      const loaders = posts.map(post => `${JSON.stringify(post.meta.slug)}: () => import(${JSON.stringify(post.file)})`)
      return `export const posts = ${JSON.stringify(posts.map(post => post.meta))}\n`
        + `export const loaders = {${loaders.join(',')}}\n`
    },
    async transform(code, id) {
      if (!id.startsWith(POSTS_DIR) || !id.endsWith('.md')) return
      highlight ??= createHighlight()
      const html = renderMarkdown(parsePost(slugOf(id), code).body, await highlight)
      return { code: `export default ${JSON.stringify(html)}`, map: null }
    },
  }
}

export default defineNuxtModule({
  meta: { name: 'blog' },
  setup(_, nuxt) {
    addVitePlugin(blogVitePlugin(nuxt.options.dev))

    // The RSS route runs in Nitro, which doesn't go through Vite: hand it the post list directly.
    nuxt.hook('nitro:config', (config) => {
      const posts = loadPosts({ dev: nuxt.options.dev }).map(post => post.meta)
      config.virtual ??= {}
      config.virtual['#blog-posts'] = () => `export default ${JSON.stringify(posts)}`
      config.prerender ??= {}
      config.prerender.routes = [...(config.prerender.routes ?? []), '/blog', '/blog/rss.xml']
    })

    addTypeTemplate({
      filename: 'types/blog.d.ts',
      getContents: () => {
        const meta = `import('${fileURLToPath(new URL('./posts', import.meta.url))}').PostMeta`
        return `declare module '${VIRTUAL_ID}' {
  export const posts: ${meta}[]
  export const loaders: Record<string, () => Promise<{ default: string }>>
}
declare module '#blog-posts' {
  const posts: ${meta}[]
  export default posts
}
`
      },
    }, { nuxt: true, nitro: true })
  },
})
