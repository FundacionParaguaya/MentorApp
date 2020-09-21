import React from 'react';
import PropTypes from 'prop-types';
import {Text, StyleSheet, Platform} from 'react-native';
import {withNamespaces} from 'react-i18next';
import {connect} from 'react-redux';
import colors from '../theme.json';

function DynamicTitle(props) {
  return (
    <Text
      accessibilityLiveRegion={props.accessibilityAssertiveType}
      style={[styles.headerTitleStyle, props.style]}>
      {props.t(props.title)}
    </Text>
  );
}

DynamicTitle.propTypes = {
  style: PropTypes.object,
  title: PropTypes.string,
  lng: PropTypes.string,
  t: PropTypes.func,
  accessibilityAssertiveType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

DynamicTitle.defaultProps = {
  accessibilityAssertiveType: 'assertive',
};

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
      },
      android: {
        fontFamily: 'Poppins SemiBold',
      },
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    marginLeft: 0,
    color: colors.black,
  },
});

const mapStateToProps = ({lng}) => ({
  lng,
});

export default withNamespaces()(connect(mapStateToProps)(DynamicTitle));
