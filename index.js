import { AppRegistry, YellowBox } from 'react-native'
import { Sentry } from 'react-native-sentry'
import './src/i18n'
import App from './App'
import { name as appName } from './app.json'

// setup Sentry crash reports
Sentry.config(
  'https://5c0325e3929542f5a8541a247df43c52@sentry.io/1332316'
).install()

// remove useless 'debugger in background tab' warning
YellowBox.ignoreWarnings(['Remote debugger', 'unknown call: "relay:check"'])

AppRegistry.registerComponent(appName, () => App)
