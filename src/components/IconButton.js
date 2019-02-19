import React, { Component } from 'react'
import { TouchableHighlight, View, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'
import colors from '../theme.json'

export default class IconButton extends Component {
  state = {
    pressed: false
  }
  togglePressedState = pressed => {
    this.setState({
      pressed
    })
  }
  render() {
    const { icon, communityIcon, text, imageSource } = this.props
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor={'transparent'}
        onHideUnderlay={() => this.togglePressedState(false)}
        onShowUnderlay={() => this.togglePressedState(true)}
      >
        <View style={this.props.style}>
          {icon && (
            <Icon
              name={icon}
              style={this.props.iconStyle || {}}
              size={this.props.size || 30}
              color={this.state.pressed ? colors.green : colors.palegreen}
            />
          )}
          {communityIcon && (
            <CommunityIcon
              name={communityIcon}
              style={this.props.iconStyle || {}}
              size={this.props.size || 30}
              color={this.state.pressed ? colors.green : colors.palegreen}
            />
          )}
          {imageSource && <Image source={imageSource} />}
          {text && (
            <Text
              style={[
                this.props.textStyle,
                text && !icon && !communityIcon
                  ? {}
                  : {
                      color: this.state.pressed
                        ? colors.green
                        : colors.palegreen
                    }
              ]}
            >
              {text}
            </Text>
          )}
        </View>
      </TouchableHighlight>
    )
  }
}

IconButton.propTypes = {
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  icon: PropTypes.string,
  communityIcon: PropTypes.string,
  size: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageSource: PropTypes.number
}
