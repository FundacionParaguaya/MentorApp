import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import Orb from './Orb'
import colors from '../../theme.json'

export default class Decoration extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.ballsContainer}>
          <Orb
            style={[
              {
                width: 35,
                height: 35,
                backgroundColor: colors.gold
              }
            ]}
            position={{ x: 70, y: -70 }}
            startingPosition={{ x: 700, y: -700 }}
          />
        </View>
        <View style={styles.childContainer}>{this.props.children}</View>
      </View>
    )
  }
}

Decoration.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
}

const styles = StyleSheet.create({
  ballsContainer: {
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  childContainer: {
    zIndex: 2
  }
})
