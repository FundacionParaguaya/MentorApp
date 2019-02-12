import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import Orb from './Orb'
import colors from '../../theme.json'

export default class Decoration extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.ballsContainer,
            {
              zIndex: 1
            }
          ]}
        >
          <Orb size={35} color={colors.gold} position={{ x: 70, y: -70 }} />
          <Orb size={25} color={colors.red} position={{ x: -100, y: -50 }} />
          <Orb size={35} color={colors.gold} position={{ x: -175, y: 10 }} />
          <Orb size={45} color={colors.gold} position={{ x: 170, y: -70 }} />
          <Orb size={45} color={colors.red} position={{ x: -30, y: 60 }} />
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
