import React, { Component } from "react"
import { Text, View, ProgressBarAndroid, StyleSheet } from "react-native"
import PropTypes from "prop-types"
import colors from "../theme.json"

export class ProgressBar extends Component {
  render() {
    return (
      <ProgressBarAndroid
        styleAttr="Horizontal"
        color={colors.green}
        indeterminate={false}
        progress={this.props.progress}
        style={styles.progress}
      />
    )
  }
}

ProgressBar.propTypes = {
  progress: PropTypes.number
}

const styles = StyleSheet.create({
  progress: {
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: -5,
    transform: [{ scaleX: 1.0 }, { scaleY: 2.5 }],
    borderRadius: 20
  }
})

export default ProgressBar
