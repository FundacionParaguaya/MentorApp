import React, { Component } from 'react'
import { TouchableHighlight, View, Text, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'
import colors from '../theme.json'

export class IconButton extends Component {
  state = {
    pressed: false
  }
  togglePressedState = pressed => {
    this.setState({
      pressed
    })
  }
  render() {
    const { icon, communityIcon, text, imageSource, badge, offline, drafts } = this.props
    const syncErrors = drafts ? drafts.some(draft => draft.status === 'Sync error') : null
    const syncAvailable = offline.outbox.filter(item => item.type === 'SUBMIT_DRAFT')

    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor={'transparent'}
        onHideUnderlay={() => this.togglePressedState(false)}
        onShowUnderlay={() => this.togglePressedState(true)}
      >
        <View style={this.props.style}>
          <View style={{ position: 'relative' }}>
            {icon && (<Icon
              name={icon}
              style={this.props.iconStyle || {}}
              size={this.props.size || 30}
              color={this.state.pressed ? colors.green : colors.palegreen}/>)
            }
            {icon && !text && badge && (syncAvailable.length > 0 || syncErrors) 
              ? (<View style={styles.badgePoint}></View>) 
              : null}
          </View> 

          {communityIcon && (
            <CommunityIcon
              name={communityIcon}
              style={this.props.iconStyle || {}}
              size={this.props.size || 30}
              color={this.state.pressed ? colors.green : colors.palegreen}
            />
          )}
          {imageSource && <Image source={imageSource} />}
          {text && (
            <Text
              style={[
                this.props.textStyle,
                text && !icon && !communityIcon
                  ? {}
                  : {
                      color: this.state.pressed
                        ? colors.green
                        : colors.palegreen
                    }
              ]}
            >
              {text}
            </Text>
          )}
          {icon && text && badge && (syncAvailable.length > 0 || syncErrors) 
            ? (<Text style={styles.badge}>
                { !syncErrors ? syncAvailable.length : '!' }
              </Text>) 
            : null}
        </View>
      </TouchableHighlight>
    )
  }
}

IconButton.propTypes = {
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
  offline: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  badge: { 
    width: 32, 
    height: 32, 
    lineHeight: 32,
    borderRadius: 32/2,
    marginLeft: 20, 
    marginTop: -5,
    backgroundColor: colors.palered, 
    textAlign: 'center',
    color: '#ffffff' 
  },
  badgePoint: { 
    width: 8, 
    height: 8, 
    borderRadius: 8/2, 
    backgroundColor: colors.palered,
    position: 'absolute',
    top: 2,
    right: '50%' 
  }
})

const mapStateToProps = ({ offline, drafts }) => ({ offline, drafts })

export default connect(mapStateToProps)(IconButton)