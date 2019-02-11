import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native'
import Button from './Button'
import PropTypes from 'prop-types'
import globalStyles from '../globalStyles'

export default class StickyFooter extends Component {
  state = {
    continueVisible: true
  }
  toggleContinue = continueVisible => {
    this.setState({
      continueVisible
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
    return (
      <View style={[globalStyles.background, styles.contentContainer]}>
        <ScrollView>{this.props.children}</ScrollView>
        {this.state.continueVisible ? (
          <View style={{ height: 50 }}>
            <Button
              id="continue"
              colored
              text={this.props.continueLabel}
              handleClick={this.props.handleClick}
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    )
  }
}

StickyFooter.propTypes = {
  children: PropTypes.array.isRequired,
  handleClick: PropTypes.func,
  continueLabel: PropTypes.string
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
