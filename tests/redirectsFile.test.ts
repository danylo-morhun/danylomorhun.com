import { describe, expect, it } from 'vitest'
import { redirectsFile } from '../shared/utils/redirectsFile'

describe('redirectsFile', () => {
  it('writes one line per routeRules redirect, 301 by default', () => {
    const file = redirectsFile({
      '/resume.pdf': { redirect: { to: '/Resume.pdf', statusCode: 301 } },
      '/old': { redirect: '/new' },
      '/temp': { redirect: { to: '/later', statusCode: 302 } },
      '/**': {},
    })
    expect(file.split('\n').slice(0, 3)).toEqual([
      '/resume.pdf /Resume.pdf 301',
      '/old /new 301',
      '/temp /later 302',
    ])
  })

  it('skips wildcard rules, which _redirects cannot express the same way', () => {
    expect(redirectsFile({ '/blog/**': { redirect: '/' } })).not.toContain('/blog/**')
  })

  it('ends with permanent trailing-slash redirects', () => {
    const lines = redirectsFile({}).trim().split('\n')
    expect(lines).toEqual(['/:a/ /:a 308', '/:a/:b/ /:a/:b 308', '/:a/:b/:c/ /:a/:b/:c 308'])
  })
})
