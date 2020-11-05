import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Modal,
  TouchableHighlight,
  ScrollView,
  Dimensions
} from 'react-native'
import colors from '../theme.json'
import { isLandscape } from '../responsivenessHelpers'

export default class Popup extends Component {
  render() {
    const {
      isOpen,
      children,
      onClose,
      modifiedPopUp,
      definition,
      LogoutPopup,
      projectsModal
    } = this.props

    const { width, height } = Dimensions.get('window')

    return (
      <Modal
        visible={!!isOpen}
        transparent
        onRequestClose={onClose}
        animationType="fade"
        presentationStyle="overFullScreen"
      >
        {modifiedPopUp ? (
          <View style={{ flex: 1 }}>
            {definition || LogoutPopup || projectsModal ? (
              <View style={styles.definitionParent}>
                <TouchableHighlight
                  underlayColor={'rgba(47,38,28, 0.2)'}
                  style={styles.container}
                  onPress={onClose}
                  id="overlay"
                >
                  <View />
                </TouchableHighlight>

                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {projectsModal ? (
                      <View
                        id="modal"
                        style={isLandscape({ width, height }) ? styles.projectsModalHorizontal: styles.projectsModalVertical}
                        accessible={true}
                        accessibilityLiveRegion="assertive"
                      >
                        {children}
                      </View>

                    ) : (
                        <ScrollView
                          id="modal"
                          style={
                            LogoutPopup
                              ? styles.modalLogout
                              : styles.modalDefinition
                          }
                          accessible={true}
                          accessibilityLiveRegion="assertive"
                        >
                          {children}
                        </ScrollView>
                      )}

                  </View>
                </View>
              </View>
            ) : (
                <View style={{ flex: 1 }}>
                  <TouchableHighlight
                    underlayColor={'rgba(47,38,28, 0.2)'}
                    style={styles.container}
                    onPress={onClose}
                    id="overlay"
                  >
                    <View />
                  </TouchableHighlight>
                  <View id="modal" style={styles.priorOrAchievementModal}>
                    {children}
                  </View>
                </View>
              )}
          </View>
        ) : (
            <TouchableHighlight
              underlayColor={'rgba(47,38,28, 0.2)'}
              style={styles.container}
              onPress={onClose}
              id="overlay"
            >
              <View id="modal" style={styles.modal}>
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
  projectsModalHorizontal: {
    maxWidth: '90%',
    width: '90%',
    minWidth: '90%',
    minHeight: 325,
    height: '100%',
    backgroundColor: colors.white,
    paddingVertical: 23,
    paddingHorizontal: 28,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  projectsModalVertical: {
    maxWidth: '100%',
    width: '80%',
    minWidth: '60%',
    minHeight: 500,
    height: '100%',
    backgroundColor: colors.white,
    paddingVertical: 23,
    paddingHorizontal: 28,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  modalLogout: {
    backgroundColor: colors.white,
    padding: 28
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
