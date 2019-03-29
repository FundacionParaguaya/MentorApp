import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'

import colors from '../../theme.json'
import globalStyles from '../../globalStyles'
import i18n from '../../i18n'

export class SyncUpToDate extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Text style={globalStyles.h3}>{i18n.t('views.sync.upToDate')}</Text>
        <Icon style={styles.icon} name="done" size={60} color={colors.green} />
        {this.props.date ? (
          <Text
            accessibilityLabel={
              `${i18n.t('views.sync.lastSync')}${moment(
                this.props.date
              ).format('MMMM, DD YYYY')}`}
          >{`${i18n.t('views.sync.lastSync')}${moment(
            this.props.date
          ).format('MMM, DD YYYY')}`}</Text>
        ) : null}
      </View>
    )
  }
}

SyncUpToDate.propTypes = {
  date: PropTypes.number
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

export default withNamespaces()(SyncUpToDate)
