import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  StyleSheet,
  View,
  Platform,
  ActivityIndicator
} from 'react-native'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Popup from '../components/Popup'
import Checkbox from '../components/Checkbox'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '../components/Button'
import i18n from '../i18n'
import colors from '../theme.json'
import globalStyles from '../globalStyles'

export default class LogoutPopup extends Component {
  render() {
    const {
      navigation,
      checkboxesVisible,
      showErrors,
      unsyncedDrafts,
      logUserOut,
      showCheckboxes,
      onPressCheckbox,
      onModalClose,
      logingOut
    } = this.props

    const popupAccessibilityText = unsyncedDrafts
      ? `${i18n.t('views.logout.youHaveUnsynchedData')} ${i18n.t(
          'views.logout.thisDataWillBeLost'
        )} ${i18n.t('views.logout.areYouSureYouWantToLogOut')} ${i18n.t(
          'general.yes'
        )} ${i18n.t('general.no')}`
      : `${i18n.t('views.logout.weWillMissYou')} ${i18n.t(
          'views.logout.comeBackSoon'
        )} ${i18n.t('views.logout.areYouSureYouWantToLogOut')} ${i18n.t(
          'general.yes'
        )} ${i18n.t('general.no')}`

    return logingOut ? (
      <Popup
        isOpen={navigation.getParam('logoutModalOpen')}
        onClose={onModalClose}
        style={{ paddingVertical: 100 }}
      >
        <ActivityIndicator
          size="large"
          color={colors.palered}
          style={styles.indicator}
        />
      </Popup>
    ) : (
      <Popup
        isOpen={navigation.getParam('logoutModalOpen')}
        onClose={onModalClose}
      >
        <View
          accessible={true}
          accessibilityLabel={`${popupAccessibilityText}`}
          accessibilityLiveRegion="assertive"
        >
          <View
            style={{ alignItems: 'flex-end', paddingVertical: 10 }}
            accessible={true}
            accessibilityLabel={i18n.t('general.close')}
            accessibilityRole={'button'}
          >
            <Icon name="close" size={20} />
          </View>

          <View style={styles.modalContainer}>
            <View style={{ alignItems: 'center' }}>
              {!checkboxesVisible ? (
                <Icon
                  name="sentiment-dissatisfied"
                  color={colors.lightdark}
                  size={44}
                />
              ) : (
                <CommunityIcon
                  name="exclamation"
                  color={colors.palered}
                  size={60}
                />
              )}
              <Text
                style={[
                  styles.title,
                  checkboxesVisible ? { color: colors.palered } : {}
                ]}
              >
                {!checkboxesVisible
                  ? i18n.t('views.logout.logout')
                  : `${i18n.t('general.warning')}!`}
              </Text>
            </View>

            {/* Popup text */}
            {!checkboxesVisible ? (
              <View>
                {unsyncedDrafts ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={globalStyles.h3}>
                      {i18n.t('views.logout.youHaveUnsynchedData')}
                    </Text>
                    <Text style={[globalStyles.h3, { color: colors.palered }]}>
                      {i18n.t('views.logout.thisDataWillBeLost')}
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={globalStyles.h3}>
                      {i18n.t('views.logout.weWillMissYou')}
                    </Text>
                    <Text
                      style={[globalStyles.h3, { color: colors.palegreen }]}
                    >
                      {i18n.t('views.logout.comeBackSoon')}
                    </Text>
                  </View>
                )}
                <Text style={[styles.confirm, globalStyles.h3]}>
                  {i18n.t('views.logout.areYouSureYouWantToLogOut')}
                </Text>
              </View>
            ) : (
              // Checkboxes section
              <View style={{ alignItems: 'center' }}>
                <View style={{ marginBottom: 25, alignItems: 'center' }}>
                  <Text style={[globalStyles.h3, { textAlign: 'center' }]}>
                    {i18n.t('views.logout.looseYourData')}
                  </Text>
                  <Text style={[globalStyles.h3, { color: colors.palered }]}>
                    {i18n.t('views.logout.cannotUndo')}
                  </Text>
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.drafts'
                    )}`}
                  />
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.lifeMaps'
                    )}`}
                  />
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.familyInfo'
                    )}`}
                  />
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.cachedData'
                    )}`}
                  />
                </View>
              </View>
            )}

            {/* Buttons bar */}
            <View style={styles.buttonBar}>
              <Button
                id="ok-button"
                outlined
                text={
                  checkboxesVisible
                    ? i18n.t('general.delete')
                    : i18n.t('general.yes')
                }
                borderColor={unsyncedDrafts ? colors.palered : colors.palegreen}
                style={{ width: 107, alignSelf: 'flex-start' }}
                handleClick={
                  unsyncedDrafts && !checkboxesVisible
                    ? showCheckboxes
                    : logUserOut
                }
              />
              <Button
                id="cancel-button"
                outlined
                borderColor={colors.grey}
                text={
                  !checkboxesVisible
                    ? i18n.t('general.no')
                    : i18n.t('general.cancel')
                }
                style={{ width: 107, alignSelf: 'flex-end' }}
                handleClick={onModalClose}
              />
            </View>
          </View>
        </View>
      </Popup>
    )
  }
}

LogoutPopup.propTypes = {
  navigation: PropTypes.object.isRequired,
  showErrors: PropTypes.bool.isRequired,
  checkboxesVisible: PropTypes.bool.isRequired,
  logingOut: PropTypes.bool.isRequired,
  unsyncedDrafts: PropTypes.number.isRequired,
  logUserOut: PropTypes.func.isRequired,
  showCheckboxes: PropTypes.func.isRequired,
  onModalClose: PropTypes.func,
  onPressCheckbox: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 60
  },
  title: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '600'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontWeight: 'normal',
    color: colors.lightdark,
    fontSize: 24,
    marginBottom: 25
  },
  confirm: {
    color: colors.lightdark,
    marginTop: 25,
    marginBottom: 16,
    textAlign: 'center'
  },
  buttonBar: {
    marginBottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  checkbox: {
    marginTop: 0,
    marginBottom: 18,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  checkboxText: {
    fontWeight: 'normal',
    fontSize: 16,
    fontFamily: 'Roboto',
    color: colors.lightdark
  }
})
