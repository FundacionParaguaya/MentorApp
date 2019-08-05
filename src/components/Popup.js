import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Modal,
  TouchableHighlight,
  ScrollView
} from 'react-native'
import colors from '../theme.json'

export default class Popup extends Component {
  render() {
    const {
      isOpen,
      children,
      onClose,
      modifiedPopUp,
      definition,
      LogoutPopup
    } = this.props

    return (
      <Modal
        visible={!!isOpen}
        transparent
        onRequestClose={onClose}
        animationType="fade"
        presentationStyle="overFullScreen"
      >
        {modifiedPopUp ? (
          <React.Fragment>
            {definition || LogoutPopup ? (
              <View style={styles.definitionParent}>
                <TouchableHighlight
                  underlayColor={'rgba(47,38,28, 0.2)'}
                  style={styles.container}
                  onPress={onClose}
                  id="overlay"
                >
                  <View />
                </TouchableHighlight>
                <ScrollView
                  id="modal"
                  style={
                    LogoutPopup ? styles.modalLogout : styles.modalDefinition
                  }
                  accessible={true}
                  accessibilityLiveRegion="assertive"
                >
                  {children}
                </ScrollView>
              </View>
            ) : (
              <React.Fragment>
                <TouchableHighlight
                  underlayColor={'rgba(47,38,28, 0.2)'}
                  style={styles.container}
                  onPress={onClose}
                  id="overlay"
                >
                  <View />
                </TouchableHighlight>
                <View
                  id="modal"
                  style={styles.priorOrAchievementModal}
                  accessible={true}
                  accessibilityLiveRegion="assertive"
                >
                  {children}
                </View>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <TouchableHighlight
            underlayColor={'rgba(47,38,28, 0.2)'}
            style={styles.container}
            onPress={onClose}
            id="overlay"
          >
            <View
              id="modal"
              style={styles.modal}
              accessible={true}
              accessibilityLiveRegion="assertive"
            >
              {children}
            </View>
          </TouchableHighlight>
        )}
      </Modal>
    )
  }
}

Popup.propTypes = {
  isOpen: PropTypes.bool,
  LogoutPopup: PropTypes.bool,
  definition: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onClose: PropTypes.func,
  modifiedPopUp: PropTypes.bool
}

const styles = StyleSheet.create({
  priorOrAchievementModal: {
    width: '100%',
    position: 'absolute',
    backgroundColor: colors.white,
    paddingVertical: 23,
    padding: 28,
    bottom: 0
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(47,38,28, 0.2)'
  },
  modalDefinition: {
    maxWidth: 400,
    backgroundColor: colors.white,
    paddingVertical: 23,
    padding: 28,
    marginLeft: 20,
    marginRight: 20
  },
  modal: {
    width: 300,

    backgroundColor: colors.white,
    paddingVertical: 23,
    padding: 28,
    marginBottom: 200
  },
  modalLogout: {
    width: 300,
    backgroundColor: colors.white,
    paddingVertical: 23,
    padding: 28,
    marginLeft: 20,
    marginRight: 20
  },
  definitionParent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(47,38,28, 0.2)'
  }
})
