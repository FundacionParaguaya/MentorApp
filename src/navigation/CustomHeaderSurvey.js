import React, { Component } from 'react'
import { Text, View, StyleSheet, Platform } from 'react-native'
import globalStyles from '../globalStyles'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import colors from '../theme.json'

export class CustomHeaderSurveyComponent extends Component {
  render() {
    const { overview, navigation } = this.props
    const survey = navigation.getParam('survey')
    const stoplightSkipped = this.props.navigation.getParam('stoplightSkipped')
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
        {!overview && (
          <Text style={styles.dimension}>
            {survey.surveyStoplightQuestions[
              navigation.state.params.step
            ].dimension.toUpperCase()}
          </Text>
        )}
        {!overview && (
          <Text style={styles.title}>
            {
              survey.surveyStoplightQuestions[navigation.state.params.step]
                .questionText
            }
          </Text>
        )}
        {overview && (
          <Text style={styles.headerTitleStyle}>
            {!stoplightSkipped
              ? this.props.t('views.yourLifeMap')
              : this.props.t('draftStatus.draft')}
          </Text>
        )}
      </View>
    )
  }
}

CustomHeaderSurveyComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func,
  lng: PropTypes.string,
  overview: PropTypes.bool
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
  },
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    marginLeft: 20,
    color: colors.black
  }
})

const mapStateToProps = ({ lng }) => ({
  lng
})

export default withNamespaces()(
  connect(mapStateToProps)(CustomHeaderSurveyComponent)
)
