import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../theme.json';

export default function ListItem(props) {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      activeOpacity={1}
      underlayColor={colors.primary}
      disabled={props.disabled}
      accessible={true}>
      <View style={props.style || {}}>{props.children}</View>
    </TouchableHighlight>
  );
}

ListItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};
