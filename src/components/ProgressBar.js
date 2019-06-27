import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from '../theme.json'

export class ProgressBarComponent extends Component {
  render() {
    const { progress, hideBorder, removePadding } = this.props
    return (
      <View
        style={[
          removePadding ? styles.containerNoPadding : styles.container,
          {
            borderBottomWidth:
              this.props.currentScreen === 'Question' || hideBorder ? 0 : 1
          }
        ]}
      >
        <View
          style={
            removePadding
              ? styles.progressBarContainerNoPadding
              : styles.progressBarContainer
          }
        >
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarIndicator,
                { width: progress * 100 + '%' }
              ]}
            />
          </View>
        </View>
      </View>
    )
  }
}

ProgressBarComponent.propTypes = {
  progress: PropTypes.number,
  currentScreen: PropTypes.string,
  hideBorder: PropTypes.bool,
  removePadding: PropTypes.bool
}

const styles = StyleSheet.create({
  containerNoPadding: {
    borderBottomColor: colors.headerBorder
  },
  container: {
    borderBottomColor: colors.headerBorder,
    paddingBottom: 10,
    marginBottom: 15
  },
  progressBarContainerNoPadding: {
    marginHorizontal: 0
  },
  progressBarContainer: {
    marginHorizontal: 20
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: colors.progressBarBg,
    borderRadius: 5
  },
  progressBarIndicator: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.palegreen
  }
})

export default ProgressBarComponent
