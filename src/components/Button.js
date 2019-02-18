import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
  View
} from 'react-native'
import colors from '../theme.json'

class Button extends Component {
  state = {
    pressed: false
  }

  togglePressedState = () => {
    this.setState({
      pressed: !this.state.pressed
    })
  }

  render() {
    const {
      borderColor,
      disabled,
      colored,
      outlined,
      icon,
      handleClick,
      underlined,
      text,
      style
    } = this.props

    const { pressed } = this.state

    return (
      <TouchableHighlight
        style={[
          styles.buttonStyle,
          !colored && !disabled && !outlined && styles.transparent,
          style,
          ['colored', 'disabled', 'outlined'].map(item =>
            this.props[item] ? styles[item] : {}
          ),
          {
            borderColor:
              outlined && borderColor ? borderColor : colors.palegreen
          },
          pressed &&
            !colored &&
            !underlined && {
              borderColor:
                !borderColor || borderColor === colors.palegreen
                  ? colors.green
                  : borderColor === colors.palered
                  ? colors.red
                  : colors.lightdark
            }
        ]}
        underlayColor={colored ? colors.green : colors.white}
        activeOpacity={1}
        onPress={handleClick}
        disabled={disabled}
        onHideUnderlay={this.togglePressedState}
        onShowUnderlay={this.togglePressedState}
      >
        <View style={{ flexDirection: 'row' }}>
          {icon ? (
            <Icon
              name={icon}
              size={21}
              color={pressed ? colors.green : colors.palegreen}
              style={styles.icon}
            />
          ) : (
            <View />
          )}
          <Text
            style={[
              styles.buttonText,
              outlined && borderColor
                ? {
                    color: borderColor
                  }
                : colored
                ? styles.whiteText
                : styles.greenText,
              underlined ? styles.underlined : {},
              pressed &&
                !colored && {
                  color:
                    !borderColor || borderColor === colors.palegreen
                      ? colors.green
                      : borderColor === colors.palered
                      ? colors.red
                      : colors.lightdark
                }
            ]}
          >
            {text}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  colored: PropTypes.bool,
  underlined: PropTypes.bool,
  outlined: PropTypes.bool,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object
}

/* eslint-disable react-native/no-unused-styles */
const styles = StyleSheet.create({
  buttonText: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '600'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    })
  },
  buttonStyle: {
    borderRadius: 2,
    height: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  underlined: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.palegreen
  },
  colored: {
    backgroundColor: colors.palegreen
  },
  outlined: {
    flex: 0,
    borderRadius: 4,
    borderWidth: 1.5,
    padding: 15
  },
  transparent: {
    backgroundColor: colors.white
  },
  disabled: {
    backgroundColor: colors.palegrey
  },
  greenText: {
    color: colors.palegreen,
    fontSize: 14
  },
  whiteText: {
    color: colors.white,
    fontSize: 18
  },
  icon: {
    marginBottom: 4
  }
})

export default Button
