import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View } from 'react-native'
import ListItem from './ListItem'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNamespaces } from 'react-i18next';

import colors from '../theme.json'
import globalStyles from '../globalStyles'

class LifemapOverviewListItem extends Component {
  defineColor = value => {
    switch (value) {
      case 1:
        return colors.red
      case 2:
        return colors.gold
      case 3:
        return colors.palegreen
      case 0:
        return colors.palegrey

      default:
        return colors.palegrey
    }
  }

  defineAccessibilityTextForColor = value => {
    switch (value) {
      case 1:
        return 'red'
      case 2:
        return 'yellow'
      case 3:
        return 'green'
      case 0:
        return 'grey'

      default:
        return 'grey'
    }
  }

  syncPriorityStatus = () => {

  }

  render() {
    const { t, pendingPrioritySync, errorPrioritySync } = this.props;
    const disabledButton = this.props.draftOverview
      ? !this.props.color
      : (!this.props.achievement && !this.props.priority) || this.props.readOnly

    return (
      <ListItem
        onPress={this.props.handleClick}
        style={styles.container}
        disabled={disabledButton}
      >
        {this.props.isRetake ? (
          <View style={{ marginRight: -28 }}>
            {this.props.previousAchievement ? (
              <Icon
                name="stars"
                color={colors.blue}
                size={20}
                style={{
                  ...styles.blueIcon,
                  width: 20,
                  height: 20,
                }}
              />
            ) : (
                <View />
              )}
            {this.props.previousPriority ? (
              <View
                style={{
                  ...styles.blueIcon,
                  backgroundColor: colors.blue,
                  width: 20,
                  height: 20,

                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon2 name="pin" color={colors.white} size={12} />
              </View>
            ) : (
                <View />
              )}

            <Icon
              name="brightness-1"
              color={this.defineColor(this.props.previousColor)}
              size={30}
              style={{ marginRight: 15 }}
            />
          </View>
        ) : null}
        <View>
          {this.props.achievement ? (
            <Icon
              name="stars"
              color={colors.blue}
              size={20}
              style={{
                ...styles.blueIcon,
                width: 20,
                height: 20,
                zIndex: 15
              }}
            />
          ) : (
              <View />
            )}
          {this.props.priority ? (
            <View
              style={{
                ...styles.blueIcon,
                backgroundColor: colors.blue,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 15
              }}
            >
              <Icon2 name="pin" color={colors.white} size={12} />
            </View>
          ) : (
              <View />
            )}
          {pendingPrioritySync || errorPrioritySync ? (
            <View
              style={{
                ...styles.blueIcon,
                backgroundColor: colors.grey,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 15
              }}
            >
              <Icon2 name="pin" color={colors.white} size={12} />
            </View>
          ) : (
              <View />
            )}
          <Icon
            name="brightness-1"
            color={this.defineColor(this.props.color)}
            size={40}
            style={{ marginRight: 15, zIndex: 10 }}
          />
        </View>
        <View style={[styles.listItem, styles.borderBottom]}>
          <View>
            <Text
              style={{ ...globalStyles.p }}
              accessibilityLabel={this.props.name}
              accessibilityHint={this.defineAccessibilityTextForColor(
                this.props.color
              )}
            >
              {this.props.name}
            </Text>
            {errorPrioritySync &&
              <Text style={styles.errorLabel}>{t('views.family.priorityError')}</Text>
            }
            {pendingPrioritySync &&
              <Text style={styles.pendingLabel}>{t('views.family.priorityPending')}</Text>
            }
          </View>

          {!disabledButton ? (
            <Icon name="navigate-next" size={23} color={colors.lightdark} />
          ) : (
              <View />
            )}
        </View>
      </ListItem>
    )
  }
}

LifemapOverviewListItem.propTypes = {
  name: PropTypes.string.isRequired,
  achievement: PropTypes.bool,
  priority: PropTypes.bool,
  color: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  draftOverview: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 20,
    maxWidth: '100%'

  },
  listItem: {
    height: 95,
    paddingTop: 25,
    paddingBottom: 25,
    paddingRight: 25,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  borderBottom: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  },
  blueIcon: {
    position: 'absolute',
    right: 15,
    borderRadius: 11,
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: 2,
    zIndex: 10
  },
  pendingLabel: {
    marginTop: 5,
    backgroundColor: colors.grey,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    borderRadius: 10,
    color: 'white',
    alignSelf: 'flex-start'
  },
  errorLabel: {
    marginTop: 5,
    backgroundColor: colors.red,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    borderRadius: 10,
    color: 'white',
    alignSelf: 'flex-start'
  }

})

export default withNamespaces()(LifemapOverviewListItem)
