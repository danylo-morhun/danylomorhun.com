/** Absolute URL for a site path, matching the canonical form (root has no trailing slash). */
export function absoluteUrl(siteUrl: string, path: string) {
  const root = siteUrl.replace(/\/+$/, '')
  return path === '/' ? root : `${root}${path}`
}
