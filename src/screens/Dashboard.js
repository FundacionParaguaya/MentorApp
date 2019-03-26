import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, FlatList } from 'react-native'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Button from '../components/Button'
import Decoration from '../components/decoration/Decoration'
import RoundImage from '../components/RoundImage'
import DraftListItem from '../components/DraftListItem'
import globalStyles from '../globalStyles'
import { connect } from 'react-redux'
import colors from '../theme.json'

export class Dashboard extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Dashboard')
    }
  }
  slowLoadingTimer
  clearTimers = () => {
    clearTimeout(this.slowLoadingTimer)
  }
  updateTitle = () =>
    this.props.navigation.setParams({
      title: this.props.t('views.dashboard')
    })
  componentDidMount() {
    this.updateTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lng !== this.props.lng) {
      this.updateTitle()
    }
  }

  componentWillUnmount() {
    this.clearTimers()
  }
  navigateToDraft = draft => {
    if (
      draft.progress.screen !== 'Question' &&
      draft.progress.screen !== 'Skipped' &&
      draft.progress.screen !== 'Final' &&
      draft.progress.screen !== 'Overview'
    ) {
      this.props.navigation.navigate(draft.progress.screen, {
        draftId: draft.draftId,
        survey: this.props.surveys.find(survey => survey.id === draft.surveyId),
        step: draft.progress.step,
        socioEconomics: draft.progress.socioEconomics
      })
    } else
      this.props.navigation.navigate('Overview', {
        draftId: draft.draftId,
        survey: this.props.surveys.find(survey => survey.id === draft.surveyId),
        resumeDraft: true
      })
  }

  navigateToSynced = draft => {
    const { firstName, lastName } = draft.familyData.familyMembersList[0]

    const filteredFamily = this.props.families.find(family => {
      return (
        family.name.toLowerCase() === `${firstName} ${lastName}`.toLowerCase() &&
        family.snapshotList &&
        family.snapshotList.length &&
        family.snapshotList.some(snapshot => snapshot.surveyId === draft.surveyId && JSON.stringify(snapshot.familyData) === JSON.stringify(snapshot.familyData)
        )
      )
    })

    this.props.navigation.navigate('Family', {
      familyName: filteredFamily.name,
      familyLifemap: filteredFamily.snapshotList ? filteredFamily.snapshotList[0] : filteredFamily.draft,
      isDraft: !filteredFamily.snapshotList,
      survey: this.props.surveys.find(
        survey =>
          filteredFamily.snapshotList
            ? survey.id === filteredFamily.snapshotList[0].surveyId
            : survey.id === filteredFamily.draft.surveyId
      ),
      activeTab: 'LifeMap'
    })
  }

  render() {
    const { t, navigation, drafts } = this.props

    const list = drafts.slice().reverse()
    return (
      <ScrollView style={globalStyles.background}>
        {this.props.offline.outbox.length && navigation.getParam('firstTimeVisitor') ? null : (
          <View>
            <View style={globalStyles.container}>
              <Decoration>
                <RoundImage source="family" />
              </Decoration>
              <Button
                text={t('views.createLifemap')}
                colored
                handleClick={() => this.props.navigation.navigate('Surveys')}
              />
            </View>
            {drafts.length ? (
              <View style={styles.borderBottom}>
                <Text style={{ ...globalStyles.subline, ...styles.listTitle }}>{t('views.latestDrafts')}</Text>
              </View>
            ) : null}
            <FlatList
              style={{ ...styles.background }}
              data={list}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <DraftListItem
                  item={item}
                  handleClick={() => {
                    item.status === 'Synced' ? this.navigateToSynced(item) : this.navigateToDraft(item)
                  }}
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
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
  drafts: PropTypes.array.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  offline: PropTypes.object,
  lng: PropTypes.string.isRequired,
  surveys: PropTypes.array,
  families: PropTypes.array
}

const mapStateToProps = ({ env, user, drafts, offline, string, surveys, families }) => ({
  env,
  user,
  drafts,
  offline,
  string,
  surveys,
  families
})

export default withNamespaces()(connect(mapStateToProps)(Dashboard))
