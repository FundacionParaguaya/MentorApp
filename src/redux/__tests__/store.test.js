import store, { getHydrationState } from '../store'

describe('store', () => {
  it('getHydrationState returns proper state', () => {
    expect(getHydrationState()).toBe(false)
  })
  it('store has all reducers', () => {
    expect(store.getState()).toEqual(
      expect.objectContaining({
        env: 'production',
        drafts: expect.any(Array),
        families: expect.any(Array),
        surveys: expect.any(Array),
        offline: expect.any(Object),
        user: expect.any(Object)
      })
    )
  })
})
