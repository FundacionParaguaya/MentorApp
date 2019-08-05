export default {
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
