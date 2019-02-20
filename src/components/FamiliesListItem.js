import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from 'moment'

import colors from '../theme.json'
import globalStyles from '../globalStyles'
import ListItem from './ListItem'

class FamiliesListItem extends Component {
  render() {
    const { family } = this.props
    const firstParticipant = family.snapshotList.length
      ? family.snapshotList[0].familyData.familyMembersList.find(
          item => item.firstParticipant
        )
      : null
    const birthDate = firstParticipant ? firstParticipant.birthDate : null

    return (
      <ListItem
        style={{ ...styles.listItem }}
        onPress={this.props.handleClick}
        disabled={!family.snapshotList.length}
      >
        <Icon name="face" color={colors.grey} size={40} style={styles.icon} />
        <View style={styles.listItemContainer}>
          <Text style={{ ...globalStyles.p, ...styles.p }}>{family.name}</Text>
          {family.snapshotList.length ? (
            <Text style={{ ...globalStyles.subline, ...styles.p }}>
              {birthDate
                ? `DOB: ${moment
                    .unix(birthDate)
                    .utc()
                    .format('MMM, DD YYYY')}`
                : ''}
            </Text>
          ) : (
            <Text
              style={{
                ...globalStyles.subline,
                ...styles.p,
                color: colors.palered
              }}
            >
              {this.props.error}
            </Text>
          )}
        </View>
      </ListItem>
    )
  }
}

FamiliesListItem.propTypes = {
  family: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  error: PropTypes.string
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
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center'
  },
  p: {
    paddingRight: 20
  }
})

export default FamiliesListItem
