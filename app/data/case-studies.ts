import type { Period } from '../utils/formatPeriod'

export interface CaseStudyImage {
  src: string
}

export interface CaseStudy {
  slug: string
  period?: Period
  nda?: boolean
  outcome: string[]
  gallery: CaseStudyImage[]
  library?: CaseStudyImage[]
  liveUrl?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'grx-public-platform',
    period: { start: '2026-02', end: '2026-08' },
    outcome: ['95+', '40'],
    gallery: [
      { src: '/case-studies/grx-public-hero.webp' },
      { src: '/case-studies/grx-public-pay-hero.webp' },
      { src: '/case-studies/grx-public-pricing.webp' },
      { src: '/case-studies/grx-public-exchange.webp' },
      { src: '/case-studies/grx-public-about.webp' },
      { src: '/case-studies/grx-public-careers.webp' },
    ],
    library: [
      { src: '/case-studies/grx-ui-kit-icons.webp' },
      { src: '/case-studies/grx-ui-kit-tokens.webp' },
      { src: '/case-studies/grx-ui-kit-typography.webp' },
      { src: '/case-studies/grx-ui-kit-composed.webp' },
    ],
    liveUrl: 'https://goldenratio.exchange',
  },
  {
    slug: 'enterprise-bi-dashboard',
    nda: true,
    outcome: ['−45%', '100k+'],
    gallery: [],
  },
  {
    slug: 'marketplace-investment-platform',
    nda: true,
    outcome: ['−30%'],
    gallery: [],
  },
  {
    slug: 'air-quality-monitoring-dashboard',
    nda: true,
    outcome: ['240+', '100%'],
    gallery: [],
  },
  {
    slug: 'donation-fundraising-platform',
    nda: true,
    outcome: ['7+', '100%'],
    gallery: [],
  },
  {
    slug: 'grx-pay',
    period: { start: '2026-02', end: '2026-08' },
    outcome: ['24+', '100%'],
    gallery: [
      { src: '/case-studies/grx-pay-dashboard.webp' },
      { src: '/case-studies/grx-pay-assets.webp' },
      { src: '/case-studies/grx-pay-transactions.webp' },
      { src: '/case-studies/grx-pay-members.webp' },
      { src: '/case-studies/grx-pay-deposit-dialog.webp' },
      { src: '/case-studies/grx-pay-addmember-dialog.webp' },
      { src: '/case-studies/grx-pay-create-invoice.webp' },
    ],
  },
]
