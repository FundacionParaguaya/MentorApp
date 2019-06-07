import React from 'react'
import { createStackNavigator } from 'react-navigation'
import Title from './Title'
import SurveysView from '../screens/Surveys'
import TheFamilyView from '../screens/TheFamily'
import LifemapScreens from './LifemapScreens'
import { generateNavStyles, addMenuIcon, addCloseIcon } from './helpers'

export default createStackNavigator(
  {
    TheFamily: {
      screen: TheFamilyView,
      navigationOptions: ({ navigation }) => ({
        ...generateNavStyles({ navigation }),
        ...addCloseIcon(navigation),
        headerTitle: <Title title="The family" />
      })
    },
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
