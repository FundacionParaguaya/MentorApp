import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/FontAwesome';
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import colors from '../theme.json';

function Button(props) {
  const [pressed, setPressed] = useState(false);
  const togglePressedState = () => {
    setPressed(!pressed);
  };
  const {
    borderColor,
    disabled,
    colored,
    outlined,
    icon,
    communityIcon,
    handleClick,
    underlined,
    text,
    style,
    testID,
    loading,
  } = props;
  return (
    <TouchableHighlight
      testID={testID}
      style={[
        styles.buttonStyle,
        !colored && !disabled && !loading && !outlined && styles.transparent,
        style,
        ['colored', 'disabled', 'outlined', 'loading'].map((item) =>
          props[item] ? styles[item] : {},
        ),
        {
          borderColor: outlined && borderColor ? borderColor : colors.palegreen,
        },
        pressed &&
          !colored &&
          !underlined && {
            borderColor:
              !borderColor || borderColor === colors.palegreen
                ? colors.palegreen
                : borderColor === colors.palered
                ? colors.red
                : colors.lightdark,
          },
      ]}
      underlayColor={colored ? colors.palegreen : colors.white}
      activeOpacity={1}
      onPress={handleClick}
      disabled={disabled || loading}
      onHideUnderlay={togglePressedState}
      onShowUnderlay={togglePressedState}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityHint={disabled || loading ? 'disabled' : ''}>
      <View style={{flexDirection: 'row'}}>
        {communityIcon && !loading && (
          <CommunityIcon
            name={communityIcon}
            size={21}
            color={colors.palegreen}
            style={styles.icon}
          />
        )}
        {icon && !loading ? (
          <Icon
            name={icon}
            size={21}
            color={pressed ? colors.palegreen : colors.palegreen}
            style={styles.icon}
          />
        ) : (
          <View />
        )}
        {loading && (
          <ActivityIndicator
            size="small"
            color={outlined ? colors.palegreen : colors.white}
            style={{marginRight: 10}}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            outlined && borderColor
              ? {
                  color: borderColor,
                }
              : colored
              ? styles.whiteText
              : styles.greenText,
            underlined ? styles.underlined : {},
            pressed &&
              !colored && {
                color:
                  !borderColor || borderColor === colors.palegreen
                    ? colors.palegreen
                    : borderColor === colors.palered
                    ? colors.red
                    : colors.lightdark,
              },
            props.style && props.style['backgroundColor']
              ? styles.whiteText
              : null,
          ]}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  colored: PropTypes.bool,
  underlined: PropTypes.bool,
  outlined: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  communityIcon: PropTypes.string,
  testID: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

/* eslint-disable react-native/no-unused-styles */
const styles = StyleSheet.create({
  buttonText: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '600',
      },
      android: {
        fontFamily: 'Poppins SemiBold',
      },
    }),
  },
  buttonStyle: {
    borderRadius: 2,
    height: 48,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  underlined: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.palegreen,
  },
  colored: {
    backgroundColor: colors.palegreen,
  },
  outlined: {
    flex: 0,
    borderRadius: 4,
    borderWidth: 1.5,
    padding: 15,
  },
  transparent: {
    backgroundColor: colors.white,
  },
  disabled: {
    backgroundColor: colors.palegrey,
  },
  loading: {
    backgroundColor: colors.palegrey,
  },
  greenText: {
    color: colors.palegreen,
    fontSize: 14,
  },
  whiteText: {
    color: colors.white,
    fontSize: 18,
  },
  icon: {
    marginBottom: 4,
    marginRight: 10,
  },
});

export default Button;
