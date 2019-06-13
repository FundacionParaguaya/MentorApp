import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../theme.json'
import Image from './CachedImage'
import globalStyles from '../globalStyles'

const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'palegreen'
}

export default class SliderItem extends Component {
  state = {
    pressed: false
  }
  togglePressedState = pressed => {
    this.setState({
      pressed
    })
  }

  render() {
    const { slide, value } = this.props

    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={'transparent'}
        style={styles.slide}
        onPress={() =>
          setTimeout(() => {
            this.props.onPress()
          }, 0)
        }
        onHideUnderlay={() => this.togglePressedState(false)}
        onShowUnderlay={() => this.togglePressedState(true)}
        accessibilityLabel={value === slide.value ? 'selected' : 'deselected'}
        accessibilityHint={slide.description}
      >
        <View>
          <Image
            source={slide.url}
            style={{
              ...styles.image
            }}
          />
          <View
            id="icon-view"
            style={{
              ...styles.iconBig,
              backgroundColor: colors[slideColors[slide.value]],
              opacity: value === slide.value || this.state.pressed ? 1 : 0
            }}
          >
            <Icon name="done" size={47} color={colors.white} />
          </View>

          <Text
            style={{
              ...globalStyles.p,
              ...styles.text,
              color: slide.value === 2 ? colors.black : colors.white
            }}
          >
            {slide.description}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

SliderItem.propTypes = {
  onPress: PropTypes.func,
  slide: PropTypes.object.isRequired,
  value: PropTypes.number
}

const styles = StyleSheet.create({
  slide: {
    width: '100%'
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    padding: 15
  },
  image: {
    width: '100%',
    borderRadius: 3,
    paddingTop: '100%'
  },
  iconBig: {
    borderRadius: 80,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -50,
    marginBottom: -20
  }
})
