export interface CaseStudyImage {
  src: string
}

export interface CaseStudy {
  slug: string
  dates: string
  nda?: boolean
  outcome: string[]
  gallery: CaseStudyImage[]
  library?: CaseStudyImage[]
  liveUrl?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'grx-public-platform',
    dates: 'Feb 2026 – Jul 2026',
    outcome: ['95+', '50+'],
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
    dates: '',
    nda: true,
    outcome: ['−45%', '100k+'],
    gallery: [],
  },
  {
    slug: 'marketplace-investment-platform',
    dates: '',
    nda: true,
    outcome: ['−30%'],
    gallery: [],
  },
  {
    slug: 'grx-pay',
    dates: 'Feb 2026 – Jul 2026',
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
