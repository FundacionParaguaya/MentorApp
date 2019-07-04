import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  UIManager,
  findNodeHandle
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import globalStyles from '../globalStyles'
import { withNamespaces } from 'react-i18next'
import { submitDraft } from '../redux/actions'
import { url } from '../config'
import { prepareDraftForSubmit } from './utils/helpers'

import SyncUpToDate from '../components/sync/SyncUpToDate'
import SyncOffline from '../components/sync/SyncOffline'
import SyncInProgress from '../components/sync/SyncInProgress'
import SyncListItem from '../components/sync/SyncListItem'
import SyncRetry from '../components/sync/SyncRetry'

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
        draft,
        survey: this.props.surveys.find(survey => survey.id === draft.surveyId),
        step: draft.progress.step,
        socioEconomics: draft.progress.socioEconomics
      })
    } else
      this.props.navigation.navigate('Overview', {
        draft,
        survey: this.props.surveys.find(survey => survey.id === draft.surveyId),
        resumeDraft: true
      })
  }

  retrySubmittingAllDrafts = () => {
    const draftsWithError = this.props.drafts.filter(
      draft => draft.status === 'Sync error'
    )

    draftsWithError.forEach(draft => {
      this.props.submitDraft(
        url[this.props.env],
        this.props.user.token,
        draft.draftId,
        prepareDraftForSubmit(
          draft,
          this.props.surveys.find(survey => survey.id === draft.surveyId)
        )
      )
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
    return (
      <ScrollView contentContainerStyle={[globalStyles.container, styles.view]}>
        <View ref={this.acessibleComponent} accessible={true}>
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
  submitDraft: PropTypes.func.isRequired
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
  submitDraft
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sync)
)
