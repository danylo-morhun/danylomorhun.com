import type { CaseStudy } from './case-studies'

export const personalProjects: CaseStudy[] = [
  {
    slug: 'seikatsu',
    name: 'seikatsu — Personal Super App',
    tag: 'Personal project · Multi-app platform',
    role: 'Solo — architecture, backend, and UI, end to end',
    dates: '2026 – ongoing',
    overview:
      'Off-the-shelf apps are too rigid for how I actually track my life, so seikatsu is a self-built alternative: one authenticated shell with independent mini-apps underneath — a finance tracker, a kanban board, a books log, with a habit tracker and a wishlist manager next in line. Public sign-in is open at seikatsu.danylomorhun.com.',
    challengeTitle: 'The Challenge',
    challenge:
      'Each mini-app is a real, full-featured product in its own right — the finance tracker alone does double-entry bookkeeping with multi-currency support. Building several of those, with more planned, without the codebase collapsing into an unmaintainable pile meant the shared infrastructure (auth, workspace, design system) had to be genuinely reusable, not just copy-pasted between apps.',
    approach: [
      'A shared internal library layer split from the apps themselves, so every mini-app draws from one data layer and one component library instead of duplicating either',
      'Each mini-app lives as its own self-contained slice — actions, components, and logic kept together — so the finance tracker, the kanban board, and the books log evolve independently without stepping on each other',
      'The finance tracker is a real double-entry ledger: every transaction posts balanced entries across accounts, not a flat amount-plus-category row, with multi-currency entries reconciled against cached historical exchange rates',
      'The kanban board\'s drag-reorder uses a positioning scheme that never requires rewriting sibling rows, so reordering one card stays a single write',
      'One workspace model and one sign-in system shared across every app — adding a new mini-app is a route and a slice, not a new auth system',
    ],
    outcome: [
      { value: '3', label: 'apps shipped — finance, kanban, and books — with habits and a wishlist next' },
      { value: '1 shell', label: 'shared auth, workspace, and design system across every app' },
    ],
    gallery: [
      {
        src: '/personal-projects/seikatsu-seiryu.jpg',
        alt: 'Seiryu kanban board with columns Backlog, In Progress, Review, Done',
        caption: 'Seiryu — kanban board with smooth drag-reorder',
      },
      {
        src: '/personal-projects/seikatsu-home.jpg',
        alt: 'seikatsu home screen showing the app grid — Kuroji, Seiryu, Tsundoku, and apps coming soon',
        caption: 'Home — one shell, every mini-app one click away',
      },
      {
        src: '/personal-projects/seikatsu-kuroji.jpg',
        alt: 'Kuroji finance dashboard showing net worth, income vs expenses, and category breakdown',
        caption: 'Kuroji — double-entry finance tracker with multi-currency accounts',
      },
      {
        src: '/personal-projects/seikatsu-tsundoku.jpg',
        alt: 'Tsundoku library grid showing books with real cover art, reading status, and ratings',
        caption: 'Tsundoku — reading tracker with shelves, sessions, and ratings',
      },
    ],
    liveUrl: 'https://seikatsu.danylomorhun.com/',
  },
  {
    slug: 'twoje-zdrowie',
    name: 'Twoje Zdrowie — Health & Supplements Store',
    tag: 'Personal project · E-commerce · Polish market',
    role: 'Solo — full-stack, from schema to storefront',
    dates: '2026',
    overview:
      'A Polish-market e-commerce store for supplements, vitamins, and bio products — built solo end to end, from the database schema through to the storefront. Currently in development, wired to real Polish commerce rails: online payment, parcel-locker and courier shipping, and a hub syncing stock and orders with a major marketplace.',
    challengeTitle: 'The Challenge',
    challenge:
      'Health-product e-commerce in Poland carries constraints most storefronts don\'t: prices need exact arithmetic (no float rounding at checkout), product copy has to satisfy local health-claim and labeling rules across three languages, and the brand had to land as "trusted pharmacist" — not generic SaaS gradients, not clinical hospital-white, not greenwashed wellness cliché. All three had to be solved before the first product page shipped.',
    approach: [
      'Every price and tax figure stored as a whole number of grosz (the smallest Polish currency unit) rather than a decimal, so checkout math is exact by construction instead of rounded after the fact',
      'A consistent feature-sliced structure across the codebase, with every mutation going through a validated server-side action rather than a client-trusted form post',
      'One integration hub sits between the storefront and the marketplace/courier network, so the storefront never talks to those external systems directly and stays decoupled from their sync and label generation',
      'Product data carries structured nutrition facts, allergen info, and health warnings as machine-readable fields, so regulatory copy renders consistently across Polish, English, and Ukrainian',
      'Design system built against explicit anti-references written down before any UI shipped — no SaaS-startup gradients, no clinical white-and-blue, no greenwashing leaf icons — landing on a warm forest-green "expert but approachable" register instead',
    ],
    outcome: [
      { value: '0', label: 'float-rounding risk — every price stored as an exact integer' },
      { value: '3 rails', label: 'payment, courier, and marketplace sync integrated through one hub' },
    ],
    gallery: [
      {
        src: '/personal-projects/twojezdrowie-home.jpg',
        alt: 'Twoje Zdrowie homepage with hero banner, trust strip, and category grid',
        caption: 'Homepage — trust signals up front, category grid seeded from the product catalog',
      },
      {
        src: '/personal-projects/twojezdrowie-katalog.jpg',
        alt: 'Twoje Zdrowie product catalog with filters by category, brand, and dietary tag',
        caption: 'Catalog — filterable by category, brand, and dietary claim',
      },
      {
        src: '/personal-projects/twojezdrowie-produkt.jpg',
        alt: 'Twoje Zdrowie product detail page for Witamina D3 with price, dosage, and related products',
        caption: 'Product page — dosage, regulatory disclaimer, and related products',
      },
      {
        src: '/personal-projects/twojezdrowie-koszyk.jpg',
        alt: 'Twoje Zdrowie cart page with order summary and free-shipping progress bar',
        caption: 'Cart — order summary with a free-shipping progress nudge',
      },
    ],
  },
  {
    slug: 'danylomorhun-com',
    name: 'danylomorhun.com — This Site',
    tag: 'Personal project · Portfolio',
    role: 'Solo — design and build',
    dates: '2026',
    overview:
      'This site — rebuilt from scratch to do one job well: let someone hiring a frontend engineer find me, see what I\'ve built, and reach out, in under a minute.',
    challengeTitle: 'The Challenge',
    challenge:
      'A recruiter or hiring manager scanning applications gives a site seconds, often on a phone, before deciding whether to open the resume or move on. The job was ruthless prioritization — surface real projects and real outcomes immediately, keep every section pointing at the same next step, and stay out of the way of that decision rather than trying to impress with the site itself.',
    approach: [
      'One clear path through the content — hero, work, personal projects, experience, about — each section earning the scroll to the next instead of competing for attention',
      'Every section repeats the same call to action, so there\'s never a moment where a reader is engaged but unsure how to reach out',
      'Real project outcomes and real screenshots throughout, including NDA-scoped client work described honestly by its technical decisions without naming the client',
      'Fast by default — content renders on the server so there\'s something to read the instant the page arrives, not after a round of client-side loading',
      'Built to grow — every project, case study, and role lives in a typed data file, so adding one is a content change, not a redesign',
    ],
    outcome: [
      { value: '5 sections', label: 'one scroll from hero to contact, no dead ends' },
      { value: '1 file', label: 'adding a new project is a content change, not a redesign' },
    ],
    gallery: [
      {
        src: '/personal-projects/danylomorhun-hero.jpg',
        alt: 'danylomorhun.com homepage hero section',
        caption: 'Homepage — the hero section you just scrolled past',
      },
      {
        src: '/personal-projects/danylomorhun-work.jpg',
        alt: 'danylomorhun.com work section listing case studies with outcomes',
        caption: 'Work — real projects and outcomes, one scroll down from the hero',
      },
    ],
    liveUrl: 'https://danylomorhun.com',
  },
]
