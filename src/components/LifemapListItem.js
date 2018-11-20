import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native'

import colors from '../theme.json'
import globalStyles from '../globalStyles'
import stoplight from '../../assets/images/stoplight.png'
class LifemapListItem extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{ ...styles.listItem }}
        onPress={this.props.handleClick}
      >
        <Image source={stoplight} style={styles.image} />
        <View style={styles.listItemContainer}>
          <Text style={{ ...globalStyles.p, ...styles.p }}>
            {this.props.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

LifemapListItem.propTypes = {
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  listItem: {
    height: 95,
    paddingLeft: 25,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  listItemContainer: {
    height: 95,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
    marginLeft: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
  },
  image: {
    height: 65,
    width: 65
  },
  p: {
    paddingRight: 20,
    alignSelf: 'center'
  }
})

export default LifemapListItem
