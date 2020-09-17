import React, {Component} from 'react';
import {StyleSheet, View, Text, ProgressBarAndroid} from 'react-native';
import {withNamespaces} from 'react-i18next';
import PropTypes from 'prop-types';

import colors from '../../theme.json';
import globalStyles from '../../globalStyles';
import i18n from '../../i18n';

function SyncInProgress(props) {
  let initalNumOfDraftsPending = props.pendingDraftsLength;
  const currentNumOfDraftsPending =
    initalNumOfDraftsPending - props.pendingDraftsLength;
  return (
    <View style={styles.view}>
      <Text style={globalStyles.h3}>{i18n.t('views.sync.inProgress')}</Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        style={{width: '100%', marginVertical: 20}}
        color={colors.red}
        indeterminate={false}
        progress={currentNumOfDraftsPending / initalNumOfDraftsPending}
      />
      <Text style={globalStyles.p}>
        {`${currentNumOfDraftsPending} ${i18n.t(
          'views.sync.of',
        )} ${initalNumOfDraftsPending} ${i18n.t('views.sync.updates')}`}
      </Text>
    </View>
  );
}

SyncInProgress.propTypes = {
  pendingDraftsLength: PropTypes.number.isRequired,
};
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withNamespaces()(SyncInProgress);
