export interface ExperienceEntry {
  company: string
  role: string
  start: string
  end: string
  summary: string
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Golden Ratio Exchange',
    role: 'Frontend Engineer',
    start: 'Feb 2026',
    end: 'Present',
    summary:
      'Owned frontend architecture for a Swiss crypto-fintech platform, from the public site to core banking modules.',
  },
  {
    company: 'EZCLOUD',
    role: 'Frontend Engineer',
    start: 'Dec 2021',
    end: 'Jan 2026',
    summary:
      'Built data-heavy dashboards and tools for enterprise Amazon sellers, from BI reporting to ad campaign management.',
  },
]
