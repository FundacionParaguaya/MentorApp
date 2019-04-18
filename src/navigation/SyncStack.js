import { createStackNavigator } from 'react-navigation'
import SyncView from '../screens/Sync'
import { generateNavOptions } from './helpers'

export default createStackNavigator({
  Sync: {
    screen: SyncView,
    navigationOptions: ({ navigation }) => generateNavOptions({ navigation })
  }
})
