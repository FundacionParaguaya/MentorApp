import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Button from '../components/Button';
import Popup from '../components/Popup';
import globalStyles from '../globalStyles';
import i18n from '../i18n';
import {logoutModalAccessibleText} from '../screens/utils/accessibilityHelpers';
import colors from '../theme.json';
const initialState = {
  checkboxDrafts: false,
  checkboxLifeMaps: false,
  checkboxFamilyInfo: false,
  checkboxCachedData: false,
};
export default function LogoutPopup(props) {
  const [state, setInitialState] = useState({
    checkboxDrafts: false,
    checkboxLifeMaps: false,
    checkboxFamilyInfo: false,
    checkboxCachedData: false,
  });

  const checkboxChange = (checkbox) => {
    props.onPressCheckbox(!state[checkbox]);
    setInitialState({...state, [checkbox]: !state[checkbox]});
  };

  const onModalCloseFunc = () => {
    //resetting the state and closing the modal
    setInitialState(initialState);
    props.onModalClose();
  };
  const accessiblePopUpText = logoutModalAccessibleText(
    unsyncedDrafts,
    checkboxesVisible,
  );
  const {
    isOpen,
    checkboxesVisible,
    showErrors,
    unsyncedDrafts,
    logUserOut,
    showCheckboxes,
    onModalClose,
    logingOut,
    route,
  } = props;
  return logingOut ? (
    <Popup
      LogoutPopup
      modifiedPopUp
      isOpen={isOpen}
      onClose={onModalClose}
      style={{paddingVertical: 100}}>
      <ActivityIndicator
        size="large"
        color={colors.palered}
        style={styles.indicator}
      />
    </Popup>
  ) : (
    <Popup LogoutPopup modifiedPopUp isOpen={isOpen} onClose={onModalClose}>
      <View
        accessible={true}
        accessibilityLabel={`${accessiblePopUpText}`}
        accessibilityLiveRegion="assertive">
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 15,
            width: 60,
            marginLeft: 'auto',
          }}
          accessible={true}
          accessibilityLabel={i18n.t('general.close')}
          accessibilityRole={'button'}>
          <Icon onPress={onModalClose} name="close" size={30} />
        </View>
        <View style={styles.modalContainer}>
          <View style={{alignItems: 'center'}}>
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
                checkboxesVisible ? {color: colors.palered} : {},
              ]}>
              {!checkboxesVisible
                ? i18n.t('views.logout.logout')
                : `${i18n.t('general.warning')}!`}
            </Text>
          </View>

          {/* Popup text */}
          {!checkboxesVisible ? (
            <View>
              {unsyncedDrafts ? (
                <View style={{alignItems: 'center'}}>
                  <Text style={globalStyles.h3}>
                    {i18n.t('views.logout.youHaveUnsynchedData')}
                  </Text>
                  <Text style={[globalStyles.h3, {color: colors.palered}]}>
                    {i18n.t('views.logout.thisDataWillBeLost')}
                  </Text>
                </View>
              ) : (
                <View style={{alignItems: 'center'}}>
                  <Text style={globalStyles.h3}>
                    {i18n.t('views.logout.weWillMissYou')}
                  </Text>
                  <Text style={[globalStyles.h3, {color: colors.palegreen}]}>
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
            <View style={{alignItems: 'center'}}>
              <View style={{marginBottom: 25, alignItems: 'center'}}>
                <Text style={[globalStyles.h3, {textAlign: 'center'}]}>
                  {i18n.t('views.logout.looseYourData')}
                </Text>
                <Text style={[globalStyles.h3, {color: colors.palered}]}>
                  {i18n.t('views.logout.cannotUndo')}
                </Text>
              </View>
              <View style={{marginBottom: 15}}>
                {/* just like in the LogIn.js,here it is more easy to simply use the Checkbox from react-native-elements rather than modifying the Checboxes.js */}
                <CheckBox
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checked={state.checkboxDrafts}
                  containerStyle={styles.checkbox}
                  checkedColor={colors.palered}
                  textStyle={
                    showErrors && !state.checkboxDrafts
                      ? styles.error
                      : styles.checkboxText
                  }
                  onPress={() => checkboxChange('checkboxDrafts')}
                  title={`${i18n.t('general.delete')} ${i18n.t(
                    'general.drafts',
                  )}`}
                />
                <CheckBox
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checked={state.checkboxLifeMaps}
                  containerStyle={styles.checkbox}
                  checkedColor={colors.palered}
                  textStyle={
                    showErrors && !state.checkboxLifeMaps
                      ? styles.error
                      : styles.checkboxText
                  }
                  onPress={() => checkboxChange('checkboxLifeMaps')}
                  title={`${i18n.t('general.delete')} ${i18n.t(
                    'filterLabels.lifeMaps',
                  )}`}
                />
                <CheckBox
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checked={state.checkboxFamilyInfo}
                  containerStyle={styles.checkbox}
                  checkedColor={colors.palered}
                  textStyle={
                    showErrors && !state.checkboxFamilyInfo
                      ? styles.error
                      : styles.checkboxText
                  }
                  onPress={() => checkboxChange('checkboxFamilyInfo')}
                  title={`${i18n.t('general.delete')} ${i18n.t(
                    'general.familyInfo',
                  )}`}
                />
                <CheckBox
                  iconType="material"
                  checkedIcon="check-box"
                  uncheckedIcon="check-box-outline-blank"
                  checked={state.checkboxCachedData}
                  containerStyle={styles.checkbox}
                  checkedColor={colors.palered}
                  textStyle={
                    showErrors && !state.checkboxCachedData
                      ? styles.error
                      : styles.checkboxText
                  }
                  onPress={() => checkboxChange('checkboxCachedData')}
                  title={`${i18n.t('general.delete')} ${i18n.t(
                    'general.cachedData',
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
              style={{minWidth: 107, marginRight: 20}}
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
              style={{minWidth: 107, marginLeft: 20}}
              handleClick={() => onModalCloseFunc()}
            />
          </View>
        </View>
      </View>
    </Popup>
  );
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
  onPressCheckbox: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 60,
  },
  title: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '600',
      },
      android: {
        fontFamily: 'Poppins SemiBold',
      },
    }),
    fontWeight: 'normal',
    color: colors.lightdark,
    fontSize: 24,
    marginBottom: 25,
  },
  confirm: {
    color: colors.lightdark,
    marginTop: 25,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonBar: {
    marginBottom: 80,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checkbox: {
    marginTop: 0,
    marginBottom: 18,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  error: {
    fontWeight: 'normal',
    fontSize: 16,
    fontFamily: 'Roboto',
    color: colors.palered,
    textDecorationLine: 'underline',
  },
  checkboxText: {
    fontWeight: 'normal',
    fontSize: 16,
    fontFamily: 'Roboto',
    color: colors.lightdark,
  },
});
