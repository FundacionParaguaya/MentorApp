import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import Button from './Button'
import PropTypes from 'prop-types'
import globalStyles from '../globalStyles'

export default class StickyFooter extends Component {
  render() {
    return (
      <View style={[globalStyles.background, styles.contentContainer]}>
        <ScrollView>{this.props.children}</ScrollView>
        {!this.props.hidden && (
          <View style={{ height: 50 }}>
            <Button
              id="continue"
              colored
              text={this.props.continueLabel}
              handleClick={this.props.handleClick}
            />
          </View>
        )}
      </View>
    )
  }
}

StickyFooter.propTypes = {
  children: PropTypes.array.isRequired,
  handleClick: PropTypes.func,
  continueLabel: PropTypes.string,
  hidden: PropTypes.bool
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
