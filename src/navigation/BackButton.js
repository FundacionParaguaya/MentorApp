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
    const deleteDraftOnExit =
      navigation.state.params.deleteDraftOnExit &&
      navigation.getParam('deleteDraftOnExit')
    const firstLifeMapScreen =
      navigation.state.routeName &&
      navigation.state.routeName === 'FamilyParticipant'
    const survey =
      navigation.state.params.survey && navigation.getParam('survey')

    // open the exit modal with the params it needs
    if (readOnly) {
      navigation.getParam('onPressBack')
        ? navigation.getParam('onPressBack')()
        : navigation.goBack()
    } else if (deleteDraftOnExit || firstLifeMapScreen) {
      this.props.navigation.navigate('ExitDraftModal', {
        draft,
        deleteDraftOnExit,
        survey
      })
    } else {
      navigation.getParam('onPressBack')
        ? navigation.getParam('onPressBack')()
        : navigation.goBack()
    }

    // Return true needed for the BackHanler button to denote that we have handled the event
    return true
  }

  render() {
    return (
      <AndroidBackHandler onBackPress={this.handlePress}>
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
