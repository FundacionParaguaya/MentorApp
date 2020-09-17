import React, {useState} from 'react';
import {TouchableHighlight, View, Text, Image, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import colors from '../theme.json';

function IconButtonComponent(props) {
  const [pressed, setPressed] = useState();
  const togglePressedState = (pressed) => {
    setPressed(pressed);
  };
  const {
    icon,
    communityIcon,
    text,
    imageSource,
    badge,
    offline,
    drafts,
    accessible,
    accessibilityLabel,
  } = props;
  const syncErrors = drafts
    ? drafts.some((draft) => draft.status === 'Sync error')
    : null;
  const syncAvailable = offline.outbox.filter(
    (item) => item.type === 'SUBMIT_DRAFT',
  );
  return (
    <TouchableHighlight
      onPress={props.onPress}
      underlayColor={'transparent'}
      onHideUnderlay={() => togglePressedState(false)}
      onShowUnderlay={() => togglePressedState(true)}>
      <View style={props.style}>
        <View style={{position: 'relative'}}>
          {icon && (
            <Icon
              name={icon}
              style={props.iconStyle || {}}
              size={props.size || 30}
              color={pressed ? colors.palegreen : colors.palegreen}
              accessible={accessible}
              accessibilityLabel={accessibilityLabel}
            />
          )}
          {icon &&
          !text &&
          badge &&
          (syncAvailable.length > 0 || syncErrors) ? (
            <View style={styles.badgePoint} />
          ) : null}
        </View>

        {communityIcon && (
          <CommunityIcon
            name={communityIcon}
            style={props.iconStyle || {}}
            size={props.size || 30}
            color={pressed ? colors.palegreen : colors.palegreen}
          />
        )}
        {imageSource && <Image source={imageSource} />}
        {text && (
          <Text
            style={[
              props.textStyle,
              text && !icon && !communityIcon
                ? {}
                : {
                    color: pressed ? colors.palegreen : colors.palegreen,
                  },
            ]}
            accessible={accessible}
            accessibilityLabel={accessibilityLabel}>
            {text}
          </Text>
        )}
        {icon && text && badge && (syncAvailable.length > 0 || syncErrors) ? (
          <Text style={styles.badge}>
            {!syncErrors ? syncAvailable.length : '!'}
          </Text>
        ) : null}
      </View>
    </TouchableHighlight>
  );
}

IconButtonComponent.propTypes = {
  style: PropTypes.object,
  iconStyle: PropTypes.object,
  icon: PropTypes.string,
  communityIcon: PropTypes.string,
  size: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageSource: PropTypes.number,
  badge: PropTypes.bool,
  drafts: PropTypes.array,
  offline: PropTypes.object.isRequired,
  accessible: PropTypes.bool,
  accessibilityLabel: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

const styles = StyleSheet.create({
  badge: {
    width: 32,
    height: 32,
    lineHeight: 32,
    borderRadius: 32 / 2,
    marginLeft: 20,
    marginTop: -5,
    backgroundColor: colors.palered,
    textAlign: 'center',
    color: '#ffffff',
  },
  badgePoint: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: colors.palered,
    position: 'absolute',
    top: 2,
    right: '50%',
  },
});

const mapStateToProps = ({offline, drafts}) => ({offline, drafts});

export default connect(mapStateToProps)(IconButtonComponent);
