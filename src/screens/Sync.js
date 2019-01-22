import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import globalStyles from '../globalStyles'

import SyncUpToDate from '../components/SyncUpToDate'
import SyncOffline from '../components/SyncOffline'

export class Sync extends Component {
  render() {
    const { drafts, offline } = this.props
    const lastSync = drafts.reduce(
      (lastSynced, item) =>
        item.syncedAt > lastSynced ? item.syncedAt : lastSynced,
      0
    )
    return (
      <ScrollView
        contentContainerStyle={[globalStyles.background, styles.view]}
      >
        {offline.online && !offline.outbox.lenght ? (
          <SyncUpToDate date={lastSync} />
        ) : null}
        {!offline.online ? <SyncOffline /> : null}
        {offline.online && offline.outbox.lenght ? (
          <Text>Sync in progress</Text>
        ) : null}
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const mapStateToProps = ({ drafts, offline }) => ({
  drafts,
  offline
})

export default connect(mapStateToProps)(Sync)
