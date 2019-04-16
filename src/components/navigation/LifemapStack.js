import React from 'react'
import { Text, StyleSheet, Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import SurveysView from '../../screens/Surveys'
import LifemapScreens from './LifemapScreens'
import { generateNavOptions } from './helpers'
import i18n from '../../i18n'
import colors from '../../theme.json'

export default createStackNavigator({
  Surveys: {
    screen: SurveysView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={styles.headerTitleStyle}
        >
          {i18n.t('views.createLifemap')}
        </Text>
      ),
      ...generateNavOptions({ navigation })
    })
  },
  ...LifemapScreens
})

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    marginLeft: 20,
    color: colors.black
  }
})
