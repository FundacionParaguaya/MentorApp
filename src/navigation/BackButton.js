import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from '../components/IconButton'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import { View } from 'react-native'

class BackButton extends Component {
  handlePress = () => {
    const { navigation } = this.props
    let readOnly = this.props.navigation.getParam('readOnly')
    const draft =
      navigation.state.params.getCurrentDraftState &&
      navigation.getParam('getCurrentDraftState')()
    const isNewDraft =
      navigation.state.params.isNewDraft && navigation.getParam('isNewDraft')
    const firstLifeMapScreen =
      navigation.state.routeName &&
      navigation.state.routeName === 'FamilyParticipant' &&
      !readOnly
    // open the exit modal with the params it needs

    if (isNewDraft || firstLifeMapScreen) {
      this.props.navigation.navigate('ExitDraftModal', {
        draft,
        isNewDraft
      })
    } else {
      navigation.getParam('onPressBack')
        ? navigation.getParam('onPressBack')()
        : navigation.goBack()
    }
  }

  handleBackHandlerPress = () => {
    const { navigation } = this.props
    if (navigation.getParam('onPressBack')) {
      navigation.getParam('onPressBack')()
    }
    return true
  }

  render() {
    const { navigation } = this.props
    return (
      <AndroidBackHandler onBackPress={navigation.goBack}>
        <View>
          <IconButton
            style={this.props.style}
            onPress={this.handlePress}
            icon="arrow-back"
            size={25}
            accessible={true}
            accessibilityLabel={'Go back'}
          />
        </View>
      </AndroidBackHandler>
    )
  }
}

BackButton.propTypes = {
  style: PropTypes.object,
  navigation: PropTypes.object.isRequired
}

export default BackButton
