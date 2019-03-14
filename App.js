import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { AsyncStorage } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
/* eslint-disable import/no-unresolved */
import BackgroundTask from 'react-native-background-task'
/* eslint-enable import/no-unresolved */
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import NavigationWrapper from './src/components/NavWrapper'
import store from './src/redux/store'
import { initImageCaching } from './src/cache'

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFubWFuNyIsImEiOiJjanQ4bTU0cjIwMmdkNDRtbnppdWoyNm81In0.SO7wd6FjGH2qtwXp7MGNRg'
)

// schedule a background task to check the images cache
BackgroundTask.define(() => {
  initImageCaching()
  BackgroundTask.finish()
})

class App extends Component {
  componentDidMount() {
    AsyncStorage.setItem('userVisitedDashboard', 'false')
    SplashScreen.hide()
    BackgroundTask.schedule()
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationWrapper />
      </Provider>
    )
  }
}

export default App
