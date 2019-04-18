import React, { Component } from 'react'
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setSyncedState, setDimensions } from '../redux/actions'
import { LoginStack, AppStack, LoadingStack } from './navigation'

export class NavWrapper extends Component {
  componentDidMount() {
    this.dimensionChange()
    Dimensions.addEventListener('change', this.dimensionChange)
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
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {this.props.sync.synced === 'no' ||
        this.props.sync.synced === 'logout' ? (
          <LoadingStack />
        ) : (
          <View />
        )}
        {this.props.sync.synced === 'login' ? <LoginStack /> : <View />}
        {this.props.sync.synced === 'yes' ? <AppStack /> : <View />}
      </View>
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
  setSyncedState: PropTypes.func.isRequired,
  setDimensions: PropTypes.func.isRequired
}

const mapStateToProps = ({ user, sync, dimensions }) => ({
  user,
  sync,
  dimensions
})

const mapDispatchToProps = {
  setSyncedState,
  setDimensions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavWrapper)
