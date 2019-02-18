import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet, View } from 'react-native'
import moment from 'moment'
import ListItem from './ListItem'

import colors from '../theme.json'
import globalStyles from '../globalStyles'

class DraftListItem extends Component {
  getColor = status => {
    switch (status) {
      case 'Draft':
        return colors.palegrey
      case 'Synced':
        return colors.palegreen
      case 'Pending sync':
        return colors.gold
      case 'Sync error':
        return colors.palered
      default:
        return colors.palegrey
    }
  }

  render() {
    const linkDisabled = this.props.item.status !== 'Draft'
    return (
      <ListItem
        style={{ ...styles.listItem, ...styles.borderBottom }}
        onPress={this.props.handleClick}
        disabled={linkDisabled}
      >
        <View>
          <Text style={globalStyles.tag}>
            {moment(this.props.item.created).format('MMM, DD YYYY')}
          </Text>
          <Text style={globalStyles.p}>
            {this.props.item.familyData.familyMembersList[0].firstName}{' '}
            {this.props.item.familyData.familyMembersList[0].lastName}
          </Text>
          <Text
            style={{
              ...styles.label,
              backgroundColor: this.getColor(this.props.item.status)
            }}
          >
            {this.props.item.status}
          </Text>
        </View>
        {!linkDisabled ? (
          <Icon name="navigate-next" size={23} color={colors.lightdark} />
        ) : (
          <View />
        )}
      </ListItem>
    )
  }
}

DraftListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  listItem: {
    height: 95,
    padding: 25,
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
    color: colors.white,
    borderRadius: 5,
    width: 100,
    height: 25,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 5
  }
})

export default DraftListItem
