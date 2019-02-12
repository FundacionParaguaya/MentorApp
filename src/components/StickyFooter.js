import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import Button from './Button'
import Tip from './Tip'
import PropTypes from 'prop-types'
import globalStyles from '../globalStyles'

export default class StickyFooter extends Component {
  render() {
    return (
      <View style={[globalStyles.background, styles.contentContainer]}>
        <ScrollView>{this.props.children}</ScrollView>
        {this.props.visible ? (
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
  title: PropTypes.string,
  description: PropTypes.string,
  onTipClose: PropTypes.func
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
