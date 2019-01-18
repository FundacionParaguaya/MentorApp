import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import colors from '../theme.json'
import globalStyles from '../globalStyles'
import stoplight from '../../assets/images/stoplight.png'

class FamiliesListItem extends Component {
  render() {
    const { family } = this.props
    const firstParticipant = this.props.family.familyMemberDTOList.find(
      item => item.firstParticipant
    )
    const birthDate = firstParticipant ? firstParticipant.birthDate : ''

    return (
      <TouchableOpacity
        style={{ ...styles.listItem }}
        onPress={this.props.handleClick}
      >
        <Icon name="face" color={colors.grey} size={40} style={styles.icon} />
        <View style={styles.listItemContainer}>
          <Text style={{ ...globalStyles.p, ...styles.p }}>
            {this.props.family.name}
          </Text>
          <Text style={{ ...globalStyles.p, ...styles.p }}>{birthDate}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

FamiliesListItem.propTypes = {
  family: PropTypes.object.isRequired,
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

export default FamiliesListItem
