import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import Popup from '../../components/Popup'
import Button from '../../components/Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../../theme.json'
import { withNamespaces } from 'react-i18next'
import i18n from '../../i18n'

export const MINIMUM_REQUIRED_STORAGE_SPACE_500_MB = 524288000 // bytes

class InternalStorageFullModal extends Component {
  render() {
    const { retryLogIn, isOpen } = this.props
    return (
      <Popup isOpen={isOpen} onClose={retryLogIn}>
        <View style={{ paddingVertical: 60 }}>
          <Icon
            name="sentiment-dissatisfied"
            style={styles.sadFace}
            color={colors.grey}
            size={60}
          />
          <Text style={styles.heading1}>Hmm...</Text>
          <Text style={styles.subheading}>
            {i18n.t('views.modals.deviceMemoryFull')}
          </Text>
          <Text style={styles.freeSpaceMessage}>{`${i18n.t(
            'views.modals.freeUpSpace'
          )} "500 mb" ${i18n.t('views.modals.toContinueUsingTheApp')}`}</Text>
          <Button
            id="retry"
            outlined
            borderColor={colors.red}
            text={'Retry'}
            style={styles.retryButton}
            handleClick={retryLogIn}
          />
        </View>
      </Popup>
    )
  }
}

InternalStorageFullModal.propTypes = {
  retryLogIn: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  heading1: {
    textAlign: 'center',
    fontSize: 25,
    color: `${colors.grey}`,
    fontFamily: 'Poppins Medium'
  },
  subheading: {
    textAlign: 'center',
    fontSize: 18,
    color: `${colors.black}`,
    lineHeight: 22,
    marginVertical: 15,
    fontFamily: 'Poppins Medium'
  },
  freeSpaceMessage: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 22,
    color: `${colors.red}`,
    marginBottom: 40,
    fontFamily: 'Poppins Medium'
  },
  retryButton: {
    width: 120,
    alignSelf: 'center'
  },
  sadFace: {
    alignSelf: 'center'
  }
})

export default withNamespaces()(InternalStorageFullModal)
