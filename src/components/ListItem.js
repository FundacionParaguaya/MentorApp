import React, { Component } from 'react'
import { TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../theme.json'

export default class ListItem extends Component {
  state = { pressed: false }
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        activeOpacity={1}
        underlayColor={colors.primary}
        disabled={this.props.disabled}
      >
        <View style={this.props.style || {}}>{this.props.children}</View>
      </TouchableHighlight>
    )
  }
}

ListItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool
}