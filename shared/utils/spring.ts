/**
 * Critically/under-damped spring, configured the Apple way: a perceptual `duration`
 * (seconds) and a `bounce` (0 = no overshoot, 0.3 = playful). Same model as SwiftUI's
 * `.spring(duration:bounce:)` and Motion's `{ type: 'spring', duration, bounce }`.
 *
 * The site has no spring runtime: CSS gets the curve sampled into `linear()`, GSAP gets
 * it as an ease function. Both run over `settle` seconds, the time the spring needs to
 * come to rest, which is longer than the perceptual duration (the tail is invisible).
 */
export interface SpringConfig {
  duration: number
  bounce?: number
}

export interface Spring {
  /** Position at time `t` seconds, 0 → 1, may overshoot 1 when bouncy. */
  at: (t: number) => number
  /** Seconds until the spring stays within `REST` of its target. */
  settle: number
  /** Normalized ease over the settle time: `ease(0) = 0`, `ease(1) = 1`. */
  ease: (p: number) => number
}

/** Distance from the target that counts as at rest: well under a pixel on a 24px move. */
const REST = 0.001

export function spring({ duration, bounce = 0 }: SpringConfig): Spring {
  if (duration <= 0) throw new RangeError('spring duration must be positive')
  if (bounce < 0 || bounce >= 1) throw new RangeError('spring bounce must be in [0, 1)')

  const omega = (2 * Math.PI) / duration
  const zeta = 1 - bounce

  const at = zeta === 1
    ? (t: number) => 1 - Math.exp(-omega * t) * (1 + omega * t)
    : (() => {
        const omegaD = omega * Math.sqrt(1 - zeta * zeta)
        const k = (zeta * omega) / omegaD
        return (t: number) =>
          1 - Math.exp(-zeta * omega * t) * (Math.cos(omegaD * t) + k * Math.sin(omegaD * t))
      })()

  // Walk until the motion has stayed at rest for a full period, then keep the last exit.
  const step = duration / 1000
  let settle = 0
  for (let t = 0; t < duration * 20; t += step) {
    if (Math.abs(1 - at(t)) > REST) settle = t
    else if (t - settle > duration) break
  }
  settle = Math.round((settle + step) * 1000) / 1000

  const ease = (p: number) => (p <= 0 ? 0 : p >= 1 ? 1 : at(p * settle))
  return { at, settle, ease }
}

/** Ramer–Douglas–Peucker: drop points the curve can be drawn without. */
function simplify(points: [number, number][], tolerance: number): [number, number][] {
  if (points.length < 3) return points
  const [x0, y0] = points[0]!
  const [x1, y1] = points[points.length - 1]!
  let worst = 0
  let index = 0
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i]!
    const expected = y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
    const distance = Math.abs(y - expected)
    if (distance > worst) {
      worst = distance
      index = i
    }
  }
  if (worst <= tolerance) return [points[0]!, points[points.length - 1]!]
  const left = simplify(points.slice(0, index + 1), tolerance)
  const right = simplify(points.slice(index), tolerance)
  return [...left.slice(0, -1), ...right]
}

const round = (n: number, digits: number) => Number(n.toFixed(digits))

/** The spring as a CSS `linear()` easing, to pair with `settle` as the duration. */
export function springLinear(config: SpringConfig, tolerance = 0.002): string {
  const { ease } = spring(config)
  const samples = 200
  const points: [number, number][] = []
  for (let i = 0; i <= samples; i++) points.push([i / samples, ease(i / samples)])

  const stops = simplify(points, tolerance).map(([x, y], i, all) => {
    const value = round(y, 4)
    // First and last stops sit at 0% / 100% by default; everything else needs its position.
    return i === 0 || i === all.length - 1 ? `${value}` : `${value} ${round(x * 100, 2)}%`
  })
  return `linear(${stops.join(', ')})`
}

/**
 * The site's motion vocabulary. Bounce stays off for ordinary UI (menus, reveals,
 * presses) and is kept small where a bit of life is the point.
 */
export const SPRINGS = {
  /** Press and hover feedback on buttons, arrows, thumbnails. */
  press: { duration: 0.2, bounce: 0 },
  /** Menus, popovers, toasts entering. */
  snappy: { duration: 0.3, bounce: 0 },
  /** Scroll reveals, hero entrance, modal content: larger moves. */
  smooth: { duration: 0.5, bounce: 0 },
  /** Rare, playful state changes (theme icon swap, hover nudges). */
  bouncy: { duration: 0.45, bounce: 0.25 },
} as const satisfies Record<string, SpringConfig>

export type SpringName = keyof typeof SPRINGS

/**
 * The CSS block between the springs markers in main.css: one `--ease-spring-*` and
 * `--duration-spring-*` token per spring, and a `spring-*` utility that sets both on a
 * transition (it also feeds Tailwind's `--tw-ease` / `--tw-duration`, so it composes
 * with `transition-*`).
 */
export function springCss(): string {
  const names = Object.keys(SPRINGS) as SpringName[]
  const tokens = names.flatMap(name => [
    `  --ease-spring-${name}: ${springLinear(SPRINGS[name])};`,
    `  --duration-spring-${name}: ${Math.round(spring(SPRINGS[name]).settle * 1000)}ms;`,
  ])
  const utilities = names.map(name => [
    `@utility spring-${name} {`,
    `  --tw-ease: var(--ease-spring-${name});`,
    `  --tw-duration: var(--duration-spring-${name});`,
    `  transition-timing-function: var(--ease-spring-${name});`,
    `  transition-duration: var(--duration-spring-${name});`,
    `}`,
  ].join('\n'))
  return [':root {', ...tokens, '}', '', ...utilities, ''].join('\n') + '\n'
}
