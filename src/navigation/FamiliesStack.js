import React from 'react'
import { createStackNavigator } from 'react-navigation'
import FamiliesView from '../screens/Families'
import LifemapScreens from './LifemapScreens'
import FamilyView from '../screens/Family'
import Title from './Title'
import { generateNavStyles, addMenuIcon } from './helpers'

export default createStackNavigator(
  {
    Families: {
      screen: FamiliesView,
      navigationOptions: ({ navigation }) => ({
        ...generateNavStyles({ navigation }),
        ...addMenuIcon(navigation),
        headerTitle: <Title title="views.families" />
      })
    },
    Family: {
      screen: FamilyView,
      navigationOptions: ({ navigation }) => ({
        ...generateNavStyles({ navigation })
      })
    },
    ...LifemapScreens
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
