import 'moment/locale/es'
import 'moment/locale/pt'
import 'moment/locale/fr'

import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { getLocaleForLanguage } from '../utils'

import globalStyles from '../globalStyles'
import i18n from '../i18n'
import colors from '../theme.json'
import ListItem from './ListItem'

moment.locale('en')

class DraftListItem extends Component {
  getColor = status => {
    switch (status) {
      case 'Draft':
        return colors.lightgrey
      case 'Synced':
        return colors.green
      case 'Pending sync':
        return colors.palegold
      case 'Pending images':
        return colors.palegold
      case 'Sync error':
        return colors.error
      case 'Sync images error':
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
      case 'Pending images':
        return i18n.t('draftStatus.syncPendingImages')
      case 'Sync error':
        return i18n.t('draftStatus.syncError')
      case 'Sync images error':
        return i18n.t('draftStatus.syncImagesError')
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

  readyToSyncDraft = item =>
    item.status === 'Pending sync' || item.status === 'Sync error'

  readyToSyncImages = item =>
    item.status === 'Pending images' || item.status === 'Sync images error'

  render() {
    const { item, lng, handleSyncDraft, handleSyncImages, selectedDraftId, selectedImagesId } = this.props
    const itemCreateDateWithLocale = moment(item.created)
    itemCreateDateWithLocale.locale(getLocaleForLanguage(lng))

    const name =
      item &&
        item.familyData &&
        item.familyData.familyMembersList &&
        item.familyData.familyMembersList[0]
        ? `${item.familyData.familyMembersList[0].firstName} ${item.familyData.familyMembersList[0].lastName}`
        : ' - '

    const loading = selectedDraftId == item.draftId || selectedImagesId == item.draftId;
    const disableSyncDraft = !!selectedDraftId && selectedDraftId != item.draftId;
    const disableSyncImages = !!selectedImagesId && selectedImagesId != item.draftId;

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
          <View
            style={styles.container}
          >
            {(item.status === 'Pending images' || item.status === 'Sync images error')
              && (
                <Text
                  id="status"
                  style={{
                    ...styles.label,
                    backgroundColor: colors.green,
                    color: colors.white
                  }}
                >
                  {i18n.t('draftStatus.dataSaved')}
                </Text>
              )}
            {item.status !== 'Synced' ? (
              <Text
                id="status"
                style={{
                  ...styles.label,
                  backgroundColor: this.getColor(item.status),
                  color:
                    item.status === 'Pending sync' || item.status === 'Pending images'
                      ? colors.black
                      : colors.white
                }}
              >
                {this.setStatusTitle(item.status)}
              </Text>) : (
                <View style={{...styles.container, marginTop: 10}}>
                  <Icon
                    name="check"
                    size={20}
                    color={colors.green}

                  />
                  <Text
                    id="completed"
                   style={{color: colors.green}}
                  >
                    {i18n.t('draftStatus.completed')}
                  </Text>
                </View>
              )}
          </View>
        </View>
        <View>
          {this.readyToSyncDraft(item) && !loading && (
            <Icon
              name="file-upload"
              size={25}
              onPress={() => handleSyncDraft(item)}
              disabled={disableSyncDraft}
              color={disableSyncDraft ? colors.lightgrey : colors.lightdark}
            />
          )}
          {this.readyToSyncImages(item) && !loading && (
            <Icon
              name="cloud-upload"
              size={25}
              onPress={() => handleSyncImages(item)}
              disabled={disableSyncImages}
              color={disableSyncImages ? colors.lightgrey : colors.lightdark}
            />
          )}
          {loading &&
            <ActivityIndicator size="small" color={colors.lightdark} />
          }
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
    height: 115,
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
    alignSelf: 'flex-start',
    minWidth: 120,
    height: 25,
    paddingLeft: 5,
    paddingRight: 5,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 5,
    marginRight: 5
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export default DraftListItem
