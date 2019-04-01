import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../theme.json'
class LifemapVisual extends Component {
  getColors = this.props.questions.map(item => {
    switch (item.value) {
      case 1:
        return colors.red
      case 2:
        return colors.gold
      case 3:
        return colors.green
      case 0:
        return colors.palegrey

      default:
        return colors.palegrey
    }
  })

  getUnansweredQuestions =
    this.props.questionsLength - this.props.questions.length > 0
      ? Array(this.props.questionsLength - this.props.questions.length).fill()
      : []

  render() {
    const { large, bigMargin } = this.props
    const prioritiesAndAchievements = [
      ...this.props.priorities.map(priority => priority.indicator),
      ...this.props.achievements.map(priority => priority.indicator)
    ]

    return (
      <View style={styles.container}>
        {this.getColors.map((item, i) => (
          <View key={i}
            accessible={true}
            accessibilityLabel={this.props.questions[i].key}
            accessibilityHint={Object.keys(colors).find(key => colors[key] === item)}
          >
            {prioritiesAndAchievements.includes(this.props.questions[i].key) &&
            this.props.questions[i].value ? (
              <Icon
                name="brightness-1"
                color={colors.blue}
                size={large ? 12 : 10}
                style={{
                  ...styles.iconBlue,
                  width: large ? 12 : 10,
                  height: large ? 12 : 10,
                  top: bigMargin ? 2 : 0,
                  right: bigMargin ? 6 : 3
                }}
              />
            ) : null}
            <Icon
              name="brightness-1"
              color={item}
              size={large ? 25 : 17}
              style={{
                marginHorizontal: bigMargin ? 8 : 4,
                marginVertical: bigMargin ? 4 : 2
              }}
            />
          </View>
        ))}
        {this.getUnansweredQuestions.map((item, i) => (
          <View key={i}>
            <Icon
              name="brightness-1"
              color={colors.palegrey}
              size={large ? 25 : 17}
              style={{
                marginHorizontal: bigMargin ? 8 : 4,
                marginVertical: bigMargin ? 4 : 2
              }}
            />
          </View>
        ))}
      </View>
    )
  }
}

LifemapVisual.propTypes = {
  questions: PropTypes.array.isRequired,
  questionsLength: PropTypes.number.isRequired,
  achievements: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
  bigMargin: PropTypes.bool,
  large: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  iconBlue: {
    right: 3,
    position: 'absolute',

    zIndex: 10,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 5
  }
})

export default LifemapVisual
