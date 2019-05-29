import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateNav } from '../redux/actions'
import IconButton from '../components/IconButton'

class CloseButton extends Component {
  handlePress = () => {
    const { navigation } = this.props
    const draft =
      navigation.state.params.getCurrentDraftState &&
      navigation.getParam('getCurrentDraftState')()
    const isNewDraft =
      navigation.state.params.isNewDraft && navigation.getParam('isNewDraft')

    // open the exit modal with the params it needs
    this.props.navigation.navigate('ExitDraftModal', {
      draft,
      isNewDraft
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
  nav: PropTypes.object.isRequired,
  style: PropTypes.object,
  updateNav: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

const mapStateToProps = ({ nav }) => ({
  nav
})

const mapDispatchToProps = {
  updateNav
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CloseButton)
