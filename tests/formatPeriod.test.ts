import { describe, expect, it } from 'vitest'
import { formatPeriod } from '../app/utils/formatPeriod'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

describe('formatPeriod', () => {
  it('formats a month range', () => {
    expect(formatPeriod({ start: '2026-02', end: '2026-08' }, months, 'ongoing')).toBe('Feb 2026 – Aug 2026')
  })

  it('formats a single year', () => {
    expect(formatPeriod({ start: '2026' }, months, 'ongoing')).toBe('2026')
  })

  it('uses the ongoing label', () => {
    expect(formatPeriod({ start: '2026', ongoing: true }, months, 'w toku')).toBe('2026 – w toku')
  })

  it('uses localized month names and a custom separator', () => {
    const uk = ['січ.', 'лют.', 'бер.', 'квіт.', 'трав.', 'черв.', 'лип.', 'серп.', 'вер.', 'жовт.', 'лист.', 'груд.']
    expect(formatPeriod({ start: '2021-12', end: '2026-02' }, uk, 'триває', ' — ')).toBe('груд. 2021 — лют. 2026')
  })

  it('returns an empty string without a period', () => {
    expect(formatPeriod(undefined, months, 'ongoing')).toBe('')
  })
})
