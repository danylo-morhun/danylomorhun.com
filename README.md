# danylomorhun.com

[![CI](https://github.com/danylo-morhun/danylomorhun.com/actions/workflows/ci.yml/badge.svg)](https://github.com/danylo-morhun/danylomorhun.com/actions/workflows/ci.yml)

My personal site: work, case studies, side projects. English, Ukrainian, Polish; light and dark.

[danylomorhun.com](https://danylomorhun.com)

## How it works

- **WebGL hero** — Three.js beams with custom GLSL spliced into the physical material; light mode is a CSS invert of the grayscale scene
- **WebGL budget** — loads client-only after idle, capped at 30 fps, pauses off-screen, falls back cleanly if WebGL fails
- **Loader** — waits for the first rendered WebGL frame through shared state, with a timeout for pages without a hero
- **Motion** — GSAP reveals; ScrollTrigger loaded on demand; everything off under `prefers-reduced-motion`
- **SEO** — SSR, hreflang and canonical per locale, JSON-LD, sitemap per locale, OG images rendered with Satori

## Stack

Nuxt 4, Vue 3.5, TypeScript, Tailwind CSS 3, GSAP, Three.js, Vercel.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run test` (Vitest), `npm run test:e2e` (Playwright).

## License

MIT. `app/components/Beams.vue` is adapted from [Vue Bits](https://vue-bits.dev) under MIT + Commons Clause.
