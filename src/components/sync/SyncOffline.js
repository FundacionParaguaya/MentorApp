import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../../theme.json'
import globalStyles from '../../globalStyles'
import i18n from '../../i18n'

export class SyncOffline extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Text style={globalStyles.h3}>{i18n.t('views.sync.offline')}</Text>
        <Icon
          style={styles.icon}
          name="wifi-off"
          size={60}
          color={colors.grey}
        />
        <Text style={globalStyles.p}>
          {this.props.pendingDraftsLength === 1
            ? i18n.t('views.sync.updatePending')
            : i18n
                .t('views.sync.updatesPending')
                .replace('%n', this.props.pendingDraftsLength)}
        </Text>
      </View>
    )
  }
}

SyncOffline.propTypes = {
  pendingDraftsLength: PropTypes.number.isRequired
}
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginVertical: 20
  }
})

export default withNamespaces()(SyncOffline)
