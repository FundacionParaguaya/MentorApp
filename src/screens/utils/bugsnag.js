import { Client, Configuration } from 'bugsnag-react-native'

const configuration = new Configuration()
configuration.apiKey = '3a04462591f10c8ef4e129d2d0c35a9d'
configuration.notifyReleaseStages = ['beta', 'production']
configuration.releaseStage = 'production'

export const bugsnag = new Client(configuration)
