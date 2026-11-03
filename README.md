# danylomorhun.com

[![CI](https://github.com/danylo-morhun/danylomorhun.com/actions/workflows/ci.yml/badge.svg)](https://github.com/danylo-morhun/danylomorhun.com/actions/workflows/ci.yml)

My personal site: work, case studies, side projects. English, Ukrainian, Polish; light and dark.

[danylomorhun.com](https://danylomorhun.com)

## How it works

- **WebGL hero** — Three.js beams with custom GLSL spliced into the physical material; light mode is a CSS invert of the grayscale scene
- **WebGL budget** — loads client-only after idle, skipped under reduced motion, Save-Data or low device memory, capped at 30 fps, pauses off-screen, releases its GL context on unmount
- **Intro** — a sub-second first-load intro on the home page only; pure CSS hides it without JavaScript
- **Motion** — GSAP reveals; ScrollTrigger loaded on demand and reverted on unmount; everything off under `prefers-reduced-motion`
- **Static by default** — every page and locale is prerendered, so HTML is served from the CDN
- **SEO** — hreflang and canonical per locale, JSON-LD, sitemap per locale, a share image per page and locale (Satori, static Geist with Cyrillic)

## Stack

Nuxt 4, Vue 3.5, TypeScript, Tailwind CSS 3, GSAP, Three.js, Vercel.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

Checks: `npm run lint`, `npm run typecheck`, `npm run test` (Vitest), `npm run test:e2e` (Playwright, includes axe).

Adding a gallery image: drop a 1440px WebP into `public/case-studies/` or `public/personal-projects/`, then run `npm run images`.

## License

MIT. `app/components/BeamsBackground.vue` is adapted from [Vue Bits](https://vue-bits.dev) under MIT + Commons Clause. Icons are from [Remix Icon](https://remixicon.com), flags from [flag-icons](https://github.com/lipis/flag-icons) (MIT), and the share-image fonts are [Geist](https://vercel.com/font) (SIL OFL 1.1).
