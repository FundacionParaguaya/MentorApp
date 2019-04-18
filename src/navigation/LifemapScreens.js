import React from 'react'
import { Text, StyleSheet, Platform } from 'react-native'
import TermsView from '../screens/lifemap/Terms'
import SocioEconomicQuestionView from '../screens/lifemap/SocioEconomicQuestion'
import FinalView from '../screens/lifemap/Final'
import FamilyParticipantView from '../screens/lifemap/FamilyParticipant'
import FamilyMembersNamesView from '../screens/lifemap/FamilyMembersNames'
import QuestionView from '../screens/lifemap/Question'
import BeginLifemapView from '../screens/lifemap/BeginLifemap'
import LocationView from '../screens/lifemap/Location'
import SkippedView from '../screens/lifemap/Skipped'
import OverviewView from '../screens/lifemap/Overview'
import AddPriorityView from '../screens/lifemap/AddPriority'
import AddAchievementView from '../screens/lifemap/AddAchievement'
import FamilyMemberView from '../screens/lifemap/FamilyMember'
import i18n from '../i18n'
import { generateNavStyles } from './helpers'
import CustomHeaderSurvey from './CustomHeaderSurvey'
import colors from '../theme.json'

// Reusable object for all screens related to a draft
export default {
  Terms: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[styles.headerTitleStyle, { marginLeft: 20 }]}
        >
          {i18n.t('views.termsConditions')}
        </Text>
      ),
      ...generateNavStyles({ navigation, burgerMenu: false })
    })
  },
  Privacy: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[styles.headerTitleStyle, { marginLeft: 20 }]}
        >
          {i18n.t('views.privacyPolicy')}
        </Text>
      ),
      ...generateNavStyles({ navigation, burgerMenu: false })
    })
  },
  Location: {
    screen: LocationView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[
            styles.headerTitleStyle,
            { marginLeft: 'auto', marginRight: 'auto' }
          ]}
        >
          {i18n.t('views.location')}
        </Text>
      ),
      ...generateNavStyles({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  SocioEconomicQuestion: {
    screen: SocioEconomicQuestionView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  BeginLifemap: {
    screen: BeginLifemapView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[
            styles.headerTitleStyle,
            { marginLeft: 'auto', marginRight: 'auto' }
          ]}
        >
          {i18n.t('views.yourLifeMap')}
        </Text>
      ),
      ...generateNavStyles({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  Question: {
    screen: QuestionView,
    navigationOptions: ({ navigation }) => {
      const { survey, step } = navigation.state.params
      const activeQuestion = survey.surveyStoplightQuestions[step]
      const { questionText, dimension } = activeQuestion

      return {
        headerTitle: (
          <CustomHeaderSurvey
            navigation={navigation}
            title={questionText}
            dimension={dimension}
          />
        ),
        ...generateNavStyles({
          navigation,
          burgerMenu: false,
          shadowHeader: false,
          headerHeight: navigation.getParam('navigationHeight')
            ? navigation.getParam('navigationHeight') - 20
            : 66
        })
      }
    }
  },
  Skipped: {
    screen: SkippedView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[
            styles.headerTitleStyle,
            { marginLeft: 'auto', marginRight: 'auto' }
          ]}
        >
          {i18n.t('views.skippedIndicators')}
        </Text>
      ),
      ...generateNavStyles({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  Overview: {
    screen: OverviewView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[styles.headerTitleStyle, { marginLeft: 20 }]}
        >
          {i18n.t('views.yourLifeMap')}
        </Text>
      ),
      ...generateNavStyles({
        navigation,
        burgerMenu: false
      })
    })
  },
  AddPriority: {
    screen: AddPriorityView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[styles.headerTitleStyle, { marginLeft: 20 }]}
        >
          {i18n.t('views.yourLifeMap')}
        </Text>
      ),
      ...generateNavStyles({ navigation, burgerMenu: false })
    })
  },
  AddAchievement: {
    screen: AddAchievementView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[styles.headerTitleStyle, { marginLeft: 20 }]}
        >
          {i18n.t('views.yourLifeMap')}
        </Text>
      ),
      ...generateNavStyles({ navigation, burgerMenu: false })
    })
  },
  Final: {
    screen: FinalView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[styles.headerTitleStyle, { marginLeft: 20 }]}
        >
          {i18n.t('general.thankYou')}
        </Text>
      ),
      ...generateNavStyles({
        navigation,
        burgerMenu: false
      })
    })
  },
  FamilyParticipant: {
    screen: FamilyParticipantView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  FamilyMembersNames: {
    screen: FamilyMembersNamesView,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={[
            styles.headerTitleStyle,
            { marginLeft: 'auto', marginRight: 'auto' }
          ]}
        >
          {i18n.t('views.familyMembers')}
        </Text>
      ),
      ...generateNavStyles({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  FamilyMember: {
    screen: FamilyMemberView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  }
}

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
    color: colors.black
  }
})
