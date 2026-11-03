import type { Period } from '../utils/formatPeriod'

export interface ExperienceEntry {
  key: string
  company: string
  countryCode: string
  period: Period
}

export const experience: ExperienceEntry[] = [
  {
    key: 'grx',
    company: 'Golden Ratio Group AG',
    countryCode: 'ch',
    period: { start: '2026-02', end: '2026-08' },
  },
  {
    key: 'ezcloud',
    company: 'EZCLOUD',
    countryCode: 'us',
    period: { start: '2021-12', end: '2026-02' },
  },
]
