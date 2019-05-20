/* eslint-env detox/detox, jest */
describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should be able to type in username', async () => {
    await expect(element(by.id('username-input'))).toBeVisible()

    await element(by.id('username-input')).typeText('demo')
  })

  it('should be able to type in password', async () => {
    await expect(element(by.id('password-input'))).toBeVisible()

    await element(by.id('password-input')).typeText('demo')
  })
})
