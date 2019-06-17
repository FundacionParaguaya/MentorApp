import React from 'react'
import { createStackNavigator } from 'react-navigation'
import Title from './Title'
import SurveysView from '../screens/Surveys'
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
        return {
          ...generateNavStyles({
            navigation,
            shadowHeader: navigation.getParam('retakeSurvey') ? false : true
          }),
          ...(navigation.getParam('retakeSurvey')
            ? addCloseIcon(navigation)
            : addMenuIcon(navigation)),
          headerTitle: (
            <Title
              title={
                navigation.getParam('retakeSurvey')
                  ? 'Choose family'
                  : 'views.families'
              }
            />
          )
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
