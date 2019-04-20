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
import Title from './Title'
import { generateNavStyles, addCloseIcon } from './helpers'
import CustomHeaderSurvey from './CustomHeaderSurvey'
import colors from '../theme.json'

// Reusable object for all screens related to a draft
export default {
  Terms: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.termsConditions" style={{ marginLeft: 20 }} />
      )
    })
  },
  Privacy: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => ({
      ...generateNavStyles({ navigation }),
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
      ...generateNavStyles({ navigation }),
      ...addCloseIcon(navigation),
      headerTitle: (
        <Title title="views.yourLifeMap" style={{ marginLeft: 20 }} />
      )
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
