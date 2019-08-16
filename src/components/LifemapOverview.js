import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import LifemapOverviewListItem from './LifemapOverviewListItem'
import AddPriorityAndAchievementModal from '../screens/modals/AddPriorityAndAchievementModal'
import globalStyles from '../globalStyles'

class LifemapOverview extends Component {
  dimensions = this.props.surveyData.map(item => item.dimension)
  state = {
    AddAchievementOrPriority: false,
    indicator: '',
    color: 0,
    indicatorText: ''
  }
  getColor = codeName => {
    const indicator =
      this.props.draftData && this.props.draftData.indicatorSurveyDataList
        ? this.props.draftData.indicatorSurveyDataList.find(
            item => item.key === codeName
          )
        : null
    if (indicator) {
      return indicator.value
    } else {
      return
    }
  }

  handleClick(color, indicator, indicatorText) {
    this.setState({
      AddAchievementOrPriority: true,
      indicator: indicator,
      color: color,
      indicatorText: indicatorText
    })
  }
  onClose = () => {
    this.setState({ AddAchievementOrPriority: false })
  }

  filterByDimension = item =>
    this.props.surveyData.filter(indicator => {
      const colorCode = this.getColor(indicator.codeName)
      if (this.props.selectedFilter === false) {
        return indicator.dimension === item && typeof colorCode === 'number'
      } else if (this.props.selectedFilter === 'priorities') {
        const priorities = this.props.draftData.priorities.map(
          priority => priority.indicator
        )
        const achievements = this.props.draftData.achievements.map(
          priority => priority.indicator
        )

        return (
          indicator.dimension === item &&
          (priorities.includes(indicator.codeName) ||
            achievements.includes(indicator.codeName))
        )
      } else {
        return (
          indicator.dimension === item &&
          typeof colorCode === 'number' &&
          colorCode === this.props.selectedFilter
        )
      }
    })

  render() {
    const priorities = this.props.draftData.priorities.map(
      priority => priority.indicator
    )
    const achievements = this.props.draftData.achievements.map(
      priority => priority.indicator
    )
    return (
      <View style={styles.container}>
        {/* I am also passing the color because i have to visually display the circle color */}
        {this.state.AddAchievementOrPriority ? (
          <AddPriorityAndAchievementModal
            onClose={this.onClose}
            color={this.state.color}
            draftId={this.props.draftData.draftId}
            indicator={this.state.indicator}
            indicatorText={this.state.indicatorText}
          />
        ) : null}
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
  draftOverview: PropTypes.bool,
  selectedFilter: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string
  ])
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0
  },
  dimension: { ...globalStyles.h4, marginHorizontal: 20, marginVertical: 10 }
})

export default LifemapOverview
