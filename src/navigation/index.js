import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'
import { setDimensions, updateNav } from '../redux/actions'
import RootStack from './stacks'

export class NavWrapper extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.hydration && this.props.hydration) {
      SplashScreen.hide()
    }
  }

  onCloseModal = () => {
    this.props.updateNav('openModal', null)
  }

  // determine which stack to show based on synced property
  render() {
    const { hydration } = this.props

    // wait for store hydration to show the app
    return hydration ? (
      <View style={styles.container} testID="app-container">
        <RootStack />
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
