import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import globalStyles from '../globalStyles'
import PropTypes from 'prop-types'
import colors from '../theme.json'
import { connect } from 'react-redux'

export class CustomHeaderSurveyComponent extends Component {
  render() {
    const { navigation, nav } = this.props

    return (
      <View
        style={styles.headerQuestions}
        onLayout={event => {
          const { height } = event.nativeEvent.layout
          height > 115
            ? navigation.setParams({ navigationHeight: height })
            : false
        }}
        accessibilityLiveRegion="assertive"
      >
        <Text style={styles.dimension}>
          {nav.survey.surveyStoplightQuestions[
            navigation.state.params.step
          ].dimension.toUpperCase()}
        </Text>
        <Text style={styles.title}>
          {
            nav.survey.surveyStoplightQuestions[navigation.state.params.step]
              .questionText
          }
        </Text>
      </View>
    )
  }
}

CustomHeaderSurveyComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  headerQuestions: {
    paddingTop: 10,
    paddingBottom: 20,
    marginRight: 'auto',
    marginLeft: 'auto'
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

const mapStateToProps = ({ nav }) => ({
  nav
})

export default connect(mapStateToProps)(CustomHeaderSurveyComponent)
