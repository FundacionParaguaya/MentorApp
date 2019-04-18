import { createStackNavigator } from 'react-navigation'
import DrawerNavigator from './DrawerNavigator'
import LoginView from '../screens/Login'
import LoadingView from '../screens/Loading'

const LoginStack = createStackNavigator(
  {
    Login: { screen: LoginView },
    Loading: { screen: LoadingView }
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
)

export const DrawerNavigation = createStackNavigator(
  {
    DrawerStack: { screen: DrawerNavigator }
  },
  {
    headerMode: 'none'
  }
)

export default createStackNavigator(
  {
    loginStack: { screen: LoginStack },
    drawerStack: { screen: DrawerNavigation }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'loginStack'
  }
)
