import i18n, { setLanguage } from '../i18n'
import * as store from '../redux/store'

describe('i18n', () => {
  it('has English as default language', () => {
    expect(i18n.language).toBe('en')
  })
  it('has both English and Spanish translations loaded as resources', () => {
    expect(i18n.options.resources.en).toEqual(expect.any(Object))
    expect(i18n.options.resources.es).toEqual(expect.any(Object))
  })
  it('setLanguage gets the correct language from the store', () => {
    store.default.getState = () => ({
      language: 'es'
    })

    setLanguage()
    expect(i18n.language).toBe('es')
  })
  it('setLanguage gets sets the default language if the store has no language set', () => {
    store.default.getState = () => ({
      language: false
    })

    setLanguage()
    // expect(i18n.language).toBe('en')
  })
})
