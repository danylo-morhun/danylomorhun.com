import type { ProjectMetric } from './projects'

export interface CaseStudyImage {
  src: string
  alt: string
  caption: string
}

export interface CaseStudy {
  slug: string
  name: string
  tag: string
  role: string
  dates: string
  overview: string
  challengeTitle: string
  challenge: string
  approach: string[]
  outcome: ProjectMetric[]
  gallery: CaseStudyImage[]
  librarySectionTitle?: string
  library?: CaseStudyImage[]
  liveUrl?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'grx-public-platform',
    name: 'GRX — Public Platform',
    tag: 'Public site · Fintech',
    role: 'Frontend Engineer — owned architecture end to end',
    dates: 'Feb 2026 – Jul 2026',
    overview:
      'GRX is a Swiss crypto-fintech ecosystem spanning payments, exchange, and tokenized real-world assets. I built the public-facing platform from scratch — the marketing site, pricing and product pages, and the careers hub — along with the shared component library it and the rest of the company\'s products now run on.',
    challengeTitle: 'The Challenge',
    challenge:
      'GRX had three products in flight — Pay, Exchange, RWA — and neither a public website to showcase any of them nor a shared component library for the teams building them, so every product screen was its own one-off implementation of the same buttons, inputs, and cards. Two problems, one root cause: build the site from scratch, and build the design system underneath it so both the site and the products could finally speak the same visual language.',
    approach: [
      'Extracted a shared @grx/ui component library — 50+ components — from scratch, consumed by both the marketing site and the product apps, closing the drift between what marketing ships and what the product actually looks like',
      'Server-rendered with Next.js App Router; the [locale] segment handles i18n via next-intl so every product page ships translated and statically generated per locale',
      'Radix UI primitives under the shared library for accessible interaction patterns (dialogs, tabs, accordions) instead of hand-rolling focus management per component',
      'Careers and editorial content authored in Markdown and rendered at build time, keeping the content pipeline outside the deploy critical path',
      'Lighthouse budget enforced as a CI gate rather than a one-time audit, so regressions get caught before merge',
    ],
    outcome: [
      { value: '95+', label: 'Lighthouse score, sub-1.5s mobile LCP' },
      { value: '50+', label: 'component shared library, ~70% fewer visual inconsistencies' },
    ],
    gallery: [
      {
        src: '/case-studies/grx-public-hero.png',
        alt: 'GRX homepage hero section',
        caption: 'Homepage — positioning GRX across payments, exchange, and tokenized assets',
      },
      {
        src: '/case-studies/grx-public-pay-hero.jpg',
        alt: 'GRX Pay marketing page hero',
        caption: 'GRX Pay — the product landing page for the payments surface',
      },
      {
        src: '/case-studies/grx-public-pricing.png',
        alt: 'GRX Pay pricing page with tiered commission structure',
        caption: 'GRX Pay pricing — tiered commission structure for merchants, from self-serve to custom volume deals',
      },
      {
        src: '/case-studies/grx-public-exchange.png',
        alt: 'GRX Exchange coming-soon waitlist page',
        caption: 'GRX Exchange — waitlist page for the retail trading product, shipped ahead of launch',
      },
      {
        src: '/case-studies/grx-public-about.png',
        alt: 'About GRX page',
        caption: 'About GRX — company positioning page',
      },
      {
        src: '/case-studies/grx-public-careers.jpg',
        alt: 'GRX careers landing page',
        caption: 'Careers — the hiring hub, content authored in Markdown and rendered at build time',
      },
    ],
    librarySectionTitle: '@grx/ui — the component library',
    library: [
      {
        src: '/case-studies/grx-ui-kit-icons.png',
        alt: 'Grid of over 200 cryptocurrency coin icons from the @grx/ui icon set',
        caption: '200+ coin icons — one of the icon sets shipped with the library',
      },
      {
        src: '/case-studies/grx-ui-kit-tokens.png',
        alt: 'Design tokens documentation page showing the color palette',
        caption: 'Design tokens — color, radius, and shadow scales documented in Storybook',
      },
      {
        src: '/case-studies/grx-ui-kit-typography.png',
        alt: 'Typography scale documentation showing display text sizes',
        caption: 'Typography scale — every display and text size, documented with its exact metrics',
      },
      {
        src: '/case-studies/grx-ui-kit-composed.png',
        alt: 'Integration settings modal combining Modal, Switch, icon, and Typography components in a realistic composed screen',
        caption: 'A real settings screen, built from the library — Modal, Switch, icons, and Typography working together',
      },
    ],
    liveUrl: 'https://goldenratio.exchange',
  },
  {
    slug: 'grx-pay',
    name: 'GRX Pay — Crypto Payment Solution',
    tag: 'Product · Crypto banking',
    role: 'Frontend Engineer',
    dates: 'Feb 2026 – Jul 2026',
    overview:
      'GRX Pay is a multi-currency crypto banking product — merchants accept payments across 24+ cryptocurrencies, track balances, and move funds out via SEPA, with every transaction carrying AML and risk data. I worked on the merchant dashboard: balances, invoices, transactions, and team management.',
    challengeTitle: 'The Challenge',
    challenge:
      'Balances and transaction state change mid-session — deposits settling, auto-conversions completing, mass payouts processing — and that state has to stay correct across several large, paginated tables (invoices, transactions, team members) without the dashboard feeling stale or the tables janking on every update.',
    approach: [
      'GraphQL data layer (@grx/graphql-client) with a normalized cache, so a balance update in one view is reflected everywhere else it\'s rendered without a manual refetch',
      'Farfetched-driven query layer for the async state around real-time balance and transaction updates, keeping loading/stale/error states explicit instead of implicit',
      'Paginated, cursor-based tables for invoices, transactions, and members rather than loading full result sets client-side',
      'Role-based UI via @grx/rabac — admin, merchant, and member views render different actions from the same components instead of forking screens per role',
      'FeatureScript-gated rollout for new payment features (auto-convert, fixed-sum invoices), so product could ship behind a flag and turn it on per merchant',
    ],
    outcome: [
      { value: '24+', label: 'currencies, real-time balances via WebSocket' },
      { value: '100%', label: 'transactions surfaced with AML / risk data' },
    ],
    gallery: [
      {
        src: '/case-studies/grx-pay-dashboard.png',
        alt: 'GRX Pay dashboard showing total balance, successful payments chart, and recent transactions',
        caption: 'Dashboard — balances, payment volume, and the live transaction feed in one view',
      },
      {
        src: '/case-studies/grx-pay-assets.png',
        alt: 'GRX Pay assets screen showing multi-currency balances',
        caption: 'Assets — real-time multi-currency balances, held and available',
      },
      {
        src: '/case-studies/grx-pay-transactions.png',
        alt: 'GRX Pay transactions table with filters for type, status, currency, and period',
        caption: 'Transactions — filterable, paginated ledger across every currency',
      },
      {
        src: '/case-studies/grx-pay-members.png',
        alt: 'GRX Pay team members table with roles and confirmation status',
        caption: 'Team management — role-based access across merchant admins',
      },
      {
        src: '/case-studies/grx-pay-deposit-dialog.png',
        alt: 'GRX Pay deposit dialog showing per-currency deposit methods and fees',
        caption: 'Deposit — per-currency methods and fees, surfaced before the merchant commits',
      },
      {
        src: '/case-studies/grx-pay-addmember-dialog.png',
        alt: 'GRX Pay add member dialog with role picker and role descriptions',
        caption: 'Add member — the same role system from @grx/rabac, explained inline',
      },
      {
        src: '/case-studies/grx-pay-create-invoice.png',
        alt: 'GRX Pay create invoice form with currency, amount, and auto-convert settings',
        caption: 'Create invoice — fixed-sum invoices and auto-convert, gated behind FeatureScript',
      },
    ],
  },
]
