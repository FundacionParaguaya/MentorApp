import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import colors from '../theme.json'

export default class Decoration extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.ballsContainer}>
          <View
            style={[
              styles.ball,
              {
                width: 35,
                height: 35,
                backgroundColor: colors.gold
              }
            ]}
          />
        </View>
        <View style={styles.childContainer}>{this.props.children}</View>
      </View>
    )
  }
}

Decoration.propTypes = {
  children: PropTypes.object
}

const styles = StyleSheet.create({
  ballsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  ball: {
    position: 'absolute',
    borderRadius: 50,
    top: '50%',
    left: '50%'
  },
  childContainer: {
    zIndex: 2
  }
})
