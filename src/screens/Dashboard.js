import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  UIManager,
  findNodeHandle
} from 'react-native'
import { Sentry } from 'react-native-sentry'
import { updateNav } from '../redux/actions'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Button from '../components/Button'
import Decoration from '../components/decoration/Decoration'
import RoundImage from '../components/RoundImage'
import DraftListItem from '../components/DraftListItem'
import globalStyles from '../globalStyles'
import { connect } from 'react-redux'
import colors from '../theme.json'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
export class Dashboard extends Component {
  acessibleComponent = React.createRef()

  componentDidMount() {
    const { survey, readonly, draftId } = this.props.nav

    // clear nav state if it's set to something
    if (survey || readonly || draftId) {
      this.props.updateNav({
        survey: null,
        readonly: false,
        draftId: null
      })
    }

    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(this.acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused
        )
      }, 1)
    }

    // set sentry login details
    Sentry.setUserContext({
      username: this.props.user.username,
      extra: {
        env: this.props.env
      }
    })
  }

  navigateToPendingSync = draft => {
    const { firstName, lastName } = draft.familyData.familyMembersList[0]

    this.props.navigation.navigate('Family', {
      familyName: `${firstName} ${lastName}`,
      familyLifemap: draft,
      isDraft: true,
      survey: this.props.surveys.find(survey => survey.id === draft.surveyId),
      activeTab: 'LifeMap'
    })
  }

  navigateToDraft = draft => {
    const survey = this.props.surveys.find(
      survey => survey.id === draft.surveyId
    )

    if (
      draft.progress.screen === 'Question' ||
      draft.progress.screen === 'Skipped' ||
      draft.progress.screen === 'Final' ||
      draft.progress.screen === 'Overview'
    ) {
      this.props.navigation.navigate('Overview', {
        resumeDraft: true,
        draft,
        survey
      })
    } else
      this.props.navigation.navigate(draft.progress.screen, {
        draft,
        survey,
        step: draft.progress.step,
        socioEconomics: draft.progress.socioEconomics
      })
  }
  navigateToSynced = item => {
    this.props.updateNav({
      survey: this.props.surveys.find(survey => survey.id === item.surveyId),
      draftId: item.draftId,
      readonly: true
    })
    this.props.navigation.navigate('Family', {
      familyName: item.familyData.familyMembersList[0].firstName,
      familyLifemap: item,
      draftId: item.draftId,
      isDraft: !item,
      survey: this.props.surveys.find(survey =>
        item ? survey.id === item.surveyId : null
      )
    })
  }
  handleClickOnListItem = item => {
    switch (item.status) {
      case 'Pending sync':
        this.navigateToPendingSync(item)
        break
      case 'Synced':
        this.navigateToSynced(item)
        break
      default:
        this.navigateToDraft(item)
    }
  }

  navigateToCreateLifemap = () => {
    this.props.navigation.navigate('Surveys')
  }

  render() {
    const { t, drafts } = this.props
    let valGreen = 0
    let valYellow = 0
    let valRed = 0
    if (typeof this.props.families !== 'undefined') {
      if (this.props.families.length) {
        this.props.families.forEach(el => {
          el.snapshotList[0].indicatorSurveyDataList.forEach(e => {
            if (e.value === 1) {
              valRed++
            } else if (e.value === 2) {
              valYellow++
            } else if (e.value === 3) {
              valGreen++
            }
          })
        })
      }
    }

    const list = drafts.slice().reverse()
    return (
      <View style={globalStyles.ViewMainContainer}>
        <ScrollView
          contentContainerStyle={
            drafts.length
              ? globalStyles.ScrollMainContainerNotCentered
              : globalStyles.ScrollMainContainerCentered
          }
        >
          <View ref={this.acessibleComponent} accessible={true}>
            <View>
              <View
                style={
                  drafts.length
                    ? globalStyles.container
                    : globalStyles.containerNoPadding
                }
              >
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Decoration>
                    <RoundImage source="family" />
                  </Decoration>
                  <View style={styles.familiesIcon}>
                    <Icon
                      name="face"
                      style={styles.familiesIconIcon}
                      size={60}
                    />
                  </View>

                  <Text style={{ ...styles.familiesCount }}>
                    {this.props.families.length} {t('views.families')}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                  }}
                >
                  <View style={styles.circleAndTextContainer}>
                    <View style={styles.circleContainer}>
                      <View style={styles.circleGreen} />
                    </View>
                    <Text style={styles.numberIndicator}>{valGreen}</Text>
                    <Text style={styles.colorIndicator}>Green</Text>
                  </View>

                  <View style={styles.circleAndTextContainer}>
                    <View style={styles.circleContainer}>
                      <View style={styles.circleYellow} />
                    </View>
                    <Text style={styles.numberIndicator}>{valYellow}</Text>
                    <Text style={styles.colorIndicator}>Yellow</Text>
                  </View>

                  <View style={styles.circleAndTextContainer}>
                    <View style={styles.circleContainer}>
                      <View style={styles.circleRed} />
                    </View>
                    <Text style={styles.numberIndicator}>{valRed}</Text>
                    <Text style={styles.colorIndicator}>Red</Text>
                  </View>
                </View>

                <Button
                style={{marginTop:20}}
                  id="create-lifemap"
                  text={t('views.createLifemap')}
                  colored
                  handleClick={this.navigateToCreateLifemap}
                />
              </View>
              {drafts.length ? (
                <View style={styles.borderBottom}>
                  <Text
                    style={{ ...globalStyles.subline, ...styles.listTitle }}
                  >
                    {t('views.latestDrafts')}
                  </Text>
                </View>
              ) : null}
              <FlatList
                style={{ ...styles.background }}
                data={list}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <DraftListItem
                    item={item}
                    handleClick={this.handleClickOnListItem}
                    lng={this.props.lng}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  numberIndicator: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 4
  },
  colorIndicator: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10
  },
  circleAndTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleGreen: {
    backgroundColor: colors.palegreen,
    width: 50,
    height: 50,
    borderRadius: 50
  },
  circleYellow: {
    backgroundColor: colors.palegold,
    width: 35,
    height: 35,
    borderRadius: 50
  },
  circleRed: {
    backgroundColor: colors.palered,
    width: 20,
    height: 20,
    borderRadius: 50
  },
  familiesIconIcon: {
    margin: 'auto'
  },
  familiesIcon: {
    top: 120,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 50
  },
  familiesCount: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  listTitle: {
    backgroundColor: colors.primary,
    height: 41,
    lineHeight: 41,
    flex: 1,
    textAlign: 'center'
  },
  borderBottom: {
    marginTop: 20,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  }
})

Dashboard.propTypes = {
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  updateNav: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  nav: PropTypes.object,
  offline: PropTypes.object,
  lng: PropTypes.string.isRequired,
  surveys: PropTypes.array,
  families: PropTypes.array
}

export const mapStateToProps = ({
  env,
  user,
  drafts,
  offline,
  string,
  surveys,
  families,
  nav
}) => ({
  env,
  user,
  drafts,
  offline,
  string,
  surveys,
  families,
  nav
})

const mapDispatchToProps = {
  updateNav
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
)
