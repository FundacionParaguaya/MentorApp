import React, { Component } from 'react'
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'
import { setDimensions, updateNav } from '../redux/actions'
import ExitDraftPopup from './ExitDraftPopup'
import RootStack from './stacks'

export class NavWrapper extends Component {
  componentDidMount() {
    this.dimensionChange()
    Dimensions.addEventListener('change', this.dimensionChange)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.hydration && this.props.hydration) {
      SplashScreen.hide()
    }
  }

  dimensionChange = () => {
    this.props.setDimensions({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      scale: Dimensions.get('window').scale
    })
  }

  // determine which stack to show based on synced property
  render() {
    const { nav, updateNav } = this.props

    return this.props.hydration ? (
      <View style={styles.container}>
        <StatusBar backgroundColor="#309E43" barStyle="light-content" />
        <RootStack />

        {/* Modals */}
        <ExitDraftPopup
          isOpen={
            nav.openModal === 'exitDraft' ||
            nav.openModal === 'exitOnTerms' ||
            nav.openModal === 'deleteDraft'
          }
          onClose={() => updateNav('openModal', null)}
        />
      </View>
    ) : (
      <View />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

NavWrapper.propTypes = {
  nav: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  sync: PropTypes.object.isRequired,
  hydration: PropTypes.bool.isRequired,
  setDimensions: PropTypes.func.isRequired,
  updateNav: PropTypes.func.isRequired
}

const mapStateToProps = ({ user, sync, dimensions, hydration, nav }) => ({
  user,
  sync,
  dimensions,
  hydration,
  nav
})

const mapDispatchToProps = {
  setDimensions,
  updateNav
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavWrapper)
