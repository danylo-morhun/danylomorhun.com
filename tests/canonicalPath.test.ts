import { describe, expect, it } from 'vitest'
import { canonicalPath } from '../shared/utils/canonicalPath'

describe('canonicalPath', () => {
  it('leaves canonical paths alone', () => {
    expect(canonicalPath('/')).toBeNull()
    expect(canonicalPath('/uk/work/grx-pay')).toBeNull()
    expect(canonicalPath('/work/grx-pay?ref=cv')).toBeNull()
  })

  it('lowercases', () => {
    expect(canonicalPath('/WORK/grx-pay')).toBe('/work/grx-pay')
  })

  it('drops trailing slashes but keeps the root', () => {
    expect(canonicalPath('/uk/')).toBe('/uk')
    expect(canonicalPath('//')).toBe('/')
  })

  it('keeps the query string as is', () => {
    expect(canonicalPath('/Work/?Ref=CV')).toBe('/work?Ref=CV')
  })
})
