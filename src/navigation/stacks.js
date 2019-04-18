import { createStackNavigator } from 'react-navigation'
import DrawerNavigator from './DrawerNavigator'
import LoginView from '../screens/Login'
import LoadingView from '../screens/Loading'

export const LoginStack = createStackNavigator(
  {
    Login: { screen: LoginView },
    Loading: { screen: LoadingView }
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
)

// The drawer nav doesn't have it's own way of showing a menu toggle icon,
// so we put it as a part of the App stack. This is also where we control which
// stack has a header bar, which stack to show if the user us not authenticated.
export const AppStack = createStackNavigator(
  {
    Drawer: {
      screen: DrawerNavigator
    }
  },
  {
    initialRouteName: 'Drawer',
    headerMode: 'none'
  }
)

export const LoadingStack = createStackNavigator(
  {
    Loading: { screen: LoadingView }
  },
  {
    initialRouteName: 'Loading',
    headerMode: 'none'
  }
)
