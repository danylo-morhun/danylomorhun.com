/** Flips true when the first-load intro lifts, which is the hero entrance's cue. */
export function useHeroIntro() {
  return useState('hero-intro-done', () => false)
}
