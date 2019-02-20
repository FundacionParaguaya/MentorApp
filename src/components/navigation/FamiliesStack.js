import { createStackNavigator } from 'react-navigation'
import FamiliesView from '../../screens/Families'
import FamilyView from '../../screens/Family'
import LifemapScreens from './LifemapScreens'
import { generateNavOptions } from './helpers'
import i18n from '../../i18n'

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
