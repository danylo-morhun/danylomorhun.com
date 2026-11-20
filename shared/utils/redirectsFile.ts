interface RouteRule {
  redirect?: string | { to: string, statusCode?: number }
}

// Cloudflare static assets are served before the worker, so redirects that must win over a
// prerendered file live in a `_redirects` file: every routeRules redirect, plus a permanent
// redirect from a trailing slash to the canonical URL (up to three path segments).
export function redirectsFile(routeRules: Record<string, RouteRule>): string {
  const lines: string[] = []
  for (const [path, rule] of Object.entries(routeRules)) {
    if (!rule.redirect || path.includes('*')) continue
    const { to, statusCode = 301 } = typeof rule.redirect === 'string' ? { to: rule.redirect } : rule.redirect
    lines.push(`${path} ${to} ${statusCode}`)
  }
  lines.push(
    '/:a/ /:a 308',
    '/:a/:b/ /:a/:b 308',
    '/:a/:b/:c/ /:a/:b/:c 308',
  )
  return lines.join('\n') + '\n'
}
