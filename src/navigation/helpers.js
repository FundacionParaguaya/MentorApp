import React from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import BackDraftPopup from './BackDraftPopup'
import colors from '../theme.json'
import IconButton from '../components/IconButton'
import CloseButton from './CloseButton'
import i18n from '../i18n'

// Each of the major views has a stack that needs the same nav options.
// These options handle the header styles and menu icon.
export const generateNavStyles = ({
  navigation,
  shadowHeader = true,
  headerHeight = 66
}) => ({
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
    height: headerHeight,
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
  headerLeft: (
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
          accessibilityLabel={`${i18n.t('general.goBack')}`}
        />
        <BackDraftPopup
          navigation={navigation}
          isOpen={navigation.getParam('backModalOpen')}
          onClose={() => navigation.setParams({ backModalOpen: false })}
          routeName={navigation.state.routeName}
        />
      </View>
    </AndroidBackHandler>
  ),
  // empty view to help center titles where there is no close icon
  headerRight: <View style={{ width: 25 }} />
})

export const addMenuIcon = navigation => ({
  headerLeft: (
    <IconButton
      style={styles.touchable}
      onPress={() => navigation.toggleDrawer()}
      icon="menu"
      size={30}
      badge
      accessible={true}
      accessibilityLabel={`${i18n.t('general.navigation')}`}
    />
  )
})

export const addCloseIcon = navigation =>
  !navigation.getParam('family') ? (
    {
      headerRight: (
        <CloseButton navigation={navigation} style={styles.touchable} />
      )
    }
  ) : (
    <View />
  )

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    width: 60,
    height: 60
  }
})
