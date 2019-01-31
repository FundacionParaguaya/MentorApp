import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import LifemapOverviewListItem from './LifemapOverviewListItem'

import globalStyles from '../globalStyles'

class LifemapOverview extends Component {
  dimensions = this.props.surveyData.map(item => item.dimension)

  getColor = color => {
    const indicator = this.props.draftData.indicatorSurveyDataList.find(
      item => item.key === color
    )
    if (indicator) {
      return indicator.value
    } else {
      return
    }
  }

  handleClick(color, indicator, indicatorText) {
    if (color === 3) {
      return this.props.navigateToScreen(
        'AddAchievement',
        indicator,
        indicatorText
      )
    } else if (color === 2 || color === 1) {
      return this.props.navigateToScreen(
        'AddPriority',
        indicator,
        indicatorText
      )
    }
  }
  filterByDimension = item =>
    this.props.surveyData.filter(
      indicator =>
        indicator.dimension === item &&
        typeof this.getColor(indicator.codeName) === 'number'
    )
  render() {
    const priorities = this.props.draftData.priorities.map(
      priority => priority.indicator
    )
    const achievements = this.props.draftData.achievements.map(
      priority => priority.indicator
    )
    return (
      <View style={styles.container}>
        {[...new Set(this.dimensions)].map(item => (
          <View key={item}>
            {this.filterByDimension(item).length ? (
              <Text style={styles.dimension}>{item.toUpperCase()}</Text>
            ) : null}
            {this.filterByDimension(item).map(indicator => (
              <LifemapOverviewListItem
                key={indicator.questionText}
                name={indicator.questionText}
                color={this.getColor(indicator.codeName)}
                draftOverview={this.props.draftOverview}
                priority={priorities.includes(indicator.codeName)}
                achievement={achievements.includes(indicator.codeName)}
                handleClick={() =>
                  this.handleClick(
                    this.getColor(indicator.codeName),
                    indicator.codeName,
                    indicator.questionText
                  )
                }
              />
            ))}
          </View>
        ))}
      </View>
    )
  }
}

LifemapOverview.propTypes = {
  surveyData: PropTypes.array.isRequired,
  draftData: PropTypes.object.isRequired,
  navigateToScreen: PropTypes.func.isRequired,
  draftOverview: PropTypes.bool
}

const styles = StyleSheet.create({
  container: { ...globalStyles.container, paddingTop: 0, paddingLeft: 25 },
  dimension: { ...globalStyles.h4, marginVertical: 12 }
})

export default LifemapOverview
