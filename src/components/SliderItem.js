import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../theme.json'
import Image from './CachedImage'
import globalStyles from '../globalStyles'
import { isPortrait } from '../responsivenessHelpers'

const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'green'
}

export default class SliderItem extends Component {
  state = {
    pressed: false,
    textContentHeight: 0
  }
  togglePressedState = pressed => {
    this.setState({
      pressed
    })
  }
  calculateTextContentHeight = event => {
    this.setState({ textContentHeight: event.nativeEvent.layout.height })
  }

  render() {
    const { slide, value, bodyHeight, dimensions } = this.props
    const slideHeight = bodyHeight - 100
    const imageHeight = bodyHeight / 2
    const textAreaHeight = slideHeight - imageHeight // - 30 is margin top on image + icon

    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={'transparent'}
        style={[
          styles.slide,
          !!dimensions && !!isPortrait(dimensions) ? { height: slideHeight } : {}
        ]}
        onPress={this.props.onPress}
        onHideUnderlay={() => this.togglePressedState(false)}
        onShowUnderlay={() => this.togglePressedState(true)}
      >
        <View>
          <Image
            source={slide.url}
            style={{
              ...styles.image,
              height: !!dimensions && !!isPortrait(dimensions) ? imageHeight : imageHeight * 2
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

          <View
            style={[
              !!dimensions && !!isPortrait(dimensions) ? { height: textAreaHeight } : {},
              { paddingBottom: 15 }
            ]}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                height: this.textContentHeight,
                paddingBottom: 30
              }}
            >
              <Text
                onLayout={event => this.calculateTextContentHeight(event)}
                style={{
                  ...globalStyles.p,
                  ...styles.text,
                  color: slide.value === 2 ? colors.black : colors.white
                }}
              >
                {slide.description}
              </Text>
            </ScrollView>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

SliderItem.propTypes = {
  onPress: PropTypes.func,
  slide: PropTypes.object.isRequired,
  value: PropTypes.number,
  dimensions: PropTypes.object,
  bodyHeight: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
  slide: {
    // width: '100%'
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 18,
    lineHeight: 23,
    fontFamily: 'Poppins',
    alignSelf: 'center'
  },
  textVertical: {
    flex: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%'
    // marginTop: 10
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
