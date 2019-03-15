import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { deleteDraft } from '../../redux/actions'
import store from '../../redux/store'
import Popup from '../Popup'
import Button from '../Button'
import i18n from '../../i18n'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'

export default class ExitDraftPopup extends Component {
  render() {
    const {
      navigation,
      isOpen,
      onClose,
      routeName,
      deleteOnExit,
      draftId
    } = this.props

    return (
      <Popup isOpen={isOpen} onClose={onClose}>
        {deleteOnExit || routeName === 'Terms' || routeName === 'Privacy' ? (
          <View>
            <Text style={[globalStyles.centerText, globalStyles.h3]}>
              {routeName === 'FamilyParticipant'
                ? i18n.t('views.modals.lifeMapWillNotBeSaved')
                : i18n.t('views.modals.weCannotContinueToCreateTheLifeMap')}
            </Text>
            <Text style={[globalStyles.centerText, styles.subline]}>
              {i18n.t('views.modals.areYouSureYouWantToExit')}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={[globalStyles.centerText, globalStyles.h3]}>
              {i18n.t('views.modals.yourLifemapIsNotComplete')}
            </Text>
            <Text style={[globalStyles.centerText, styles.subline]}>
              {i18n.t('views.modals.thisWillBeSavedAsADraft')}
            </Text>
          </View>
        )}

        <View style={styles.buttonBar}>
          <Button
            outlined
            text={i18n.t('general.yes')}
            style={{ width: 107 }}
            handleClick={() => {
              if (deleteOnExit) {
                store.dispatch(deleteDraft(draftId))
              }
              isOpen === true
                ? navigation.setParams({ modalOpen: false })
                : false
              navigation.popToTop()
              navigation.navigate('Dashboard')
            }}
          />
          <Button
            outlined
            text={i18n.t('general.no')}
            style={{ width: 107 }}
            handleClick={() => navigation.setParams({ modalOpen: false })}
          />
        </View>
      </Popup>
    )
  }
}

ExitDraftPopup.propTypes = {
  navigation: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  routeName: PropTypes.string,
  draftId: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  deleteOnExit: PropTypes.bool
}

const styles = StyleSheet.create({
  subline: {
    marginTop: 15,
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '500'
      },
      android: {
        fontFamily: 'Poppins Medium'
      }
    }),
    fontSize: 16,
    lineHeight: 20,
    color: colors.grey
  },
  buttonBar: {
    flexDirection: 'row',
    marginTop: 33,
    justifyContent: 'space-between'
  }
})
