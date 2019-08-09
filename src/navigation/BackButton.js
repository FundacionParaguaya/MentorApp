import React, { Component } from 'react'

import { AndroidBackHandler } from 'react-navigation-backhandler'
import IconButton from '../components/IconButton'
import PropTypes from 'prop-types'
import { View } from 'react-native'

class BackButton extends Component {
  handlePress = () => {
    let readOnly = this.props.navigation.getParam('readOnly')

    const { navigation } = this.props
    const draftId = navigation.getParam('draftId')
    const deleteDraftOnExit = navigation.getParam('deleteDraftOnExit')
    const survey =
      navigation.state.params.survey && navigation.getParam('survey')
    const firstLifeMapScreen =
      navigation.state.routeName &&
      navigation.state.routeName === 'FamilyParticipant'

    // open the exit modal with the params it needs
    if (readOnly) {
      navigation.getParam('onPressBack')
        ? navigation.getParam('onPressBack')()
        : navigation.goBack()
    } else if (deleteDraftOnExit || firstLifeMapScreen) {
      this.props.navigation.navigate('ExitDraftModal', {
        draftId,
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
