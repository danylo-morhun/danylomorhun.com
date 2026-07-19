import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const stateStore = new Map<string, ReturnType<typeof ref>>()

function fakeUseState<T>(key: string, init: () => T) {
  if (!stateStore.has(key))
    stateStore.set(key, ref(init()))
  return stateStore.get(key)!
}

vi.stubGlobal('useState', fakeUseState)

const { useHeroReady } = await import('../app/composables/useHeroReady')

describe('useHeroReady', () => {
  beforeEach(() => {
    stateStore.clear()
  })

  it('defaults to not ready', () => {
    expect(useHeroReady().value).toBe(false)
  })

  it('shares state across every call site (Beams -> HeroSection sync)', () => {
    const beamsRef = useHeroReady()
    const heroSectionRef = useHeroReady()

    beamsRef.value = true

    expect(heroSectionRef.value).toBe(true)
  })

  it('keeps state isolated between independent stores (no cross-test leakage)', () => {
    useHeroReady().value = true
    stateStore.clear()

    expect(useHeroReady().value).toBe(false)
  })
})
