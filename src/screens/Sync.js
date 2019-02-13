import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, FlatList } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import globalStyles from '../globalStyles'
import { withNamespaces } from 'react-i18next'

import SyncUpToDate from '../components/sync/SyncUpToDate'
import SyncOffline from '../components/sync/SyncOffline'
import SyncInProgress from '../components/sync/SyncInProgress'
import SyncListItem from '../components/sync/SyncListItem'

export class Sync extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Sync')
    }
  }

  updateTitle = () =>
    this.props.navigation.setParams({
      title: this.props.t('views.synced')
    })

  componentDidMount() {
    this.updateTitle()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lng !== this.props.lng) {
      this.updateTitle()
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

    const list = drafts.filter(
      draft => draft.status === 'Sync error' || draft.status === 'Pending sync'
    )

    return (
      <ScrollView contentContainerStyle={[globalStyles.container, styles.view]}>
        {offline.online && !pendingDrafts.length ? (
          <SyncUpToDate date={lastSync} />
        ) : null}
        {offline.online && pendingDrafts.length ? (
          <SyncInProgress pendingDraftsLength={pendingDrafts.length} />
        ) : null}
        {!offline.online ? (
          <SyncOffline pendingDraftsLength={pendingDrafts.length} />
        ) : null}
        {list.length ? (
          <FlatList
            style={{ marginTop: 15 }}
            data={list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <SyncListItem item={item.familyData} status={item.status} />
            )}
          />
        ) : null}
      </ScrollView>
    )
  }
}

Sync.propTypes = {
  drafts: PropTypes.array.isRequired,
  offline: PropTypes.object.isRequired,
  lng: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center'
  }
})

const mapStateToProps = ({ drafts, offline }) => ({
  drafts,
  offline
})

export default withNamespaces()(connect(mapStateToProps)(Sync))
