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
  nda?: boolean
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
      'Extracted a shared component library — 50+ components — from scratch, consumed by both the marketing site and the product apps, closing the drift between what marketing ships and what the product actually looks like',
      'Server-rendered with locale-aware routing baked into the URL structure, so every product page ships translated and statically generated per locale',
      'Accessible interaction primitives (dialogs, tabs, accordions) built once into the shared library instead of hand-rolling focus management per component',
      'Careers and editorial content authored as structured text and rendered at build time, keeping the content pipeline outside the deploy critical path',
      'A performance budget enforced as an automated gate rather than a one-time audit, so regressions get caught before merge',
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
        caption: 'Design tokens — color, radius, and shadow scales documented in the component library',
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
    slug: 'enterprise-bi-dashboard',
    name: 'Enterprise BI Dashboard',
    tag: 'Product · BI / Analytics',
    role: 'Frontend Engineer — built from scratch',
    dates: '',
    nda: true,
    overview:
      'This project is under NDA — the client, product name, and any screenshots can\'t be shared. What follows is limited to my role and the technical approach: a business intelligence dashboard built for an enterprise Amazon seller doing $10M+ in GMV — revenue, order-level margin, and inventory rolled up across six figures of monthly orders, for an ops team that needed to catch margin erosion before it showed up in the P&L.',
    challengeTitle: 'The Challenge',
    challenge:
      'The seller\'s order history ran past 100,000 rows and kept growing, and the team needed to filter, sort, and export any slice of it — by date, SKU, or status — without the browser tab stalling or the export timing out. A dashboard that only handled the first page of data wasn\'t going to survive contact with the actual dataset.',
    approach: [
      'Virtualized table rendering so only visible rows mount to the DOM, keeping scroll and filter interactions smooth over 100,000+ orders',
      'Cursor-based pagination against the API instead of offset pagination, avoiding the slow-count problem on a table that size',
      'Debounced, server-side filtering (date range, SKU, status) so the client never holds more than one page of results in memory',
      'Client-side CSV/PDF export built as a background job with a progress state, rather than blocking the UI while the file streams down',
      'Margin and revenue aggregates computed server-side and cached per period, so the dashboard renders instantly instead of summing rows in the browser',
    ],
    outcome: [
      { value: '−45%', label: 'initial render time via virtualized tables + cursor pagination' },
      { value: '100k+', label: 'orders filterable and exportable without a client-side stall' },
    ],
    gallery: [],
  },
  {
    slug: 'marketplace-investment-platform',
    name: 'Marketplace Investment Platform',
    tag: 'Product · Investment platform',
    role: 'Frontend Engineer',
    dates: '',
    nda: true,
    overview:
      'This project is under NDA — the client, product name, and any screenshots can\'t be shared. What follows is limited to my role and the technical approach: a platform that cross-references a seller\'s live Amazon marketplace metrics — pricing, competitor positioning, stock levels — against supplier CSV feeds in real time, flagging discrepancies before they turn into pricing errors or stockouts.',
    challengeTitle: 'The Challenge',
    challenge:
      'Supplier data arrived as CSVs of wildly inconsistent quality — missing columns, malformed prices, duplicate SKUs — and had to be ingested, validated, and reconciled against live marketplace data without a bad file taking down the pipeline or silently corrupting the comparison.',
    approach: [
      'A resilient CSV ingestion pipeline with per-row validation, so one malformed row degrades gracefully instead of failing the whole upload',
      'Variance detection against a configurable tolerance band, flagging rows for manual review instead of auto-accepting supplier data at face value',
      'Upload history with explicit Processed / Failed / Pending states, so a failed feed is visible immediately rather than discovered downstream',
      'Live marketplace metrics polled on a short interval with an explicit "last updated" timestamp, keeping the live/stale distinction visible in the UI',
      'Optimistic UI for review actions (ignore / flag), reconciled against the server response rather than blocking on a round trip',
    ],
    outcome: [
      { value: '−30%', label: 'time-to-interactive via resilient CSV ingestion + validation pipeline' },
    ],
    gallery: [],
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
      'A normalized client-side data layer, so a balance update in one view is reflected everywhere else it\'s rendered without a manual refetch',
      'A dedicated async query layer for the state around real-time balance and transaction updates, keeping loading/stale/error states explicit instead of implicit',
      'Paginated, cursor-based tables for invoices, transactions, and members rather than loading full result sets client-side',
      'A shared role-based access layer — admin, merchant, and member views render different actions from the same components instead of forking screens per role',
      'Flag-gated rollout for new payment features (auto-convert, fixed-sum invoices), so product could ship behind a flag and turn it on per merchant',
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
