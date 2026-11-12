import type { Period } from '../utils/formatPeriod'

export interface CaseStudyImage {
  src: string
}

export interface CaseStudy {
  slug: string
  company?: string
  period?: Period
  /** Tech names, shown on the project page only. Same in every language. */
  stack: string
  /** Metric values; labels live in the locale files (`outcome`), which may override values with `outcomeValues`. */
  outcome: string[]
  gallery: CaseStudyImage[]
  library?: CaseStudyImage[]
  liveUrl?: string
}

const GRG = 'Golden Ratio Group AG'
const GRG_PERIOD: Period = { start: '2026-02', end: '2026-08' }
const EZCLOUD = 'EZCLOUD'

const images = (dir: string, names: string[]) => names.map(name => ({ src: `/${dir}/${name}.webp` }))

export const caseStudies: CaseStudy[] = [
  {
    slug: 'grx-pay',
    company: GRG,
    period: GRG_PERIOD,
    stack: 'React 19, TypeScript, Effector, Feature-Sliced Design, Nx, Vite, Radix UI, GraphQL, SCSS',
    outcome: ['24+', '95+'],
    gallery: images('case-studies', [
      'grx-pay-merchant-dashboard',
      'grx-pay-invoice',
      'grx-pay-checkout',
      'grx-pay-assets',
      'grx-pay-transactions',
      'grx-pay-admin-dashboard',
      'grx-pay-admin-withdrawals',
    ]),
  },
  {
    // Ledgerline. The slug predates the name and is already indexed, so it stays.
    slug: 'enterprise-bi-dashboard',
    company: EZCLOUD,
    stack: 'Next.js, React, TypeScript, TanStack Table, Recharts, Python, Django',
    outcome: ['$10M+', '100k+'],
    gallery: images('case-studies', ['ledgerline-dashboard', 'ledgerline-products', 'ledgerline-settlements']),
  },
  {
    slug: 'grx-public-platform',
    company: GRG,
    period: GRG_PERIOD,
    stack: 'Next.js 15, React 18, TypeScript, Tailwind, Radix UI, next-intl, TanStack Form, Zod, Turborepo, Docker, Kubernetes',
    outcome: ['40', '6'],
    gallery: images('case-studies', [
      'grg-public-home',
      'grg-public-pay',
      'grg-public-exchange',
      'grg-public-careers',
      'grg-public-demo',
      'grg-public-docs-invoice',
      'grg-public-docs-search',
    ]),
    library: images('case-studies', [
      'grx-ui-kit-tokens',
      'grx-ui-kit-typography',
      'grx-ui-kit-icons',
      'grx-ui-kit-composed',
    ]),
  },
  {
    slug: 'sourcely',
    company: EZCLOUD,
    stack: 'Vue 3, TypeScript, Python, Django',
    outcome: ['100k', '10'],
    gallery: images('case-studies', ['sourcely-pipeline', 'sourcely-analyze', 'sourcely-product', 'sourcely-imports', 'sourcely-website']),
  },
  {
    slug: 'dialtone',
    company: EZCLOUD,
    stack: 'Vue 3, Nuxt 4, TypeScript, Python, FastAPI',
    outcome: ['170', '4'],
    gallery: images('case-studies', ['dialtone-today', 'dialtone-rentals', 'dialtone-transactions']),
  },
  {
    slug: 'ezcloud-design-system',
    company: EZCLOUD,
    stack: 'Figma tokens, Tailwind, shadcn/ui, React, Vue 3, Storybook',
    outcome: ['74', '176'],
    gallery: images('case-studies', ['ezcloud-ds-colors', 'ezcloud-ds-data-table', 'ezcloud-ds-file-import', 'ezcloud-ds-waterfall', 'ezcloud-ds-typography']),
  },
  {
    slug: 'heirwell',
    company: EZCLOUD,
    stack: 'Next.js 16, React 19, TypeScript, TanStack Query, Orval, NestJS, PostgreSQL, Prisma, Redis, BullMQ, Elasticsearch, Stripe',
    outcome: ['24', '3'],
    gallery: images('case-studies', ['heirwell-home', 'heirwell-lot', 'heirwell-auctions', 'heirwell-catalogue', 'heirwell-sell']),
  },
  {
    slug: 'cryovault',
    company: EZCLOUD,
    stack: 'React 19, TypeScript, MUI, Redux Toolkit, Handsontable, Node.js',
    outcome: ['17', '5'],
    gallery: images('case-studies', ['cryovault-batches', 'cryovault-cryo-storage', 'cryovault-protocol', 'cryovault-dose-search', 'cryovault-certificate']),
  },
]
