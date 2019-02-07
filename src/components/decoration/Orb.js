import React, { Component } from 'react'
import { StyleSheet, Animated } from 'react-native'
import PropTypes from 'prop-types'

export default class Orb extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animateX: props.startingPosition
        ? new Animated.Value(props.startingPosition.x)
        : false,
      animateY: props.startingPosition
        ? new Animated.Value(props.startingPosition.y)
        : false
    }
  }
  componentDidMount() {
    const { position, startingPosition } = this.props
    if (startingPosition) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.animateX, {
            toValue: position.x,
            duration: 3000
          }),
          Animated.timing(this.state.animateY, {
            toValue: position.y,
            duration: 3000
          })
        ])
      ]).start()
    }
  }
  render() {
    let { animateX, animateY } = this.state

    return (
      <Animated.View
        style={[
          styles.orb,
          this.props.style,
          {
            transform: [{ translateX: animateX }, { translateY: animateY }]
          }
        ]}
      />
    )
  }
}

Orb.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  startingPosition: PropTypes.object,
  position: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 50
  }
})
