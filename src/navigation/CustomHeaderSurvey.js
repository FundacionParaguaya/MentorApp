import React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import globalStyles from '../globalStyles';
import {withNamespaces} from 'react-i18next';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import colors from '../theme.json';

function CustomHeaderSurveyComponent(props) {
  const {overview, separatorScreen, navigation, route} = props;

  const survey = route.params.survey;
  const stoplightOptional = survey.surveyConfig.stoplightOptional;
  const stoplightSkipped = route.params.stoplightSkipped;
  return (
    <View
      style={styles.headerQuestions}
      onLayout={(event) => {
        const {height} = event.nativeEvent.layout;
        height > 115 ? navigation.setParams({navigationHeight: height}) : false;
      }}
      accessibilityLiveRegion="assertive">
      {!overview && !separatorScreen && (
        <Text style={styles.dimension}>
          {survey.surveyStoplightQuestions[
            route.params.step
          ].dimension.toUpperCase()}
        </Text>
      )}
      {!overview && !separatorScreen && (
        <Text style={styles.title}>
          {survey.surveyStoplightQuestions[route.params.step].questionText}
        </Text>
      )}
      {overview && (
        <Text style={styles.headerTitleStyle}>
          {!stoplightSkipped
            ? props.t('views.yourLifeMap')
            : props.t('draftStatus.draft')}
        </Text>
      )}
      {separatorScreen && (
        <Text style={styles.headerTitleStyle}>
          {!stoplightOptional
            ? props.t('views.completeStoplight')
            : props.t('views.completeStoplight')}
        </Text>
      )}
    </View>
  );
}

CustomHeaderSurveyComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func,
  lng: PropTypes.string,
  overview: PropTypes.bool,
  separatorScreen: PropTypes.bool,
};

const styles = StyleSheet.create({
  headerQuestions: {
    paddingTop: 20,
    paddingBottom: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  dimension: {
    ...globalStyles.h5,
    ...globalStyles.centerText,
    marginTop: 15,
    paddingTop: 10,
  },
  title: {
    ...globalStyles.h3,
    ...globalStyles.centerText,
    color: colors.dark,
  },
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
      },
      android: {
        fontFamily: 'Poppins SemiBold',
      },
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,

    color: colors.black,
  },
});

const mapStateToProps = ({lng}) => ({
  lng,
});

export default withNamespaces()(
  connect(mapStateToProps)(CustomHeaderSurveyComponent),
);
