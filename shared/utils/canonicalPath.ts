/**
 * The one URL a page should live at: lowercase, no trailing slash.
 * Returns null when the path is already canonical.
 */
export function canonicalPath(path: string): string | null {
  const [pathname = '/', query] = path.split(/\?(.*)/s)
  let canonical = pathname.toLowerCase()
  if (canonical.length > 1) canonical = canonical.replace(/\/+$/, '') || '/'
  if (canonical === pathname) return null
  return query === undefined ? canonical : `${canonical}?${query}`
}
