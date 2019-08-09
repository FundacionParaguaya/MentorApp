import React, { Component } from 'react'
import { Provider } from 'react-redux'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Navigation from './src/navigation'
import store from './src/redux/store'
const TestFairy = require('react-native-testfairy')
const nodeEnv = process.env
// setup Mapbox token
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFubWFuNyIsImEiOiJjanQ4bTU0cjIwMmdkNDRtbnppdWoyNm81In0.SO7wd6FjGH2qtwXp7MGNRg'
)

class App extends Component {
  componentDidMount() {
    nodeEnv.NODE_ENV === 'production' ? TestFairy.begin('SDK-diRMlrTh') : null
  }
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    )
  }
}

export default App
