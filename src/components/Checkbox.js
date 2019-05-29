import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableHighlight, StyleSheet } from 'react-native'
import { CheckBox } from 'react-native-elements'
import colors from '../theme.json'
import { getDraft } from '../screens/lifemap/helpers'
import globalStyles from '../globalStyles'

class Checkbox extends Component {
  state = { checked: false }

  onIconPress = () => {
    this.props.onIconPress(!this.state.checked)
    this.setState({ checked: !this.state.checked })
  }
  componentDidMount() {
    const draft = getDraft()
    if (
      typeof this.props.value !== 'undefined' &&
      this.props.value !== null &&
      this.props.codeName !== 'undefined' &&
      this.props.codeName !== null
    ) {
      draft.economicSurveyDataList.forEach(e => {
        if (e.key === this.props.codeName) {
          if (typeof e.multipleValue !== 'undefined') {
            e.multipleValue.forEach(el => {
              if (el === this.props.value) {
                this.setState({ checked: true })
              }
            })
          }
        }
      })
    }
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
          checkedColor={checkboxColor || colors.palegreen}
          checkedIcon="check-box"
          uncheckedIcon="check-box-outline-blank"
          checked={checked}
          containerStyle={containerStyle || styles.containerStyle}
          textStyle={[
            textStyle || styles.label,
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
  value: PropTypes.string,
  codeName: PropTypes.string,
  checkboxColor: PropTypes.string,
  showErrors: PropTypes.bool,
  textStyle: PropTypes.object
}

export default Checkbox

const styles = StyleSheet.create({
  label: {
    color: colors.grey,
    fontWeight: 'normal'
  },
  touchable: {
    justifyContent: 'center',
    marginBottom: 0
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 0,
    paddingBottom: 0
  },
  error: {
    color: colors.palered,
    textDecorationLine: 'underline'
  }
})
