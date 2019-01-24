import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { CheckBox } from 'react-native-elements'
import colors from '../theme.json'
import globalStyles from '../globalStyles'

class Checkbox extends Component {
  state = { checked: false }

  onIconPress = () => {
    this.props.onIconPress(!this.state.checked)
    this.setState({ checked: !this.state.checked })
  }

  render() {
    const { containerStyle, style } = this.props
    return (
      <TouchableOpacity style={styles.touchable} onPress={this.onIconPress}>
        <CheckBox
          disabled
          title={this.props.title}
          iconType="material"
          checkedColor={colors.green}
          checkedIcon="check-box"
          uncheckedIcon="check-box-outline-blank"
          checked={this.state.checked}
          textStyle={globalStyles.subline}
          containerStyle={containerStyle || styles.containerStyle}
          style={style}
        />
      </TouchableOpacity>
    )
  }
}

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  onIconPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  style: PropTypes.object
}

export default Checkbox

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center'
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0
  }
})
