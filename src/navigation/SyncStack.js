import React from 'react'
import { createStackNavigator } from 'react-navigation'
import SyncView from '../screens/Sync'
import Title from './Title'
import { generateNavStyles, addMenuIcon } from './helpers'

export default createStackNavigator(
  {
    Sync: {
      screen: SyncView,
      navigationOptions: ({ navigation }) => ({
        ...generateNavStyles({ navigation }),
        ...addMenuIcon(navigation),
        headerTitle: <Title title="views.synced" />
      })
    }
  },
  {
    transitionConfig: () => ({
      screenInterpolator: () => null,
      transitionSpec: {
        duration: 0
      }
    })
  }
)
