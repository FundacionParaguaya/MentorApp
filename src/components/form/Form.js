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

  setError = (error, field) => {
    const { errors } = this.state
    // const { navigation } = this.props

    if (error && !errors.includes(field)) {
      this.setState(previousState => {
        return {
          ...previousState,
          errors: [...previousState.errors, field]
        }
      })
    } else if (!error) {
      this.setState({
        errors: errors.filter(item => item !== field)
      })
    }

    // for this particular screen we need to detect if form is valid
    // in order to delete the draft on exiting
    // if (error || this.state.errors.length) {
    //   navigation.setParams({
    //     deleteDraftOnExit: true
    //   })
    // } else {
    //   navigation.setParams({
    //     deleteDraftOnExit: !navigation.getParam('draftId')
    //   })
    // }
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
    const children = React.Children.map(this.props.children, child => {
      if (formTypes.find(item => item === child.type.displayName)) {
        return React.cloneElement(child, {
          readOnly: this.props.readOnly,
          setError: isError => {
            const { errors } = this.state

            if (isError && !errors.includes(child.props.id)) {
              this.setState({
                errors: [...errors, child.props.id]
              })
              errors.push(child.props.id)
            } else if (!isError) {
              this.setState({
                errors: errors.filter(item => item !== child.props.id)
              })
            }
          },
          showErrors: this.state.showErrors
        })
      } else {
        return child
      }
    })

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

        {!this.props.readOnly &&
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
  visible: PropTypes.bool.isRequired,
  continueLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'tip']),
  tipTitle: PropTypes.string,
  tipIsVisible: PropTypes.bool,
  fullHeight: PropTypes.bool,
  tipDescription: PropTypes.string,
  onTipClose: PropTypes.func,
  readOnly: PropTypes.bool,
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
