import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet, View } from 'react-native'

import colors from '../theme.json'
import globalStyles from '../globalStyles'

class SyncListItem extends Component {
  render() {
    const { item } = this.props

    return (
      <View style={[styles.view, styles.borderBottom]}>
        <View style={styles.container}>
          <Icon
            name="swap-calls"
            style={styles.icon}
            size={30}
            color={colors.lightdark}
          />
          <Text style={globalStyles.p}>{`${
            item.familyMembersList[0].firstName
          } ${item.familyMembersList[0].lastName} ${
            item.countFamilyMembers > 1
              ? `+ ${item.countFamilyMembers - 1}`
              : ''
          }`}</Text>
        </View>
        <Text style={styles.label}>Pending</Text>
      </View>
    )
  }
}

SyncListItem.propTypes = {
  item: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20
  },
  container: { flexDirection: 'row', alignItems: 'center' },
  borderBottom: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  },
  icon: { transform: [{ rotate: '90deg' }], marginRight: 10 },
  label: {
    color: colors.lightdark,
    borderRadius: 5,
    width: 100,
    height: 25,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 5,
    backgroundColor: colors.lightgrey
  }
})

export default SyncListItem
