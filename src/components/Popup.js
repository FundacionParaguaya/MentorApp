import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  Modal,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  useWindowDimensions
} from 'react-native'
import colors from '../theme.json'
import { isLandscape, isPortrait  } from '../responsivenessHelpers'
import {
  useResponsiveHeight,
  useResponsiveWidth
} from "react-native-responsive-dimensions";
import { isTablet } from 'react-native-device-info';



const Popup = ({
  isOpen,
  children,
  onClose,
  modifiedPopUp,
  definition,
  LogoutPopup,
  projectsModal
}) => {

  const dimensions = useWindowDimensions();
 

  // Styles based on screen size and orientation
  
  let projectsModalStyle = styles.projectsModal;
  // Tablet Horizontal
  if (!!dimensions && isTablet(dimensions) && isLandscape(dimensions)) {
    projectsModalStyle = {
      ...styles.projectsModal,
      maxWidth: useResponsiveWidth(80),
      minWidth: useResponsiveWidth(80),
      minHeight: useResponsiveHeight(70),
      maxHeight: useResponsiveHeight(70)
    }
  }
  // Tablet Vertical
  if (!!dimensions && isTablet(dimensions) && isPortrait(dimensions)) {
    projectsModalStyle = {
      ...styles.projectsModal,
      maxWidth: useResponsiveWidth(60),
      minWidth: useResponsiveWidth(60),
      minHeight: useResponsiveHeight(70),
      maxHeight: useResponsiveHeight(70),
    }
  }

  // Phone Horizontal
  if (!!dimensions && !isTablet(dimensions) && isLandscape(dimensions)) {
    projectsModalStyle = {
      ...styles.projectsModal,
      maxWidth: useResponsiveWidth(80),
      minWidth: useResponsiveWidth(80),
      minHeight: useResponsiveHeight(90),
      maxHeight: useResponsiveHeight(90)
    }
  }

  //Phone Vertical
  if (!!dimensions && !isTablet(dimensions) && isPortrait(dimensions)) {
    projectsModalStyle = {
      ...styles.projectsModal,
      maxWidth: useResponsiveWidth(80),
      minWidth: useResponsiveWidth(80),
      minHeight: useResponsiveHeight(80),
      maxHeight: useResponsiveHeight(80),
    }
  }

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
                      style={projectsModalStyle}
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
  projectsModal: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    paddingHorizontal: 35,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'space-around',
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

export default Popup;