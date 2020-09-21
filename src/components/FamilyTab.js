import React from 'react';
import PropTypes from 'prop-types';
import {TouchableHighlight, StyleSheet, Text} from 'react-native';
import colors from '../theme.json';
import globalStyles from '../globalStyles';

function FamilyTab(props) {
  return (
    <TouchableHighlight
      style={{
        ...styles.tab,
        width: props.full ? '100%' : '50%',
        ...(props.active ? styles.activeTab : {}),
      }}
      onPress={props.onPress}
      underlayColor={colors.white}>
      <Text style={globalStyles.h3}>{props.title}</Text>
    </TouchableHighlight>
  );
}

FamilyTab.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool,
  full: PropTypes.bool,
};

export default FamilyTab;

const styles = StyleSheet.create({
  tab: {
    //width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {borderBottomColor: colors.grey, borderBottomWidth: 3},
});
