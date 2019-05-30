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
    TheFamily: {
      screen: TheFamilyView,
      navigationOptions: ({ navigation }) => ({
        ...generateNavStyles({ navigation }),
        ...addCloseIcon(navigation),
        headerTitle: <Title title="The family" />
      })
    },
    Families: {
      screen: FamiliesView,
      navigationOptions: ({ navigation }) => {
        return navigation.getParam('retakeLifeMap')
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
