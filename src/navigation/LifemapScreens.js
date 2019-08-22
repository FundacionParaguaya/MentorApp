import { addCloseIcon, generateNavStyles } from './helpers'

import BeginLifemapView from '../screens/lifemap/BeginLifemap'
import CustomHeaderSurvey from './CustomHeaderSurvey'
import FamilyMemberView from '../screens/lifemap/FamilyMember'
import FamilyMembersNamesView from '../screens/lifemap/FamilyMembersNames'
import FamilyParticipantView from '../screens/lifemap/FamilyParticipant'
import FinalView from '../screens/lifemap/Final'
import LocationView from '../screens/lifemap/Location'
import OverviewView from '../screens/lifemap/Overview'
import PrioritiesView from '../screens/lifemap/Priorities'
import QuestionView from '../screens/lifemap/Question'
import React from 'react'
import SkippedView from '../screens/lifemap/Skipped'
import SocioEconomicQuestionView from '../screens/lifemap/SocioEconomicQuestion'
import TermsView from '../screens/lifemap/Terms'
import Title from './Title'

// Reusable object for all screens related to a draft
export default {
  Terms: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title
          title="views.termsConditions"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
      )
    })
  },
  Privacy: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title
          title="views.privacyPolicy"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
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
        <Title
          title="views.primaryParticipant"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
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
  Priorities: {
    screen: PrioritiesView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation, shadowHeader: false }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.lifemap.priorities" style={{ marginLeft: 20 }} />
      )
    })
  },

  Final: {
    screen: FinalView,
    navigationOptions: () => ({
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
