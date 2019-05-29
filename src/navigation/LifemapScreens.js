import React from 'react'
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
import Title from './Title'
import { generateNavStyles, addCloseIcon } from './helpers'
import CustomHeaderSurvey from './CustomHeaderSurvey'

// Reusable object for all screens related to a draft
export default {
  Terms: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.termsConditions" style={{ marginLeft: 20 }} />
      )
    })
  },
  Privacy: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.privacyPolicy" style={{ marginLeft: 20 }} />
      )
    })
  },
  FamilyParticipant: {
    screen: FamilyParticipantView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({
        navigation,
        shadowHeader: false
      }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.primaryParticipant" style={{ marginLeft: 20 }} />
      )
    })
  },
  FamilyMembersNames: {
    screen: FamilyMembersNamesView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation, hadowHeader: false }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title
          title="views.familyMembers"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      )
    })
  },
  Location: {
    screen: LocationView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation, shadowHeader: false }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title
          title="views.location"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      )
    })
  },
  SocioEconomicQuestion: {
    screen: SocioEconomicQuestionView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation, shadowHeader: false }),
      ...addCloseIcon(navigation)
    })
  },
  BeginLifemap: {
    screen: BeginLifemapView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation, shadowHeader: false }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title
          title="views.yourLifeMap"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      )
    })
  },
  Question: {
    screen: QuestionView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({
        navigation,
        shadowHeader: false,
        headerHeight: navigation.getParam('navigationHeight')
          ? navigation.getParam('navigationHeight') - 20
          : 66
      }),
      ...addCloseIcon(navigation),
      headerTitle: <CustomHeaderSurvey navigation={navigation} />
    })
  },
  Skipped: {
    screen: SkippedView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation, shadowHeader: false }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title
          title="views.skippedIndicators"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      )
    })
  },
  Overview: {
    screen: OverviewView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation, shadowHeader: false }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.yourLifeMap" style={{ marginLeft: 20 }} />
      )
    })
  },
  AddPriority: {
    screen: AddPriorityView,
    navigationOptions: ({ navigation }) => ({
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.yourLifeMap" style={{ marginLeft: 20 }} />
      )
    })
  },
  AddAchievement: {
    screen: AddAchievementView,
    navigationOptions: ({ navigation }) => ({
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.yourLifeMap" style={{ marginLeft: 20 }} />
      )
    })
  },
  Final: {
    screen: FinalView,
    navigationOptions: ({ navigation }) => ({
      ...addCloseIcon(navigation),
      headerTitle: <Title title="general.thankYou" style={{ marginLeft: 20 }} />
    })
  },
  FamilyMember: {
    screen: FamilyMemberView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({
        navigation,
        shadowHeader: false
      })
    })
  }
}
