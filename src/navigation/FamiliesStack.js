import React from 'react'
import { createStackNavigator } from 'react-navigation'
import FamiliesView from '../screens/Families'
import LifemapScreens from './LifemapScreens'
import FamilyView from '../screens/Family'
import Title from './Title'
import { generateNavStyles, addMenuIcon, addCloseIcon } from './helpers'
import TheFamilyView from '../screens/TheFamily'

export default createStackNavigator(
  {
    Families: {
      screen: FamiliesView,
      navigationOptions: ({ navigation }) => {
        return navigation.getParam('retakeSurvey')
          ? {
              ...generateNavStyles({ navigation, shadowHeader: false }),
              headerTitle: <Title title="Choose family" centered />
            }
          : {
              ...generateNavStyles({ navigation }),
              ...addMenuIcon(navigation),
              headerTitle: <Title title="views.families" />
            }
      }
    },
    Family: {
      screen: FamilyView,
      navigationOptions: ({ navigation }) => {
        return navigation.getParam('retakeSurvey')
          ? {
              ...generateNavStyles({ navigation , shadowHeader: false }),
              ...addCloseIcon(navigation)
            }
          : {
              ...generateNavStyles({ navigation })
            }
      }
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
