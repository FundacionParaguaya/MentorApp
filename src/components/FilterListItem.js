import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListItem from './ListItem'
import { View, Text, StyleSheet } from 'react-native'

export default class FilterListItem extends Component {
  render() {
    const { dashboard } = this.props
    return (
      <ListItem style={styles.row} onPress={this.props.onPress}>
        {dashboard ? null : (
          <View
            style={[styles.circle, { backgroundColor: this.props.color }]}
          />
        )}
        {/* the code below removes the "()" , the Text component can't have another Text component as a child*/}
        {dashboard ? (
          <Text>{this.props.text}</Text>
        ) : (
          <Text>
            {this.props.text} ({this.props.amount})
          </Text>
        )}
      </ListItem>
    )
  }
}

FilterListItem.propTypes = {
  onPress: PropTypes.func,
  amount: PropTypes.number,
  text: PropTypes.string,
  color: PropTypes.string,
  dashboard: PropTypes.bool
}

const styles = StyleSheet.create({
  circle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginRight: 30
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16
  }
})
