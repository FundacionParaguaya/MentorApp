import { createStackNavigator } from 'react-navigation'
import SyncView from '../screens/Sync'
import { generateNavStyles, addMenuIcon } from './helpers'

export default createStackNavigator({
  Sync: {
    screen: SyncView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation }),
      ...addMenuIcon(navigation)
    })
  }
})
