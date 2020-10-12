import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import PropTypes from 'prop-types';
import SplashScreen from 'react-native-splash-screen';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/Login';
import LoadingScreen from '../screens/Loading';
import {setDimensions} from '../redux/actions';

// import RootStack from './stacks'
const Stack = createStackNavigator();

export class NavWrapper extends Component {
  state = {
    loading: true,
  };
  componentDidMount() {
    this.dimensionChange();
    Dimensions.addEventListener('change', this.dimensionChange);
    this.setState({loading: false});
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.hydration && this.props.hydration) {
      SplashScreen.hide();   
    }
  }

  dimensionChange = () => {
    this.props.setDimensions({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      scale: Dimensions.get('window').scale,
    });
  };

  // determine which stack to show based on synced property
  render() {
    const {hydration} = this.props;

    // wait for store hydration to show the app
    return hydration && !this.state.loading ? (
      <View style={styles.container} testID="app-container">
        <NavigationContainer>
          <Stack.Navigator>
            {!this.props.user.token && (
              <Stack.Screen
                options={{headerShown: false, animationEnabled: false}}
                name="Login"
                component={LoginScreen}
              />
            )}

            <Stack.Screen
              options={{headerShown: false, animationEnabled: false}}
              name="Loading"
              component={LoadingScreen}
            />
            <Stack.Screen
              options={{headerShown: false, animationEnabled: false}}
              name="DrawerStack"
              component={DrawerNavigator}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

NavWrapper.propTypes = {
  user: PropTypes.object.isRequired,
  sync: PropTypes.object.isRequired,
  hydration: PropTypes.bool.isRequired,
  setDimensions: PropTypes.func.isRequired,
};

const mapStateToProps = ({user, sync, dimensions, hydration}) => ({
  user,
  sync,
  dimensions,
  hydration,
});

const mapDispatchToProps = {
  setDimensions,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavWrapper);
