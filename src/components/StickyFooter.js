import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native'
import Button from './Button'
import ProgressBar from './ProgressBar'
import Tip from './Tip'
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

  setMarginTop = () => {
    let marginTop
    if (!!this.props.progress && this.props.currentScreen !== 'Question') {
      marginTop = -20
    } else if (
      !!this.props.progress &&
      this.props.currentScreen === 'Question'
    ) {
      marginTop = -5
    } else {
      marginTop = 0
    }
    return marginTop
  }

  render() {
    return (
      <View
        style={[
          globalStyles.background,
          styles.contentContainer,
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
            {this.props.children}
          </View>
        ) : (
          <ScrollView>{this.props.children}</ScrollView>
        )}

        {!this.props.readonly &&
        (this.props.visible && this.state.continueVisible) ? (
          <View>
            {this.props.type === 'button' ? (
              <View style={{ height: 50 }}>
                <Button
                  id="continue"
                  colored
                  text={this.props.continueLabel}
                  handleClick={this.props.handleClick}
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

StickyFooter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  handleClick: PropTypes.func,
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

StickyFooter.defaultProps = {
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
