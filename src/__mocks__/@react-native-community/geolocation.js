export default {
  offlineManager: {
    getPacks: jest.fn(
      () => new Promise(resolve => resolve([{ name: 'First' }]))
    )
  },
  getCurrentPosition: jest.fn(callback =>
    callback({
      coords: {
        latitude: 44,
        longitude: 45,
        accuracy: 15
      }
    })
  )
}
