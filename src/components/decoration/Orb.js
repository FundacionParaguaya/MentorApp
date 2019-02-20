import React, { Component } from 'react'
import { StyleSheet, Animated, Easing } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../../theme.json'

export default class Orb extends Component {
  state = {
    animateX: new Animated.Value(0),
    animateY: new Animated.Value(0),
    animateScale: new Animated.Value(1),
    animateColor: new Animated.Value(0)
  }

  // animation sequence
  cycleAnimation() {
    const { position } = this.props
    const { animateX, animateY, animateColor, animateScale } = this.state
    const delay = Math.floor(Math.random() * 300)
    Animated.sequence([
      Animated.parallel([
        Animated.timing(animateX, {
          toValue: position.x,
          duration: 1500,
          delay: 500,
          easing: Easing.elastic()
        }),
        Animated.timing(animateY, {
          toValue: position.y,
          duration: 1500,
          delay: 500,
          easing: Easing.elastic()
        })
      ]),
      Animated.timing(animateScale, {
        toValue: 0.5,
        duration: 100,
        delay
      }),
      Animated.timing(animateColor, {
        toValue: 1,
        duration: 1
      }),
      Animated.timing(animateScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(3)
      }),
      Animated.parallel([
        Animated.timing(animateX, {
          toValue: 0,
          duration: 1500,
          delay: 500 - delay,
          easing: Easing.back()
        }),
        Animated.timing(animateY, {
          toValue: 0,
          duration: 1500,
          delay: 500 - delay,
          easing: Easing.back()
        })
      ]),
      Animated.timing(animateColor, {
        toValue: 0,
        duration: 1
      })
    ]).start(done => {
      if (done.finished) {
        this.cycleAnimation()
      }
    })
  }
  componentDidMount() {
    this.cycleAnimation()
  }
  render() {
    const { animateX, animateY, animateColor, animateScale } = this.state
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
            transform: [
              { translateX: animateX },
              { translateY: animateY },
              { scaleX: animateScale },
              { scaleY: animateScale }
            ],
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
