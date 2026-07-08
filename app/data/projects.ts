export interface ProjectMetric {
  value: string
  label: string
}

export interface Project {
  name: string
  tag: string
  description: string
  role: string
  metrics: ProjectMetric[]
  link?: string
}

export const projects: Project[] = [
  {
    name: 'GRX — Public Platform',
    tag: 'Public site · Fintech',
    description:
      'Public-facing website for a Swiss crypto-fintech platform, built end to end from design handoff to production.',
    role: 'Frontend Engineer — owned architecture end to end',
    metrics: [
      { value: '95+', label: 'Lighthouse score, sub-1.5s mobile LCP' },
      { value: '50+', label: 'component shared library, ~70% fewer visual inconsistencies' },
    ],
  },
  {
    name: 'GRX Pay — Crypto Payment Solution',
    tag: 'Product · Crypto banking',
    description:
      'Multi-currency crypto banking product supporting 24+ cryptocurrencies, with real-time balance tracking and transaction ledgers.',
    role: 'Frontend Engineer',
    metrics: [
      { value: '24+', label: 'currencies, real-time balances via WebSocket' },
      { value: 'AML', label: 'risk data surfaced per transaction' },
    ],
  },
  {
    name: 'Enterprise BI Dashboard',
    tag: 'Product · BI / Analytics',
    description:
      'Business intelligence dashboard for enterprise Amazon sellers with $10M+ GMV, handling 100,000+ orders.',
    role: 'Frontend Engineer — built from scratch',
    metrics: [
      { value: '−45%', label: 'initial render time via virtualized tables + cursor pagination' },
    ],
  },
  {
    name: 'Marketplace Investment Platform',
    tag: 'Product · Investment platform',
    description:
      'Cross-references live Amazon marketplace metrics against supplier data feeds in real time.',
    role: 'Frontend Engineer',
    metrics: [
      { value: '−30%', label: 'time-to-interactive via resilient CSV ingestion + validation pipeline' },
    ],
  },
]
