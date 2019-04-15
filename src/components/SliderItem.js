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
  3: 'green'
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
    const { slide, value, bodyHeight } = this.props
    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={'transparent'}
        style={[styles.slide, {height: bodyHeight - 90 }]}
        onPress={this.props.onPress}
        onHideUnderlay={() => this.togglePressedState(false)}
        onShowUnderlay={() => this.togglePressedState(true)}
      >
        <View>
          <Image
            source={slide.url}
            style={{
              ...styles.image,
              height: bodyHeight / 2
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
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: 'Poppins'
  },
  image: {
    width: '100%',
    marginTop: 10
  },
  iconBig: {
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -30,
    marginBottom: -20
  }
})
