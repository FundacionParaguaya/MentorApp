import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconButton from '../components/IconButton'

class CloseButton extends Component {
  handlePress = () => {
    const { navigation } = this.props
    const draft =
      navigation.state.params.getCurrentDraftState &&
      navigation.getParam('getCurrentDraftState')()
    const isNewDraft =
      navigation.state.params.isNewDraft && navigation.getParam('isNewDraft')
    const survey =
      navigation.state.params.survey && navigation.getParam('survey')

    // open the exit modal with the params it needs
    this.props.navigation.navigate('ExitDraftModal', {
      draft,
      isNewDraft,
      survey
    })
  }
  render() {
    return (
      <IconButton
        style={this.props.style}
        onPress={this.handlePress}
        icon="close"
        size={25}
        accessible={true}
        accessibilityLabel={'Exit'}
      />
    )
  }
}

CloseButton.propTypes = {
  style: PropTypes.object,
  navigation: PropTypes.object.isRequired
}
export default CloseButton
