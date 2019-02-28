import { createStackNavigator } from 'react-navigation'
import FamiliesView from '../../screens/Families'
import LifemapScreens from './LifemapScreens'
import FamilyView from '../../screens/Family'
import { generateNavOptions } from './helpers'

export default createStackNavigator({
  Families: {
    screen: FamiliesView,
    navigationOptions: ({ navigation }) => generateNavOptions({ navigation })
  },
  Family: {
    screen: FamilyView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavOptions({ navigation, burgerMenu: false })
    })
  },
  ...LifemapScreens
})
