import React, {Component} from 'react';
import {Provider} from 'react-redux';
import { LogBox } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import 'react-native-gesture-handler';

import Navigation from './src/navigation';
import store from './src/redux/store';
const TestFairy = require('react-native-testfairy');
const nodeEnv = process.env;
// setup Mapbox token
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZGFubWFuNyIsImEiOiJjanQ4bTU0cjIwMmdkNDRtbnppdWoyNm81In0.SO7wd6FjGH2qtwXp7MGNRg',
);

LogBox.ignoreLogs([
 'Non-serializable values were found in the navigation state',
]);

class App extends Component {
  componentDidMount() {
    nodeEnv.NODE_ENV === 'production' ? TestFairy.begin('SDK-diRMlrTh') : null;
  }
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}

export default App;
