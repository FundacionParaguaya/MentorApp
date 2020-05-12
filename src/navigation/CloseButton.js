import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '../i18n'
import IconButton from '../components/IconButton'
import { connect } from 'react-redux'

class CloseButton extends Component {
  handlePress = () => {
    const { navigation } = this.props
    const draftId = navigation.getParam('draftId')
    const deleteDraftOnExit =
      this.props.user.role === 'ROLE_SURVEY_TAKER'
        ? true
        : navigation.getParam('deleteDraftOnExit')
    //console.log('this.props.user.role', this.props.user.role);
    //console.log('deleteDraftOnExit', deleteDraftOnExit);
    const survey =
      navigation.state.params.survey && navigation.getParam('survey')

    // open the exit modal with the params it needs
    this.props.navigation.navigate('ExitDraftModal', {
      draftId,
      deleteDraftOnExit,
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
        accessibilityLabel={i18n.t('general.exit')}
      />
    )
  }
}

CloseButton.propTypes = {
  style: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export const mapStateToProps = ({ user }) => ({
  user
})
export default connect(mapStateToProps)(CloseButton)
