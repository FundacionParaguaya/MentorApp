import React, { Component } from "react"
import { Text, View, StyleSheet } from "react-native"
import globalStyles from "../../globalStyles"
import PropTypes from "prop-types"
import colors from '../../theme.json'

export default class CustomHeaderSurvey extends Component {
  render() {
    const { title, dimension } = this.props
    return (
      <View style={styles.headerQuestions}>
        <Text style={styles.dimension}>{dimension.toUpperCase()}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    )
  }
}

CustomHeaderSurvey.propTypes = {
  title: PropTypes.string.isRequired,
  dimension: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  headerQuestions: {
    paddingTop: 10,
    paddingBottom: 20,
    marginRight: "auto",
    marginLeft: "auto"
  },
  dimension: {
    ...globalStyles.h5,
    ...globalStyles.centerText,
    marginTop: 15,
    paddingTop: 10
  },
  title: {
    ...globalStyles.h3,
    ...globalStyles.centerText,
    color: colors.dark
  }
})
