import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'

import colors from '../theme.json'
import globalStyles from '../globalStyles'
import i18n from '../i18n'

class SyncUpToDate extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Text style={globalStyles.h3}>You are up to date!</Text>
        <Icon style={styles.icon} name="done" size={60} color={colors.green} />
        <Text>{`Last sync: ${moment(this.props.date).format(
          'MMM, DD YYYY'
        )}`}</Text>
      </View>
    )
  }
}

SyncUpToDate.propTypes = {
  date: PropTypes.number.isRequired
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

export default SyncUpToDate
