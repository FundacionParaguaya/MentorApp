import React, { Component } from 'react'
import { StyleSheet, Animated } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../../theme.json'

export default class Orb extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animateX: props.startingPosition
        ? new Animated.Value(props.startingPosition.x)
        : props.position.x,
      animateY: props.startingPosition
        ? new Animated.Value(props.startingPosition.y)
        : props.position.y,
      animateColor: new Animated.Value(0)
    }
  }
  cycleAnimation() {
    const { position, startingPosition } = this.props
    const delay = Math.floor(Math.random() * 3000)
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
        ]),
        Animated.timing(this.state.animateColor, {
          toValue: 1,
          duration: 3000,
          delay
        }),
        Animated.parallel([
          Animated.timing(this.state.animateX, {
            toValue: startingPosition.x,
            duration: 3000,
            delay: 3000 - delay
          }),
          Animated.timing(this.state.animateY, {
            toValue: startingPosition.y,
            duration: 3000,
            delay: 3000 - delay
          })
        ]),
        Animated.timing(this.state.animateColor, {
          toValue: 0,
          duration: 1
        })
      ]).start(() => {
        this.cycleAnimation()
      })
    }
  }
  componentDidMount() {
    this.cycleAnimation()
  }
  render() {
    const { animateX, animateY, animateColor } = this.state
    const { size, color } = this.props

    const backgroundColor = animateColor.interpolate({
      inputRange: [0, 1],
      outputRange: [color || colors.yellow, colors.green]
    })

    return (
      <Animated.View
        style={[
          styles.orb,
          this.props.style,
          {
            transform: [{ translateX: animateX }, { translateY: animateY }],
            width: size || 35,
            height: size || 35,
            backgroundColor
          }
        ]}
      />
    )
  }
}

Orb.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  startingPosition: PropTypes.object,
  position: PropTypes.object.isRequired,
  size: PropTypes.number,
  color: PropTypes.string
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 50
  }
})
