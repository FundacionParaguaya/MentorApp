import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet, View } from 'react-native'
import ListItem from '../../components/ListItem'

import colors from '../../theme.json'
import globalStyles from '../../globalStyles'

class SyncListItem extends Component {
  render() {
    const { item, status } = this.props
    const linkDisabled = status !== 'Sync error'
    return (
      <View>
        <ListItem
          style={{ ...styles.listItem, ...styles.borderBottom }}
          onPress={this.props.handleClick}
          disabled={linkDisabled}
        >
          <View style={styles.view}>
            <View style={styles.container}>
              <Icon
                name="swap-calls"
                style={styles.icon}
                size={30}
                color={colors.lightdark}
              />
            </View>
            <View>
              <Text style={globalStyles.p}>{`${
                item.familyMembersList[0].firstName
              } ${item.familyMembersList[0].lastName} ${
                item.countFamilyMembers > 1
                  ? `+ ${item.countFamilyMembers - 1}`
                  : ''
              }`}</Text>
              {status === 'Pending sync' ? (
                <Text style={[styles.label, styles.pendingSync]}>
                  Sync Pending
                </Text>
              ) : (
                <Text style={[styles.label, styles.error]}>Sync Error</Text>
              )}
            </View>
          </View>
          {!linkDisabled ? (
            <Icon name="navigate-next" size={23} color={colors.lightdark} />
          ) : (
            <View />
          )}
        </ListItem>
        {/* Sync Errors Display
        {this.props.errors.length
          ? this.props.errors.map(ele => {
              return (
                <Text
                  style={styles.errorText}
                  key={ele.description || ele.message}
                >
                  {ele.description || ele.message}
                </Text>
              )
            })
          : null} */}
      </View>
    )
  }
}

SyncListItem.propTypes = {
  item: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  errors: PropTypes.array,
  handleClick: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  // errorText: {
  //   marginTop: 5,
  //   marginBottom: 5,
  //   padding: 7,
  //   backgroundColor: colors.errorLight
  // },
  view: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20
  },
  listItem: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
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
    minWidth: 100,
    paddingLeft: 5,
    paddingRight: 5,
    height: 25,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 5
  },
  pendingSync: {
    backgroundColor: colors.palered,
    color: colors.white
  },
  error: {
    backgroundColor: colors.palered,
    color: colors.white
  }
})

export default SyncListItem
