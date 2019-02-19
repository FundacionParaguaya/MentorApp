import { createStackNavigator } from 'react-navigation'
import FamiliesView from '../../screens/Families'
import FamilyView from '../../screens/Family'
import { generateNavOptions } from './helpers'
import i18n from '../../i18n'

export default createStackNavigator({
  Families: {
    screen: FamiliesView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.families'),
      ...generateNavOptions({ navigation })
    })
  },
  Family: {
    screen: FamilyView,
    navigationOptions: ({ navigation }) => ({
      title: `Family ${navigation.state.params.family}`,
      ...generateNavOptions({ navigation, burgerMenu: false })
    })
  }
})
