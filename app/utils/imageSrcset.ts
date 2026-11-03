import variants from '~/data/image-variants.json'

/** Builds a srcset from the widths `scripts/generate-image-variants.mjs` wrote for `src`. */
export function imageSrcset(src: string) {
  const entry = (variants as Record<string, { width: number, variants: number[] }>)[src]
  if (!entry) return undefined

  const base = src.replace(/\.webp$/, '')
  return [
    ...entry.variants.map(width => `${base}-${width}w.webp ${width}w`),
    `${src} ${entry.width}w`,
  ].join(', ')
}
