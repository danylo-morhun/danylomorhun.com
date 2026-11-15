import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SPRINGS, spring, springCss, springLinear } from '../shared/utils/spring'

describe('spring', () => {
  it('starts at rest and ends on target', () => {
    for (const config of Object.values(SPRINGS)) {
      const { ease, at, settle } = spring(config)
      expect(ease(0)).toBe(0)
      expect(ease(1)).toBe(1)
      expect(Math.abs(1 - at(settle))).toBeLessThan(0.002)
    }
  })

  it('never overshoots without bounce', () => {
    const { ease } = spring({ duration: 0.3 })
    let previous = 0
    for (let i = 0; i <= 1000; i++) {
      const value = ease(i / 1000)
      expect(value).toBeLessThanOrEqual(1)
      expect(value).toBeGreaterThanOrEqual(previous)
      previous = value
    }
  })

  it('overshoots a little with bounce', () => {
    const { ease } = spring({ duration: 0.45, bounce: 0.25 })
    const peak = Math.max(...Array.from({ length: 1001 }, (_, i) => ease(i / 1000)))
    expect(peak).toBeGreaterThan(1.01)
    expect(peak).toBeLessThan(1.1)
  })

  it('settles later than its perceptual duration, in proportion to it', () => {
    const short = spring({ duration: 0.2 }).settle
    const long = spring({ duration: 0.4 }).settle
    expect(short).toBeGreaterThan(0.2)
    expect(long / short).toBeCloseTo(2, 1)
  })

  it('rejects impossible configs', () => {
    expect(() => spring({ duration: 0 })).toThrow(RangeError)
    expect(() => spring({ duration: 0.3, bounce: 1 })).toThrow(RangeError)
  })
})

describe('springLinear', () => {
  it('stays close to the real curve', () => {
    const config = SPRINGS.bouncy
    const { ease } = spring(config)
    const stops = springLinear(config)
      .slice('linear('.length, -1)
      .split(', ')
      .map((stop, i) => {
        const [value, position] = stop.split(' ')
        return [position ? Number.parseFloat(position) / 100 : i === 0 ? 0 : 1, Number(value)] as const
      })
    expect(stops.length).toBeLessThan(40)
    for (let i = 0; i <= 100; i++) {
      const x = i / 100
      const after = stops.findIndex(([position]) => position >= x)
      const [x1, y1] = stops[after]!
      const [x0, y0] = stops[Math.max(after - 1, 0)]!
      const y = x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
      expect(Math.abs(y - ease(x))).toBeLessThan(0.005)
    }
  })
})

describe('main.css', () => {
  it('has the current springs (run `npm run springs`)', () => {
    const css = readFileSync('app/assets/css/main.css', 'utf8')
    expect(css).toContain(springCss())
  })
})
