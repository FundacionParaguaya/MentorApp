import React, { Component } from 'react'
import {
  ScrollView,
  Image,
  Text,
  StyleSheet,
  View,
  Platform,
  AsyncStorage
} from 'react-native'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import globalStyles from '../globalStyles'
import IconButton from '../components/IconButton'
import i18n from '../i18n'
import colors from '../theme.json'
import { switchLanguage, logout, updateNav } from '../redux/actions'
import LogoutPopup from './LogoutPopup'
import dashboardIcon from '../../assets/images/icon_dashboard.png'
import familyNavIcon from '../../assets/images/icon_family_nav.png'

// Component that renders the drawer menu content. DrawerItems are the links to
// the given views.
export class DrawerContent extends Component {
  state = {
    checkboxesVisible: false,
    ckeckedBoxes: 0,
    showErrors: false,
    logingOut: false,
    activeTab: 'Dashboard'
  }

  changeLanguage = lng => {
    i18n.changeLanguage(lng) // change the currently uses i18n language
    this.props.switchLanguage(lng) // set the redux language for next app use
    this.props.navigation.toggleDrawer() // close drawer
  }
  logUserOut = async () => {
    const { checkboxesVisible, ckeckedBoxes } = this.state

    // allow the user to logout only if he checks all boxes
    if (!checkboxesVisible || (checkboxesVisible && ckeckedBoxes === 4)) {
      this.setState({
        showErrors: false,
        logingOut: true
      })

      // delete the cached map packs
      if (MapboxGL.offlineManager) {
        await MapboxGL.offlineManager.deletePack('GECO')
      }

      // clear the async storage and reset the store
      AsyncStorage.clear(() => {
        this.props.logout()
        this.props.navigation.navigate('Login')
      })
    } else {
      this.setState({
        showErrors: true
      })
    }
  }
  showCheckboxes = () => {
    this.setState({
      checkboxesVisible: true
    })
  }
  onPressCheckbox = state => {
    const { ckeckedBoxes } = this.state
    this.setState({
      ckeckedBoxes: state ? ckeckedBoxes + 1 : ckeckedBoxes - 1
    })
  }
  navigateToScreen = (screen, currentStack) => {
    // navigation comes from react-navigation, nav comes from redux
    const { navigation, nav } = this.props

    this.setState({ activeTab: screen })
    navigation.toggleDrawer()

    if (currentStack.key === 'Surveys' && currentStack.index) {
      if (nav.deleteDraftOnExit) {
        this.props.updateNav('openModal', 'deleteDraft')
      } else if (
        navigation.state.routeName === 'Terms' ||
        navigation.state.routeName === 'Privacy'
      ) {
        this.props.updateNav('openModal', 'exitOnTerms')
      } else {
        this.props.updateNav('openModal', 'exitDraft')
      }

      this.props.updateNav('beforeCloseModal', () => {
        // reset navigation
        navigation.popToTop()
        navigation.navigate(this.state.activeTab)
        this.props.updateNav('beforeCloseModal', null)
      })
    } else {
      navigation.navigate(screen)
    }
  }
  render() {
    const { lng, user, navigation } = this.props
    const { checkboxesVisible, showErrors, logingOut } = this.state
    const unsyncedDrafts = this.props.drafts.filter(
      draft => draft.status !== 'Synced'
    ).length
    const { state } = navigation
    const currentStack = state.routes[state.index]

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Image
            style={{ height: 172, width: 304 }}
            source={require('../../assets/images/navigation_image.png')}
          />
          {/* Language Switcher */}
          <View style={styles.languageSwitch}>
            <IconButton
              id="en"
              onPress={() => this.changeLanguage('en')}
              text="ENG"
              textStyle={[
                globalStyles.h3,
                lng === 'en' ? styles.whiteText : styles.greyText
              ]}
              accessible={true}
              accessibilityLabel={'change to English'}
            />
            <Text style={[globalStyles.h3, styles.whiteText]}>
              {'  '}|{'  '}
            </Text>
            <IconButton
              id="es"
              onPress={() => this.changeLanguage('es')}
              text="ESP"
              textStyle={[
                globalStyles.h3,
                lng === 'es' ? styles.whiteText : styles.greyText
              ]}
              accessible={true}
              accessibilityLabel={'change to Spanish'}
            />
          </View>
          <Text
            id="username"
            style={[styles.username, globalStyles.h3, styles.whiteText]}
          >
            {user.username}
          </Text>
          {/* Links */}
        </View>
        <View style={styles.itemsContainer}>
          <View>
            <IconButton
              id="dashboard"
              style={{
                ...styles.navItem,
                backgroundColor:
                  this.state.activeTab === 'Dashboard' ? colors.primary : null
              }}
              onPress={() => this.navigateToScreen('Dashboard', currentStack)}
              imageSource={dashboardIcon}
              text={i18n.t('views.home')}
              textStyle={styles.label}
            />
            <IconButton
              id="surveys"
              style={{
                ...styles.navItem,
                backgroundColor:
                  this.state.activeTab === 'Surveys' ? colors.primary : null
              }}
              onPress={() => this.navigateToScreen('Surveys', currentStack)}
              icon="swap-calls"
              size={20}
              textStyle={styles.label}
              text={i18n.t('views.createLifemap')}
            />
            <IconButton
              id="families"
              style={{
                ...styles.navItem,
                backgroundColor:
                  this.state.activeTab === 'Families' ? colors.primary : null
              }}
              onPress={() => this.navigateToScreen('Families', currentStack)}
              imageSource={familyNavIcon}
              size={20}
              text={i18n.t('views.families')}
              textStyle={styles.label}
            />
            <IconButton
              id="sync"
              style={{
                ...styles.navItem,
                backgroundColor:
                  this.state.activeTab === 'Sync' ? colors.primary : null
              }}
              onPress={() => this.navigateToScreen('Sync', currentStack)}
              icon="sync"
              size={20}
              text={i18n.t('views.synced')}
              textStyle={styles.label}
              badge
            />
          </View>
        </View>
        {/* Logout button */}
        <IconButton
          id="logout"
          style={styles.navItem}
          onPress={() => {
            this.props.navigation.toggleDrawer()
            navigation.setParams({ logoutModalOpen: true })
          }}
          communityIcon="login-variant"
          size={20}
          textStyle={styles.label}
          text={i18n.t('views.logout.logout')}
        />

        {/* Logout popup */}
        <LogoutPopup
          checkboxesVisible={checkboxesVisible}
          showErrors={showErrors}
          navigation={navigation}
          unsyncedDrafts={unsyncedDrafts}
          logUserOut={this.logUserOut}
          showCheckboxes={this.showCheckboxes}
          onPressCheckbox={this.onPressCheckbox}
          logingOut={logingOut}
          onModalClose={() => {
            this.setState({
              checkboxesVisible: false,
              showErrors: false,
              ckeckedBoxes: 0
            })
            navigation.setParams({ logoutModalOpen: false })
          }}
        />
      </ScrollView>
    )
  }
}

DrawerContent.propTypes = {
  nav: PropTypes.object.isRequired,
  lng: PropTypes.string,
  switchLanguage: PropTypes.func.isRequired,
  updateNav: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development'])
}

const mapStateToProps = ({ env, user, drafts, nav }) => ({
  env,
  user,
  drafts,
  nav
})

const mapDispatchToProps = {
  switchLanguage,
  logout,
  updateNav
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DrawerContent)
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  itemsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  greyText: {
    color: colors.palegrey
  },
  whiteText: {
    color: colors.white
  },
  languageSwitch: {
    flexDirection: 'row',
    position: 'absolute',
    top: 40,
    left: 16
  },
  username: {
    position: 'absolute',
    top: 139,
    left: 16
  },
  navItem: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingBottom: 15,
    paddingTop: 15
  },
  label: {
    marginLeft: 20,

    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '600'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontSize: 14,
    color: colors.palegreen
  }
})
