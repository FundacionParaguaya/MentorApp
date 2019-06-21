import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Button from '../Button'
import i18n from '../../i18n'
import colors from '../../theme.json'
import globalStyles from '../../globalStyles'
export class SyncRetry extends Component {
  render() {
    const { draftsWithError, retrySubmit } = this.props
    return (
      <View style={[styles.view, styles.borderBottom]}>
        <Text style={globalStyles.h3}>
          {i18n.t('views.sync.syncErrProblem')}
        </Text>
        <Icon
          style={styles.icon}
          name="exclamation"
          size={60}
          color={colors.palered}
        />
        <View style={styles.buttonWrapper}>
          <Button
            id="retry"
            style={styles.button}
            text="Retry"
            handleClick={retrySubmit}
          />
        </View>
        <Text style={globalStyles.p}>
          {draftsWithError === 1
            ? i18n.t('views.sync.itemHasError').replace('%n', draftsWithError)
            : i18n
                .t('views.sync.itemsHaveError')
                .replace('%n', draftsWithError)}
        </Text>
      </View>
    )
  }
}

SyncRetry.propTypes = {
  draftsWithError: PropTypes.number.isRequired,
  retrySubmit: PropTypes.func.isRequired
}
const styles = StyleSheet.create({
  button: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.palered
  },
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  borderBottom: {
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  },
  icon: {
    paddingVertical: 20
  },
  buttonWrapper: {
    height: 50,
    alignSelf: 'stretch',
    marginBottom: 10,
    alignItems: 'center'
  }
})

export default withNamespaces()(SyncRetry)
