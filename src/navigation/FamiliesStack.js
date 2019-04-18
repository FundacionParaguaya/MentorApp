import { createStackNavigator } from 'react-navigation'
import FamiliesView from '../screens/Families'
import LifemapScreens from './LifemapScreens'
import FamilyView from '../screens/Family'
import { generateNavStyles, addMenuIcon } from './helpers'

export default createStackNavigator({
  Families: {
    screen: FamiliesView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation }),
      ...addMenuIcon(navigation)
    })
  },
  Family: {
    screen: FamilyView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation })
    })
  },
  ...LifemapScreens
})
