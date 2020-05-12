export default {
  fetch: jest.fn(() => new Promise(resolve => resolve(true))),
  getCurrentState: jest.fn(),
  addEventListener: jest.fn(callback =>
    callback({
      isConnected: false
    })
  ),
  removeListeners: jest.fn()
}
