import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme.json';
import {
  setAccessibleColorName,
  setAccessibleIndicatorName,
} from '../screens/utils/accessibilityHelpers';

function LifemapVisual(props) {
  const getColors = props.questions.map((item) => {
    switch (item.value) {
      case 1:
        return colors.palered;
      case 2:
        return colors.gold;
      case 3:
        return colors.palegreen;
      case 0:
        return colors.palegrey;

      default:
        return colors.palegrey;
    }
  });
  let getUnansweredQuestions =
    props.questionsLength - props.questions.length > 0
      ? Array(props.questionsLength - props.questions.length).fill()
      : [];

  const {large, bigMargin, extraLarge} = props;
  const prioritiesAndAchievements = [
    ...props.priorities.map((priority) => priority.indicator),
    ...props.achievements.map((achievement) => achievement.indicator),
  ];
  let size1 = 10;
  let size2 = 17;
  if (large) {
    size1 = 12;
    size2 = 25;
  }
  if (extraLarge) {
    size2 = 50;
    size1 = 20;
  }
  return (
    <View style={styles.container}>
      {getColors.map((item, i) => (
        <View
          key={i}
          accessible={true}
          accessibilityLabel={
            setAccessibleIndicatorName(props.questions[i].key) || ''
          }
          accessibilityHint={setAccessibleColorName(colors, item) || ''}>
          {prioritiesAndAchievements.includes(props.questions[i].key) &&
          props.questions[i].value ? (
            <Icon
              name="brightness-1"
              color={colors.blue}
              size={size1}
              style={{
                ...styles.iconBlue,
                width: size1,
                height: size1,
                top: bigMargin ? 2 : 0,
                right: bigMargin ? 6 : 3,
                borderRadius: 20,
              }}
            />
          ) : null}
          <Icon
            name="brightness-1"
            color={item}
            size={size2}
            style={{
              marginHorizontal: bigMargin ? 8 : 4,
              marginVertical: bigMargin ? 4 : 2,
            }}
          />
        </View>
      ))}
      {getUnansweredQuestions.map((item, i) => (
        <View key={i}>
          <Icon
            name="brightness-1"
            color={colors.palegrey}
            size={size2}
            style={{
              marginHorizontal: bigMargin ? 8 : 4,
              marginVertical: bigMargin ? 4 : 2,
            }}
          />
        </View>
      ))}
    </View>
  );
}

LifemapVisual.propTypes = {
  questions: PropTypes.array.isRequired,
  questionsLength: PropTypes.number.isRequired,
  achievements: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
  bigMargin: PropTypes.bool,
  large: PropTypes.bool,
  extraLarge: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBlue: {
    right: 3,
    position: 'absolute',

    zIndex: 10,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default LifemapVisual;
