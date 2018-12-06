import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../theme.json'
class LifemapVisual extends Component {
  getColors = () =>
    this.props.questions.map(item => {
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

  prioritiesAndAchievements = [
    ...this.props.priorities.map(priority => priority.indicator),
    ...this.props.achievements.map(priority => priority.indicator)
  ]

  render() {
    return (
      <View style={styles.container}>
        {this.getColors().map((item, i) => (
          <View key={i}>
            {this.prioritiesAndAchievements.includes(
              this.props.questions[i].key
            ) && this.props.questions[i].value ? (
              <Icon
                name="brightness-1"
                color={colors.blue}
                size={10}
                style={styles.iconBlue}
              />
            ) : (
              <View />
            )}
            <Icon
              name="brightness-1"
              color={item}
              size={17}
              style={{ marginHorizontal: this.props.bigMargin ? 7 : 4 }}
            />
          </View>
        ))}
      </View>
    )
  }
}

LifemapVisual.propTypes = {
  questions: PropTypes.array.isRequired,
  achievements: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
  bigMargin: PropTypes.bool
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap' },
  iconBlue: {
    right: 4,
    top: -2,
    position: 'absolute',
    width: 10,
    height: 10,
    zIndex: 10,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 5
  }
})

export default LifemapVisual
