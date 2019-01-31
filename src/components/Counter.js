import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../theme.json'
import globalStyles from '../globalStyles'

class Counter extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.text} </Text>
        <View style={styles.counter}>
          <Text style={styles.count}> {this.props.count} </Text>
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => this.props.editCounter('minus')}
            disabled={this.props.readonly}
          >
            <Icon
              style={styles.icon}
              name="minus"
              color={colors.green}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => this.props.editCounter('plus')}
            disabled={this.props.readonly}
          >
            <Icon
              style={styles.icon}
              name="plus"
              color={colors.green}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

Counter.propTypes = {
  editCounter: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  text: PropTypes.string,
  readonly: PropTypes.bool
}

export default Counter

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    width: '50%',
    ...globalStyles.subline
  },
  counter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderColor: colors.palegrey,
    borderWidth: 1
  },
  countButton: {
    margin: 1,
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 2
  },
  count: {
    color: colors.palegrey,
    fontSize: 20,
    paddingHorizontal: 10
  },
  icon: { padding: 5 }
})
