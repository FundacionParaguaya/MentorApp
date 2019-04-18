import React, { Component } from 'react'
import { Provider } from 'react-redux'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import SplashScreen from 'react-native-splash-screen'
import NavigationWrapper from './src/components/NavWrapper'
import store from './src/redux/store'

// setup Mapbox token
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFubWFuNyIsImEiOiJjanQ4bTU0cjIwMmdkNDRtbnppdWoyNm81In0.SO7wd6FjGH2qtwXp7MGNRg'
)

class App extends Component {
  componentDidMount() {
    // hide splash screen
    SplashScreen.hide()
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
