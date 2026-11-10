# danylomorhun.com

personal site with work, case studies, side projects and a blog.
it is in English, Ukrainian and Polish, with light and dark themes.

live at [danylomorhun.com](https://danylomorhun.com).

## pages

| path           | what it is                                                 |
| :------------- | :--------------------------------------------------------- |
| `/`            | about, experience, work, side projects, contact            |
| `/work/<slug>` | case study of a work project                               |
| `/lab/<slug>`  | side project                                               |
| `/blog`        | blog posts in English, with an RSS feed at `/blog/rss.xml` |

## how it works

every page and locale is prerendered, so HTML is served from the CDN.

the hero background is a Three.js scene with custom GLSL shaders. it loads only in the browser
after the page is idle, and is skipped with reduced motion, Save-Data or less than 4 GB of device
memory. it renders at 30 fps at most, pauses when off screen and frees its WebGL context on unmount.
in light mode the grayscale scene is inverted with CSS.

the home page has a short intro on first load. it works without JavaScript and is off
with reduced motion. scroll reveals use GSAP. ScrollTrigger loads only when needed.

the blog is a small Nuxt module that reads Markdown from `content/blog` at build time
and highlights code with Shiki. posts with `draft: true` or a future date are left out
of production but shown on preview deploys. a daily workflow rebuilds the site
on the morning a scheduled post is due.

each locale has its own canonical URL, hreflang tags, JSON-LD and sitemap. each page
has its own share image per locale, rendered with Satori.

## stack

Nuxt 4, Vue 3.5, TypeScript, Tailwind CSS 4, GSAP, Three.js, Shiki, Vercel.

## run locally

```bash
npm install
npm run dev
```

the site runs on port 3000.

| command             | what it does                             |
| :------------------ | :--------------------------------------- |
| `npm run lint`      | ESLint                                   |
| `npm run typecheck` | type check                               |
| `npm run test`      | Vitest                                   |
| `npm run test:e2e`  | Playwright with axe accessibility checks |
| `npm run images`    | builds image variants for the galleries  |

to add a gallery image, put a 1440px WebP into `public/case-studies/` or
`public/personal-projects/` and run `npm run images`.

## license

MIT. `app/components/BeamsBackground.vue` is adapted from [Vue Bits](https://vue-bits.dev)
under MIT with the Commons Clause. icons are from [Remix Icon](https://remixicon.com),
flags from [flag-icons](https://github.com/lipis/flag-icons) (MIT), and share image fonts
are [Geist](https://vercel.com/font) (SIL OFL 1.1).
