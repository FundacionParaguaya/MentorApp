import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
  findNodeHandle
} from 'react-native'
import { connect } from 'react-redux'

import SyncInProgress from '../components/sync/SyncInProgress'
import SyncListItem from '../components/sync/SyncListItem'
import SyncOffline from '../components/sync/SyncOffline'
import SyncRetry from '../components/sync/SyncRetry'
import SyncUpToDate from '../components/sync/SyncUpToDate'
import { url } from '../config'
import globalStyles from '../globalStyles'
import { submitDraft, submitDraftWithImages } from '../redux/actions'
import { screenSyncScreenContent } from '../screens/utils/accessibilityHelpers'
import { prepareDraftForSubmit } from './utils/helpers'

export class Sync extends Component {
  acessibleComponent = React.createRef()

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

  retrySubmittingAllDrafts = () => {
    const draftsWithError = this.props.drafts.filter(
      draft => draft.status === 'Sync error'
    )

    draftsWithError.forEach(draft => {
      console.log('sanitazedDraft in SYNC')
      const sanitazedDraft = prepareDraftForSubmit(
        draft,
        this.props.surveys.find(survey => survey.id === draft.surveyId)
      )

      if (draft.pictures && draft.pictures.length > 0) {
        this.props.submitDraftWithImages(
          url[this.props.env],
          this.props.user.token,
          sanitazedDraft.draftId,
          {
            ...sanitazedDraft
            //sendEmail: this.state.sendEmailFlag
          }
        )
      } else {
        this.props.submitDraft(
          url[this.props.env],
          this.props.user.token,
          sanitazedDraft.draftId,
          {
            ...sanitazedDraft,
            //sendEmail: this.state.sendEmailFlag,
            pictures: []
          }
        )
      }

      setTimeout(() => {
        this.props.navigation.popToTop()
        this.props.navigation.navigate('Dashboard')
      }, 500)
    })
  }

  componentDidMount() {
    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(this.acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused
        )
      }, 1)
    }
  }

  render() {
    const { drafts, offline } = this.props
    const lastSync = drafts.reduce(
      (lastSynced, item) =>
        item.syncedAt > lastSynced ? item.syncedAt : lastSynced,
      0
    )
    const pendingDrafts = offline.outbox.filter(
      item => item.type === 'SUBMIT_DRAFT'
    )

    const draftsWithError = drafts.filter(
      draft => draft.status === 'Sync error'
    )

    const list = drafts.filter(
      draft => draft.status === 'Sync error' || draft.status === 'Pending sync'
    )
    const screenAccessibilityContent = screenSyncScreenContent(
      offline,
      pendingDrafts,
      draftsWithError,
      lastSync
    )

    return (
      <ScrollView contentContainerStyle={[globalStyles.container, styles.view]}>
        <View
          ref={this.acessibleComponent}
          accessible={true}
          accessibilityLabel={screenAccessibilityContent}
        >
          {offline.online &&
          !pendingDrafts.length &&
          !draftsWithError.length ? (
            <SyncUpToDate date={lastSync} lng={this.props.lng} />
          ) : null}
          {offline.online && pendingDrafts.length ? (
            <SyncInProgress pendingDraftsLength={pendingDrafts.length} />
          ) : null}
          {!offline.online ? (
            <SyncOffline pendingDraftsLength={pendingDrafts.length} />
          ) : null}
          {offline.online && draftsWithError.length && !pendingDrafts.length ? (
            <SyncRetry
              draftsWithError={draftsWithError.length}
              retrySubmit={this.retrySubmittingAllDrafts}
            />
          ) : null}
        </View>
        {list.length ? (
          <FlatList
            style={{ marginTop: 15 }}
            data={list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <SyncListItem
                item={item.familyData}
                status={item.status}
                handleClick={() => this.navigateToDraft(item)}
                errors={item.errors || []}
              />
            )}
          />
        ) : null}
      </ScrollView>
    )
  }
}

Sync.propTypes = {
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  offline: PropTypes.object.isRequired,
  lng: PropTypes.string.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  surveys: PropTypes.array,
  submitDraft: PropTypes.func.isRequired,
  submitDraftWithImages: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center'
  }
})

const mapStateToProps = ({ drafts, offline, env, user, surveys }) => ({
  drafts,
  offline,
  env,
  user,
  surveys
})

const mapDispatchToProps = {
  submitDraft,
  submitDraftWithImages
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sync)
)
