import type { CaseStudy } from './case-studies'

const GITHUB = 'https://github.com/danylo-morhun'

const images = (names: string[]) => names.map(name => ({ src: `/personal-projects/${name}.webp` }))

export const personalProjects: CaseStudy[] = [
  {
    slug: 'wellbotany',
    stack: 'Next.js 16, React 19, Prisma, Neon Postgres, Auth.js, Tailwind 4, Sentry, Vercel, C# (.NET 8)',
    outcome: ['1,300+', '30-day'],
    gallery: images([
      'wellbotany-home',
      'wellbotany-hero',
      'wellbotany-product',
      'wellbotany-catalog',
      'wellbotany-gift-builder',
      'wellbotany-checkout',
      'wellbotany-admin-missing-data',
    ]),
    liveUrl: 'https://wellbotany.pl',
  },
  {
    slug: 'seikatsu',
    stack: 'Next.js 16, Drizzle, Postgres, Auth.js, Tailwind 4, shadcn/ui, Turborepo, MCP',
    outcome: ['7', '50+'],
    gallery: images(['seikatsu-apps', 'seikatsu-today', 'seikatsu-kuroji', 'seikatsu-seiryu', 'seikatsu-tsundoku', 'seikatsu-keizoku', 'seikatsu-kyuu']),
    liveUrl: 'https://seikatsu.danylomorhun.com',
  },
  {
    slug: 'unitbot',
    stack: 'Claude Code, GitHub Actions, Node.js, Vitest, mutation testing',
    outcome: ['5'],
    gallery: images(['unitbot-report', 'unitbot-run', 'unitbot-tests-pr']),
    liveUrl: `${GITHUB}/unitbot`,
  },
  {
    slug: 'aerolit',
    stack: 'Vue 3, TypeScript, PrimeVue, TanStack Query, Pinia, Leaflet, ECharts',
    outcome: ['240', '5'],
    gallery: images(['aerolit-dashboard-light', 'aerolit-dashboard-dark', 'aerolit-sensors']),
    liveUrl: `${GITHUB}/aerolit`,
  },
  {
    slug: 'hisashi',
    stack: 'Swift 6, SwiftUI, AppKit, EventKit, Core Audio, Accelerate',
    outcome: ['5'],
    gallery: images(['hisashi-today', 'hisashi-status', 'hisashi-media']),
    liveUrl: `${GITHUB}/hisashi`,
  },
  {
    slug: 'danylomorhun-com',
    stack: 'Nuxt 4, TypeScript, Tailwind 4, GSAP, Three.js',
    outcome: ['0.8 s', '100'],
    gallery: images([
      'danylomorhun-hero',
      'danylomorhun-work',
      'danylomorhun-case',
      'danylomorhun-lab',
      'danylomorhun-experience',
      'danylomorhun-blog',
      'danylomorhun-lighthouse-desktop',
      'danylomorhun-lighthouse-mobile',
    ]),
    liveUrl: `${GITHUB}/danylomorhun.com`,
  },
]
