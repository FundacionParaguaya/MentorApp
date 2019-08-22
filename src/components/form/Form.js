// Unfortunately something weird and undocumented is happening when using this
// component after building in Android studio. Probably related to
// React.cloneChild. We are for now forced to use in screen view validation.

import { Keyboard, ScrollView, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'

import Button from '../Button'
import ProgressBar from '../ProgressBar'
import PropTypes from 'prop-types'
import Tip from '../Tip'
import globalStyles from '../../globalStyles'

const formTypes = ['TextInput', 'Select', 'LoadNamespace(DateInputComponent)']

export default class Form extends Component {
  state = {
    continueVisible: true,
    errors: [],
    showErrors: false
  }

  setMarginTop = () => {
    let marginTop
    if (!!this.props.progress && this.props.currentScreen !== 'Question') {
      marginTop = -20
    } else {
      marginTop = 0
    }
    return marginTop
  }

  toggleContinue = continueVisible => {
    this.setState({
      continueVisible
    })
  }

  setError = (error, field, memberIndex) => {
    const { onErrorStateChange } = this.props
    const { errors } = this.state

    const fieldName = memberIndex ? `${field}-${memberIndex}` : field

    if (error && !errors.includes(fieldName)) {
      this.setState(previousState => {
        return {
          ...previousState,
          errors: [...previousState.errors, fieldName]
        }
      })
    } else if (!error) {
      this.setState({
        errors: errors.filter(item => item !== fieldName)
      })
    }

    if (onErrorStateChange) {
      onErrorStateChange(error || this.state.errors.length)
    }
  }

  cleanErrorsCodenamesOnUnmount = (field, memberIndex) => {
    const { errors } = this.state
    const fieldName = memberIndex ? `${field}-${memberIndex}` : field
    let errorsDetected = []
    if (fieldName) {
      errorsDetected = errors.filter(item => item !== fieldName)
    }

    this.setState({
      errors: errorsDetected
    })
  }

  validateForm = () => {
    if (this.state.errors.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.props.onContinue()
    }
  }

  generateClonedChild = child =>
    React.cloneElement(child, {
      readonly: this.props.readonly,
      setError: isError =>
        this.setError(isError, child.props.id, child.props.memberIndex || null),
      cleanErrorsOnUnmount:
        child.type &&
        child.type.displayName &&
        child.type.displayName === 'Select'
          ? () =>
              this.cleanErrorsCodenamesOnUnmount(
                child.props.id,
                child.props.memberIndex || false
              )
          : false,
      showErrors: this.state.showErrors
    })

  renderChildrenRecursively = children => {
    let that = this

    return React.Children.map(children, child => {
      if (
        child &&
        child.type &&
        formTypes.some(item => item === child.type.displayName)
      ) {
        return this.generateClonedChild(child)
      } else if (child && child.props && child.props.children) {
        return React.cloneElement(child, {
          children: that.renderChildrenRecursively(
            Array.isArray(child.props.children)
              ? child.props.children
              : [child.props.children]
          )
        })
      } else {
        return child
      }
    })
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.toggleContinue(false)
    )
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.toggleContinue(true)
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  render() {
    // map children and add validation props to input related ones
    const children = this.renderChildrenRecursively(this.props.children)
    return (
      <View
        style={[
          globalStyles.background,
          !!this.props.currentScreen && this.props.currentScreen === 'Question'
            ? { paddingTop: 15 }
            : { ...styles.contentContainer },
          { marginTop: this.setMarginTop() }
        ]}
      >
        {!!this.props.progress && (
          <ProgressBar
            progress={this.props.progress}
            currentScreen={this.props.currentScreen || ''}
          />
        )}
        {this.props.fullHeight ? (
          <View
            style={{ width: '100%', flexGrow: 2, marginTop: -15 }}
            keyboardShouldPersistTaps={'handled'}
          >
            {children}
          </View>
        ) : (
          <ScrollView>{children}</ScrollView>
        )}

        {!this.props.readonly &&
        (this.props.visible && this.state.continueVisible) ? (
          <View>
            {/* i have changed the height to 61 because there was a weird whitespace if we dont have the progress bar */}
            {this.props.type === 'button' ? (
              <View style={{ height: 61 }}>
                <Button
                  id="continue"
                  colored
                  text={this.props.continueLabel}
                  handleClick={this.validateForm}
                />
              </View>
            ) : (
              <Tip
                visible={this.props.tipIsVisible}
                title={this.props.tipTitle}
                onTipClose={this.props.onTipClose}
                description={this.props.tipDescription}
              />
            )}
          </View>
        ) : null}
      </View>
    )
  }
}

Form.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  onContinue: PropTypes.func,
  onErrorStateChange: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  continueLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'tip']),
  tipTitle: PropTypes.string,
  tipIsVisible: PropTypes.bool,
  fullHeight: PropTypes.bool,
  tipDescription: PropTypes.string,
  onTipClose: PropTypes.func,
  readonly: PropTypes.bool,
  progress: PropTypes.number,
  currentScreen: PropTypes.string
}

Form.defaultProps = {
  type: 'button',
  visible: true
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  }
})
