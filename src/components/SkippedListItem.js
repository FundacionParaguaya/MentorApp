import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, StyleSheet } from 'react-native'
import ListItem from './ListItem'

import colors from '../theme.json'
import globalStyles from '../globalStyles'

class SkippedListItem extends Component {
  handleClick = () => {
    this.props.handleClick(this.props.item)
  }
  render() {
    return (
      <ListItem
        style={{ ...styles.listItem, ...styles.borderBottom }}
        onPress={this.handleClick}
      >
        <Text style={{ ...globalStyles.p, ...styles.text }}>
          {this.props.item.questionText}
        </Text>
        <Icon name="navigate-next" size={23} color={colors.lightdark} />
      </ListItem>
    )
  }
}

SkippedListItem.propTypes = {
  item: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  borderBottom: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  },
  text: { width: '80%' }
})

export default SkippedListItem
