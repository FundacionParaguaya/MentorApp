/* eslint-env detox/detox, jest */
describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should be able to type in username', async () => {
    await expect(element(by.id('username-input'))).toBeVisible()
  })
})
