import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import Button from '../../components/Button'
import Popup from '../../components/Popup'
import i18n from '../../i18n'
import colors from '../../theme.json'

class EmailSentModal extends Component {
  render() {
    const { close, isOpen, error, userIsOnline } = this.props
    return (
      <Popup isOpen={isOpen} onClose={close}>
        <View style={{ paddingVertical: 60 }}>
          <View>
            {error ||
              (!userIsOnline && (
                <CommunityIcon
                  name="exclamation"
                  color={colors.palered}
                  size={60}
                  style={styles.warningIcon}
                />
              ))}
            {userIsOnline ? (
              <View>
                <Text
                  style={[
                    styles.heading,
                    {
                      color: error ? `${colors.palered}` : `${colors.palegreen}`
                    }
                  ]}
                >
                  {error
                    ? `${i18n.t('general.warning')}`
                    : `${i18n.t('general.thankYou')}`}
                </Text>
                <Text style={styles.paragraph}>
                  {error
                    ? `${i18n.t('views.final.emailError')}`
                    : `${i18n.t('views.final.emailSent')}`}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.paragraph}>
                  {i18n.t('views.final.offlineText')}
                </Text>
              </View>
            )}

            <Button
              outlined
              borderColor={
                error || !userIsOnline ? colors.palered : colors.palegreen
              }
              text={i18n.t('general.gotIt')}
              style={styles.closeButton}
              handleClick={close}
            />
          </View>
        </View>
      </Popup>
    )
  }
}

EmailSentModal.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  userIsOnline: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 25,
    lineHeight: 30,
    marginVertical: 15,
    fontFamily: 'Poppins Medium'
  },
  paragraph: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 22,
    color: `${colors.grey}`,
    marginBottom: 40,
    fontFamily: 'Poppins Medium'
  },
  closeButton: {
    width: 120,
    alignSelf: 'center'
  },
  warningIcon: {
    alignSelf: 'center'
  }
})

export default withNamespaces()(EmailSentModal)
