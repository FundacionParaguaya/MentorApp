import React from 'react'
import { createStackNavigator } from 'react-navigation'
import Title from './Title'
import SurveysView from '../screens/Surveys'
import TheFamilyView from '../screens/TheFamily'
import FamiliesView from '../screens/Families'
import LifemapScreens from './LifemapScreens'
import { generateNavStyles, addMenuIcon, addCloseIcon } from './helpers'

export default createStackNavigator(
  {
    Surveys: {
      screen: SurveysView,
      navigationOptions: ({ navigation }) => ({
        ...addMenuIcon(navigation),
        headerTitle: <Title title="views.createLifemap" />
      })
    },
    ChooseFamily: {
      screen: FamiliesView,
      navigationOptions: ({ navigation }) => {
        return navigation.getParam('retakeSurvey')
          ? {
              ...generateNavStyles({ navigation }),
              ...addCloseIcon(navigation),
              headerTitle: <Title title="Choose family" />
            }
          : {
              ...generateNavStyles({ navigation }),
              ...addMenuIcon(navigation),
              headerTitle: <Title title="views.families" />
            }
      }
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
