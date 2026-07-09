export interface ProjectRef {
  slug: string
  metricsCount: number
}

export const projects: ProjectRef[] = [
  { slug: 'grx-public-platform', metricsCount: 2 },
  { slug: 'grx-pay', metricsCount: 2 },
  { slug: 'enterprise-bi-dashboard', metricsCount: 1 },
  { slug: 'marketplace-investment-platform', metricsCount: 1 },
]
