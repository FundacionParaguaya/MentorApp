import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet, View } from 'react-native'
import moment from 'moment'
import 'moment/locale/es'
import ListItem from './ListItem'

import colors from '../theme.json'
import globalStyles from '../globalStyles'

moment.locale('en')

class DraftListItem extends Component {
  getColor = status => {
    switch (status) {
      case 'Draft':
        return colors.palegold
      case 'Synced':
        return colors.lightgrey
      case 'Pending sync':
        return colors.palered
      case 'Sync error':
        return colors.error
      default:
        return colors.palegrey
    }
  }

  setStatusTitle = status => {
    switch (status) {
      case 'Draft':
        return 'Draft'
      case 'Synced':
        return 'Completed'
      case 'Pending sync':
        return 'Sync Pending'
      case 'Sync error':
        return 'Sync Error'
      default:
        return ''
    }
  }

  capitalize = s => {
    if (typeof s !== 'string') return ''
    const string = s.split('.').join('')
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  handleClick = () => {
    this.props.handleClick(this.props.item)
  }

  render() {
    const { item, lng } = this.props
    const itemCreateDateWithLocale = moment(item.created)
    itemCreateDateWithLocale.locale(lng)

    const name =
      item &&
      item.familyData &&
      item.familyData.familyMembersList &&
      item.familyData.familyMembersList[0]
        ? `${item.familyData.familyMembersList[0].firstName} ${item.familyData.familyMembersList[0].lastName}`
        : ' - '

    // const linkDisabled = item.status === 'Synced'
    return (
      <ListItem
        style={{ ...styles.listItem, ...styles.borderBottom }}
        onPress={this.handleClick}
      >
        <View>
          <Text
            style={globalStyles.tag}
            accessibilityLabel={itemCreateDateWithLocale.format(
              'MMMM DD, YYYY'
            )}
          >
            {this.capitalize(itemCreateDateWithLocale.format('MMM DD, YYYY'))}
          </Text>
          <Text style={globalStyles.p}>{name}</Text>
          <Text
            style={{
              ...styles.label,
              backgroundColor: this.getColor(this.props.item.status),
              color:
                this.props.item.status === 'Synced' ? colors.grey : colors.white
            }}
          >
            {this.setStatusTitle(this.props.item.status)}
          </Text>
        </View>
        <Icon name="navigate-next" size={23} color={colors.lightdark} />
      </ListItem>
    )
  }
}

DraftListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  lng: PropTypes.string.isRequired
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
    borderRadius: 5,
    width: 0,
    minWidth: 100,
    height: 25,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 5
  }
})

export default DraftListItem
