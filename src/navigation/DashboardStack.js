import React from 'react'
import { createStackNavigator } from 'react-navigation'
import DashboardView from '../screens/Dashboard'
import Title from './Title'
import { generateNavStyles, addMenuIcon } from './helpers'

export default createStackNavigator(
  {
    Dashboard: {
      screen: DashboardView,
      navigationOptions: ({ navigation }) => ({
        ...generateNavStyles({ navigation }),
        ...addMenuIcon(navigation),
        headerTitle: <Title title="views.dashboard" />
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
