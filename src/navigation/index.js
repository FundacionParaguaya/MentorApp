import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'
import { setDimensions } from '../redux/actions'
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
  user: PropTypes.object.isRequired,
  sync: PropTypes.object.isRequired,
  hydration: PropTypes.bool.isRequired,
  setDimensions: PropTypes.func.isRequired
}

const mapStateToProps = ({ user, sync, dimensions, hydration }) => ({
  user,
  sync,
  dimensions,
  hydration
})

const mapDispatchToProps = {
  setDimensions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavWrapper)
