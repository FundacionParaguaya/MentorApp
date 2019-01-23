import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet, View } from 'react-native'

import colors from '../theme.json'
import globalStyles from '../globalStyles'

class SyncListItem extends Component {
  render() {
    return (
      <View style={[styles.view, styles.borderBottom]}>
        <View>
          <Icon
            name="swap-calls"
            rotate={true}
            size={23}
            color={colors.lightdark}
          />
          <Text style={globalStyles.p}>Name</Text>
        </View>
        <Text style={styles.label}>Status</Text>
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
    flexDirection: 'row'
  },
  listItem: {
    height: 95,
    paddingTop: 25,
    paddingBottom: 25,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  borderBottom: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  },
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
