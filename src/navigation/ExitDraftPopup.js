import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { connect } from 'react-redux'
import { deleteDraft, updateNav } from '../redux/actions'
import store from '../redux/store'
import Popup from '../components/Popup'
import Button from '../components/Button'
import i18n from '../i18n'
import globalStyles from '../globalStyles'
import colors from '../theme.json'

export class ExitDraftModal extends Component {
  render() {
    const { isOpen, onClose, nav } = this.props

    return (
      <Popup isOpen={isOpen} onClose={onClose}>
        {nav.deleteDraftOnExit ||
        nav.openModal === 'exitOnTerms' ||
        nav.openModal === 'deleteDraftOnExit' ? (
          <View>
            <Text style={[globalStyles.centerText, globalStyles.h3]}>
              {nav.deleteDraftOnExit
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
              // if not enough info for draft delete it
              if (nav.deleteDraftOnExit) {
                store.dispatch(deleteDraft(nav.draftId))
              }

              if (nav.beforeCloseModal) {
                nav.beforeCloseModal()
              }

              // close modal
              onClose()
            }}
          />
          <Button
            outlined
            text={i18n.t('general.no')}
            style={{ width: 107 }}
            handleClick={onClose}
          />
        </View>
      </Popup>
    )
  }
}

ExitDraftModal.propTypes = {
  nav: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  routeName: PropTypes.string,
  draftId: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
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

const mapStateToProps = ({ nav }) => ({
  nav
})

const mapDispatchToProps = {
  updateNav
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExitDraftModal)
