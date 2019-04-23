import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableHighlight, StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import colors from '../theme.json'
import globalStyles from '../globalStyles'

class Counter extends Component {
  state = {
    plusPressed: false,
    minusPressed: false
  }
  togglePressedState = (button, state) => {
    this.setState({
      [button]: state
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.text} * </Text>
        <View style={styles.counter}>
          <Text style={styles.count}> {this.props.count} </Text>
          <TouchableHighlight
            underlayColor={colors.green}
            style={styles.countButton}
            onPress={() => this.props.editCounter('minus')}
            disabled={this.props.readonly}
            onHideUnderlay={() =>
              this.togglePressedState('minusPressed', false)
            }
            onShowUnderlay={() => this.togglePressedState('minusPressed', true)}
          >
            <Icon
              style={styles.icon}
              name="minus"
              color={this.state.minusPressed ? colors.white : colors.green}
              size={30}
              accessibilityRole="button"
              accessibilityLabel="minus"
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.green}
            style={styles.countButton}
            onHideUnderlay={() => this.togglePressedState('plusPressed', false)}
            onShowUnderlay={() => this.togglePressedState('plusPressed', true)}
            onPress={() => this.props.editCounter('plus')}
            disabled={this.props.readonly}
          >
            <Icon
              style={styles.icon}
              name="plus"
              color={this.state.plusPressed ? colors.white : colors.green}
              size={30}
              accessibilityRole="button"
              accessibilityLabel="plus"
            />
          </TouchableHighlight>
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
