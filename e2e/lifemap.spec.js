/* eslint-env detox/detox, jest */
describe('Login', () => {
  it('should be able to type in username', async () => {
    await expect(element(by.id('username-input'))).toBeVisible()

    await element(by.id('username-input')).typeText('demo')

    await element(by.id('app-container')).tap()
  })

  it('should be able to type in password', async () => {
    await expect(element(by.id('password-input'))).toBeVisible()

    await element(by.id('password-input')).typeText('demo')

    await element(by.id('app-container')).tap()
  })

  it('should be able to login', async () => {
    await expect(element(by.id('login-button'))).toBeVisible()

    await element(by.id('login-button')).tap()
  })
})
