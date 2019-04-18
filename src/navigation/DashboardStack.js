import { createStackNavigator } from 'react-navigation'
import DashboardView from '../screens/Dashboard'
import { generateNavStyles, addMenuIcon } from './helpers'

export default createStackNavigator({
  Dashboard: {
    screen: DashboardView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation }),
      ...addMenuIcon(navigation)
    })
  }
})
