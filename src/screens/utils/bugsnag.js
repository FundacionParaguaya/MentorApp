import { Client, Configuration } from 'bugsnag-react-native'

const configuration = new Configuration()
configuration.apiKey = '3a04462591f10c8ef4e129d2d0c35a9d'

// configuration.registerBeforeSendCallback(report => {
//   report.metadata = {
//     ...(report.metaData || {}),
//    reduxState: store.getState()
//   }
//   // if (__DEV__) {
//   //   console.warn('bugsnag report suppressed', report)
//   //   return false
//   // }
// })

const bugsnag = new Client(configuration)

export default bugsnag
