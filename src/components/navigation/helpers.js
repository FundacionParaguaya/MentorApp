import React from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import ExitDraftPopup from './ExitDraftPopup'
import BackDraftPopup from './BackDraftPopup'
import colors from '../../theme.json'
import IconButton from '../IconButton'

// Each of the major views has a stack that needs the same nav options.
// These options handle the header styles and menu icon.
export const generateNavOptions = ({ navigation, burgerMenu = true, shadowHeader = true }) => ({
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    marginLeft: shadowHeader ? 20 : 'auto',
    marginRight: shadowHeader ? 0 : 'auto' 
  },
  headerStyle: {
    height: 66,
    backgroundColor: colors.white,
    elevation: shadowHeader ? 1 : 0,
    paddingTop: shadowHeader ? 0 : 10 
  },
  headerLeftContainerStyle: {
    marginLeft: 19
  },
  headerRightContainerStyle: {
    marginRight: -16
  },
  headerRight:
    !navigation.getParam('family') &&
    !navigation.getParam('member') &&
    navigation.state.routeName !== 'Final' &&
    !burgerMenu &&
    !navigation.getParam('withoutCloseButton') ? (
      <View>
        <IconButton
          style={styles.touchable}
          onPress={() => navigation.setParams({ modalOpen: true })}
          icon="close"
          size={25}
          accessible={true}
          accessibilityLabel={'Exit'}
        />
        <ExitDraftPopup
          isOpen={navigation.getParam('modalOpen')}
          onClose={() => navigation.setParams({ modalOpen: false })}
          navigation={navigation}
          routeName={navigation.state.routeName}
          deleteOnExit={navigation.getParam('deleteOnExit')}
          draftId={navigation.getParam('draftId')}
        />
      </View>
    ) : (
      <View />
    ),
  headerLeft: burgerMenu ? (
    <IconButton
      style={styles.touchable}
      onPress={() => navigation.toggleDrawer()}
      icon="menu"
      size={30}
      badge
      accessible={true}
      accessibilityLabel={'Navigation'}
    />
  ) : (
    <AndroidBackHandler
      onBackPress={() => {
        if (navigation.getParam('onPressBack')) {
          navigation.getParam('onPressBack')()
        }
        return true
      }}
    >
      <View>
        <IconButton
          style={styles.touchable}
          onPress={() => {
            if (navigation.getParam('deleteOnExit')) {
              navigation.setParams({ backModalOpen: true })
            } else {
              navigation.setParams({ backModalOpen: false })
              navigation.getParam('onPressBack')
                ? navigation.getParam('onPressBack')()
                : navigation.goBack()
            }
          }}
          icon="arrow-back"
          size={25}
          accessible={true}
          accessibilityLabel={'Go back'}
        />
        <BackDraftPopup
          navigation={navigation}
          isOpen={navigation.getParam('backModalOpen')}
          onClose={() => navigation.setParams({ backModalOpen: false })}
          routeName={navigation.state.routeName}
        />
      </View>
    </AndroidBackHandler>
  )
})

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    width: 60,
    height: 60
  }
})
