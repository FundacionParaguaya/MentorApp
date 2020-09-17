import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import colors from '../theme.json';

function NotificationModal(props) {
  const {label, subLabel} = props;
  return props.isOpen ? (
    <View style={styles.wrapper}>
      <Icon
        style={styles.closeButton}
        color={'#fff'}
        onPress={props.onClose}
        name="close"
        size={24}
        accessible={true}
        accessibilityLabel={'Close'}
      />
      {label && <Text style={styles.label}>{label}</Text>}
      {subLabel && (
        <Text style={[styles.label, styles.sublabel]}>{props.subLabel}</Text>
      )}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.red,
    paddingVertical: 16,
    paddingHorizontal: 31,
    position: 'relative',
  },
  label: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 25,
    textAlign: 'center',
  },
  sublabel: {
    fontWeight: 'normal',
  },
  closeButton: {
    top: 14,
    right: 17,
    position: 'absolute',
  },
});

NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  label: PropTypes.string,
  subLabel: PropTypes.string,
};

export default NotificationModal;
