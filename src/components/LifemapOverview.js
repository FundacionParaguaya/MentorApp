import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import globalStyles from '../globalStyles';
import AddPriorityAndAchievementModal from '../screens/modals/AddPriorityAndAchievementModal';
import LifemapOverviewListItem from './LifemapOverviewListItem';

function LifemapOverview(props) {
  const dimensions = props.surveyData.map((item) => item.dimension);
  const [addAchievementOrPriority, setAddAchievementOrPriority] = useState(
    false,
  );
  const [indicator, setIndicator] = useState('');
  const [color, setColor] = useState(0);
  const [indicatorText, setIndicatorText] = useState('');

  const getColor = (codeName) => {
    const indicator =
      props.draftData && props.draftData.indicatorSurveyDataList
        ? props.draftData.indicatorSurveyDataList.find(
            (item) => item.key === codeName,
          )
        : null;
    if (indicator) {
      return indicator.value;
    } else {
      return;
    }
  };

  const handleClick = (color, indicator, indicatorText) => {
    setAddAchievementOrPriority(true);
    setIndicator(indicator);
    setColor(color);
    setIndicatorText(indicatorText);
  };
  onClose = () => {
    setAddAchievementOrPriority(false);
  };

  const filterByDimension = (item) =>
    props.surveyData.filter((indicator) => {
      const colorCode = getColor(indicator.codeName);
      if (props.selectedFilter === false) {
        return indicator.dimension === item && typeof colorCode === 'number';
      } else if (props.selectedFilter === 'priorities') {
        const priorities = props.draftData.priorities.map(
          (priority) => priority.indicator,
        );
        const achievements = props.draftData.achievements.map(
          (priority) => priority.indicator,
        );

        return (
          indicator.dimension === item &&
          (priorities.includes(indicator.codeName) ||
            achievements.includes(indicator.codeName))
        );
      } else {
        return (
          indicator.dimension === item &&
          typeof colorCode === 'number' &&
          colorCode === props.selectedFilter
        );
      }
    });

  const priorities = props.draftData.priorities.map(
    (priority) => priority.indicator,
  );
  const achievements = props.draftData.achievements.map(
    (priority) => priority.indicator,
  );

  return (
    <View style={styles.container}>
      {/* I am also passing the color because i have to visually display the circle color */}
      {addAchievementOrPriority ? (
        <AddPriorityAndAchievementModal
          onClose={onClose}
          color={color}
          draft={props.draftData}
          indicator={indicator}
          indicatorText={indicatorText}
        />
      ) : null}
      {[...new Set(dimensions)].map((item) => (
        <View key={item}>
          {filterByDimension(item).length ? (
            <Text style={styles.dimension}>{item.toUpperCase()}</Text>
          ) : null}
          {filterByDimension(item).map((indicator) => (
            <LifemapOverviewListItem
              key={indicator.questionText}
              name={indicator.questionText}
              color={getColor(indicator.codeName)}
              draftOverview={props.draftOverview}
              priority={priorities.includes(indicator.codeName)}
              achievement={achievements.includes(indicator.codeName)}
              handleClick={() =>
                handleClick(
                  getColor(indicator.codeName),
                  indicator.codeName,
                  indicator.questionText,
                )
              }
            />
          ))}
        </View>
      ))}
    </View>
  );
}

LifemapOverview.propTypes = {
  surveyData: PropTypes.array.isRequired,
  draftData: PropTypes.object.isRequired,
  draftOverview: PropTypes.bool,
  selectedFilter: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  dimension: {...globalStyles.h3, marginHorizontal: 20, marginVertical: 10},
});

export default LifemapOverview;
