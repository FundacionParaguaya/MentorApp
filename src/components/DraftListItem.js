import 'moment/locale/es'
import 'moment/locale/pt'

import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import globalStyles from '../globalStyles'
import i18n from '../i18n'
import colors from '../theme.json'
import ListItem from './ListItem'

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
        return i18n.t('draftStatus.draft')
      case 'Synced':
        return i18n.t('draftStatus.completed')
      case 'Pending sync':
        return i18n.t('draftStatus.syncPending')
      case 'Sync error':
        return i18n.t('draftStatus.syncError')
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
    this.props.handleClick(this.props.item);
  }

  render() {
    const { item, lng, handleSync } = this.props
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
        disabled={this.props.user.role == 'ROLE_SURVEY_TAKER' ? true : false}
      >
        <View>
          <Text
            id="dateCreated"
            style={globalStyles.tag}
            accessibilityLabel={itemCreateDateWithLocale.format(
              'MMMM DD, YYYY'
            )}
          >
            {this.capitalize(itemCreateDateWithLocale.format('MMM DD, YYYY'))}
          </Text>
          <Text id="fullName" style={globalStyles.p}>
            {name}
          </Text>
          <Text
            id="status"
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
        <View>
          <Icon name="sync" size={25} onPress={()=> handleSync(item)} color={colors.grey} />
        </View>

      </ListItem>
    )
  }
}

DraftListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  lng: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
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
    minWidth: 120,
    height: 25,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 5
  }
})

export default DraftListItem
