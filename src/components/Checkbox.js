import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableHighlight, StyleSheet } from 'react-native'
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
    const { checked } = this.state
    const { containerStyle, textStyle, checkboxColor, showErrors } = this.props

    return (
      <TouchableHighlight
        underlayColor={'transparent'}
        style={styles.touchable}
        onPress={this.onIconPress}
      >
        <CheckBox
          disabled
          title={`${this.props.title}${showErrors && !checked ? ' *' : ''}`}
          iconType="material"
          checkedColor={checkboxColor || colors.green}
          checkedIcon="check-box"
          uncheckedIcon="check-box-outline-blank"
          checked={checked}
          containerStyle={containerStyle || styles.containerStyle}
          textStyle={[
            textStyle || globalStyles.subline,
            showErrors && !checked ? styles.error : {}
          ]}
          accessibilityLabel={`${this.props.title}${
            showErrors && !checked ? ' *' : ''
          } ${checked === true ? 'checked' : 'unchecked'}`}
        />
      </TouchableHighlight>
    )
  }
}

Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  onIconPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  checkboxColor: PropTypes.string,
  showErrors: PropTypes.bool,
  textStyle: PropTypes.object
}

export default Checkbox

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center'
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  error: {
    color: colors.palered,
    textDecorationLine: 'underline'
  }
})
