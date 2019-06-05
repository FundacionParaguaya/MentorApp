import React from 'react'
import { createStackNavigator } from 'react-navigation'
import Title from './Title'
import SurveysView from '../screens/Surveys'
import LifemapScreens from './LifemapScreens'
import { generateNavStyles, addMenuIcon } from './helpers'

export default createStackNavigator(
  {
    Surveys: {
      screen: SurveysView,
      navigationOptions: ({ navigation }) => ({
        ...addMenuIcon(navigation),
        headerTitle: <Title title="views.createLifemap" />
      })
    },
    ...LifemapScreens
  },
  {
    initialRouteName: 'Surveys',
    defaultNavigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation })
    }),
    transitionConfig: () => ({
      screenInterpolator: () => null,
      transitionSpec: {
        duration: 0
      }
    })
  }
)
