export interface ExperienceEntry {
  company: string
  countryCode: string
  country: string
  role: string
  start: string
  end: string
  summary: string
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Golden Ratio Exchange',
    countryCode: 'CH',
    country: 'Switzerland',
    role: 'Frontend Engineer',
    start: 'Feb 2026',
    end: 'Jul 2026',
    summary:
      'Owned frontend architecture for a Swiss crypto-fintech platform, from the public site to core banking modules.',
  },
  {
    company: 'EZCLOUD',
    countryCode: 'US',
    country: 'United States',
    role: 'Frontend Engineer',
    start: 'Dec 2021',
    end: 'Jan 2026',
    summary:
      'Built data-heavy dashboards and tools for enterprise Amazon sellers, from BI reporting to ad campaign management.',
  },
]
