import React, { Component } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setSyncedState } from '../redux/actions'
import { LoginStack, AppStack, LoadingStack } from './navigation'
import colors from '../theme.json'

export class NavWrapper extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.palebeige} barStyle="dark-content" />
        {this.props.sync.synced === 'no' ? <LoadingStack /> : <View />}
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
  setSyncedState: PropTypes.func.isRequired
}

const mapStateToProps = ({ user, sync }) => ({
  user,
  sync
})

const mapDispatchToProps = {
  setSyncedState
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavWrapper)
