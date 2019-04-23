import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateNav } from '../redux/actions'
import IconButton from '../components/IconButton'

class CloseButton extends Component {
  handlePress = () => {
    // navigation comes from react-navigation, nav comes from redux
    const { navigation, nav } = this.props

    if (nav.deleteDraftOnExit) {
      this.props.updateNav('openModal', 'deleteDraft')
    } else if (
      navigation.state.routeName === 'Terms' ||
      navigation.state.routeName === 'Privacy'
    ) {
      this.props.updateNav('openModal', 'exitOnTerms')
    } else {
      this.props.updateNav('openModal', 'exitDraft')
    }

    this.props.updateNav('beforeCloseModal', () => {
      // reset navigation
      navigation.popToTop()
      navigation.navigate('Dashboard')
      this.props.updateNav('beforeCloseModal', null)
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
