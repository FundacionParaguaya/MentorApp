import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import { CheckBox } from 'react-native-elements'
import colors from '../../theme.json'
import i18n from '../../i18n'

class Checkboxes extends Component {
  state = { checkedAnswers: [], error: false, errorMsg: null }

  onIconPress = value => {
    let newState
    if (!this.state.checkedAnswers.includes(value)) {
      newState = [...this.state.checkedAnswers, value]
    } else {
      newState = this.state.checkedAnswers.filter(
        codeNameAll => codeNameAll !== value
      )
    }
    this.setState({
      checkedAnswers: newState
    })

    this.props.updateAnswers(newState)

    if (this.props.required) {
      this.validateInput(newState)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showErrors !== this.props.showErrors) {
      this.validateInput(this.props.multipleValue)
    }
  }

  componentDidMount() {
    this.setState({
      checkedAnswers: this.props.multipleValue
    })
    // on mount validate empty required fields without showing an errors message
    if (
      this.props.required &&
      !this.props.multipleValue.length &&
      this.props.setError
    ) {
      this.props.setError(true)
      this.setState({
        error: true
      })
    }
  }

  handleError() {
    if (this.props.setError) {
      this.props.setError(true)
    }

    this.setState({
      error: true,
      errorMsg: i18n.t('validation.fieldIsRequired')
    })
  }

  validateInput(freshAnswers) {
    if (this.props.required && !freshAnswers.length) {
      return this.handleError()
    }

    if (this.props.setError) {
      this.props.setError(false)
    }
    this.setState({
      error: false,
      errorMsg: null
    })
  }

  render() {
    const { required, question, readonly } = this.props
    const { errorMsg, error, checkedAnswers } = this.state

    return (
      <View>
        <Text style={{ marginLeft: 10 }}>
          {!required ? question.questionText : `${question.questionText}*`}
        </Text>

        {question.options.map((e, i) => (
          <CheckBox
            key={i}
            onPress={!readonly ? () => this.onIconPress(e.value) : null}
            title={e.text}
            iconType="material"
            checkedColor={colors.green}
            checkedIcon="check-box"
            uncheckedIcon="check-box-outline-blank"
            checked={checkedAnswers.includes(e.value)}
            containerStyle={styles.containerStyle}
            textStyle={[styles.label]}
            accessibilityLabel={`${e.text}${
              !!errorMsg && !checkedAnswers.includes(e.value) ? ' *' : ''
            } ${checkedAnswers.includes(e.value) ? 'checked' : 'unchecked'}`}
          />
        ))}
        {error && !!errorMsg ? (
          <View style={{ marginLeft: 30 }}>
            <Text style={{ color: colors.red }}>{errorMsg}</Text>
          </View>
        ) : null}
      </View>
    )
  }
}

Checkboxes.propTypes = {
  multipleValue: PropTypes.array.isRequired,
  question: PropTypes.object,
  updateAnswers: PropTypes.func,
  setError: PropTypes.func,
  checkboxColor: PropTypes.string,
  showErrors: PropTypes.bool,
  readonly: PropTypes.bool,
  required: PropTypes.bool
}

export default Checkboxes

const styles = StyleSheet.create({
  label: {
    color: colors.grey,
    fontWeight: 'normal'
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginBottom: 0,
    paddingBottom: 0
  }
})
