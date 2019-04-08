import React from 'react'
import TermsView from '../../screens/lifemap/Terms'
import SocioEconomicQuestionView from '../../screens/lifemap/SocioEconomicQuestion'
import FinalView from '../../screens/lifemap/Final'
import FamilyParticipantView from '../../screens/lifemap/FamilyParticipant'
import FamilyMembersNamesView from '../../screens/lifemap/FamilyMembersNames'
import QuestionView from '../../screens/lifemap/Question'
import BeginLifemapView from '../../screens/lifemap/BeginLifemap'
import LocationView from '../../screens/lifemap/Location'
import SkippedView from '../../screens/lifemap/Skipped'
import OverviewView from '../../screens/lifemap/Overview'
import AddPriorityView from '../../screens/lifemap/AddPriority'
import AddAchievementView from '../../screens/lifemap/AddAchievement'
import FamilyMemberView from '../../screens/lifemap/FamilyMember'
import i18n from '../../i18n'
import { generateNavOptions } from './helpers'
import CustomHeaderSurvey from './CustomHeaderSurvey'

// Reusable object for all screens related to a draft
export default {
  Terms: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.termsConditions'),
      ...generateNavOptions({ navigation, burgerMenu: false })
    })
  },
  Privacy: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.privacyPolicy'),
      ...generateNavOptions({ navigation, burgerMenu: false })
    })
  },
  Location: {
    screen: LocationView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.location'),
      ...generateNavOptions({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  SocioEconomicQuestion: {
    screen: SocioEconomicQuestionView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavOptions({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  BeginLifemap: {
    screen: BeginLifemapView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.yourLifeMap'),
      ...generateNavOptions({
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
      const title = activeQuestion.questionText
      const dimension = activeQuestion.dimension

      return {
        headerTitle: <CustomHeaderSurvey title={title} dimension={dimension} />,
        ...generateNavOptions({
          navigation,
          burgerMenu: false,
          shadowHeader: false
        })
      }
    }
  },
  Skipped: {
    screen: SkippedView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.skippedIndicators'),
      ...generateNavOptions({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  Overview: {
    screen: OverviewView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.yourLifeMap'),
      ...generateNavOptions({
        navigation,
        burgerMenu: false
      })
    })
  },
  AddPriority: {
    screen: AddPriorityView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.yourLifeMap'),
      ...generateNavOptions({ navigation, burgerMenu: false })
    })
  },
  AddAchievement: {
    screen: AddAchievementView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.yourLifeMap'),
      ...generateNavOptions({ navigation, burgerMenu: false })
    })
  },
  Final: {
    screen: FinalView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('general.thankYou'),
      ...generateNavOptions({
        navigation,
        burgerMenu: false
      })
    })
  },
  FamilyParticipant: {
    screen: FamilyParticipantView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavOptions({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  FamilyMembersNames: {
    screen: FamilyMembersNamesView,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('views.familyMembers'),
      ...generateNavOptions({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  },
  FamilyMember: {
    screen: FamilyMemberView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavOptions({
        navigation,
        burgerMenu: false,
        shadowHeader: false
      })
    })
  }
}
