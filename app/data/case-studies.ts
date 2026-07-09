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
      { src: '/case-studies/grx-public-hero.png' },
      { src: '/case-studies/grx-public-pay-hero.jpg' },
      { src: '/case-studies/grx-public-pricing.png' },
      { src: '/case-studies/grx-public-exchange.png' },
      { src: '/case-studies/grx-public-about.png' },
      { src: '/case-studies/grx-public-careers.jpg' },
    ],
    library: [
      { src: '/case-studies/grx-ui-kit-icons.png' },
      { src: '/case-studies/grx-ui-kit-tokens.png' },
      { src: '/case-studies/grx-ui-kit-typography.png' },
      { src: '/case-studies/grx-ui-kit-composed.png' },
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
      { src: '/case-studies/grx-pay-dashboard.png' },
      { src: '/case-studies/grx-pay-assets.png' },
      { src: '/case-studies/grx-pay-transactions.png' },
      { src: '/case-studies/grx-pay-members.png' },
      { src: '/case-studies/grx-pay-deposit-dialog.png' },
      { src: '/case-studies/grx-pay-addmember-dialog.png' },
      { src: '/case-studies/grx-pay-create-invoice.png' },
    ],
  },
]
