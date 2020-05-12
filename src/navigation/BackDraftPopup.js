import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { deleteDraft } from '../redux/actions'
import store from '../redux/store'
import Popup from '../components/Popup'
import Button from '../components/Button'
import i18n from '../i18n'
import globalStyles from '../globalStyles'
import colors from '../theme.json'

export default class BackDraftPopup extends Component {
  render() {
    let { navigation, isOpen, onClose, routeName } = this.props
    return (
      <Popup isOpen={isOpen} onClose={onClose}>
        <Text style={[globalStyles.centerText, globalStyles.h3]}>
          {routeName === 'FamilyParticipant'
            ? i18n.t('views.modals.lifeMapWillNotBeSaved')
            : i18n.t('views.modals.weCannotContinueToCreateTheLifeMap')}
        </Text>
        <Text
          style={[globalStyles.centerText, styles.subline]}
          accessibilityLabel={'Are you sure you want to go back?'}
        >
          Are you sure you want to go back?
        </Text>
        <View style={styles.buttonBar}>
          <Button
            outlined
            text={i18n.t('general.yes')}
            style={{ width: 107 }}
            handleClick={() => {
              store.dispatch(deleteDraft(navigation.getParam('draftId')))
              navigation.getParam('onPressBack')
                ? navigation.getParam('onPressBack')()
                : navigation.goBack()
            }}
          />
          <Button
            outlined
            text={i18n.t('general.no')}
            style={{ width: 107 }}
            handleClick={() => navigation.setParams({ backModalOpen: false })}
          />
        </View>
      </Popup>
    )
  }
}

BackDraftPopup.propTypes = {
  navigation: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  routeName: PropTypes.string
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
