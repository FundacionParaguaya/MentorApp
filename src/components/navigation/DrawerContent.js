import React, { Component } from 'react'
import {
  ScrollView,
  Image,
  Text,
  StyleSheet,
  View,
  AsyncStorage,
  Platform
} from 'react-native'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { url } from '../../config'
import globalStyles from '../../globalStyles'
import IconButton from '../IconButton'
import i18n from '../../i18n'
import colors from '../../theme.json'
import { switchLanguage, logout } from '../../redux/actions'
import LogoutPopup from './LogoutPopup'
import dashboardIcon from '../../../assets/images/icon_dashboard.png'

// Component that renders the drawer menu content. DrawerItems are the links to
// the given views.
export class DrawerContent extends Component {
  state = {
    checkboxesVisible: false,
    ckeckedBoxes: 0,
    showErrors: false,
    activeTab: 'Dashboard'
  }
  changeLanguage = lng => {
    i18n.changeLanguage(lng) // change the currently uses i18n language
    this.props.switchLanguage(lng) // set the redux language for next app use
    this.props.navigation.toggleDrawer() // close drawer
  }
  logUserOut = () => {
    const { checkboxesVisible, ckeckedBoxes } = this.state
    if (!checkboxesVisible || (checkboxesVisible && ckeckedBoxes === 4)) {
      this.setState({
        showErrors: false
      })
      AsyncStorage.clear()
      this.props.logout(url[this.props.env], this.props.user.token)
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
  navigateToScreen = screen => {
    this.setState({ activeTab: screen })
    this.props.navigation.toggleDrawer()
    this.props.navigation.navigate(screen)
  }
  render() {
    const { lng, user, navigation } = this.props
    const { checkboxesVisible, showErrors } = this.state
    const unsyncedDrafts = this.props.drafts.filter(
      draft => draft.status !== 'Synced'
    ).length

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Image
            style={{ height: 172, width: 304 }}
            source={require('../../../assets/images/navigation_image.png')}
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
              onPress={() => this.navigateToScreen('Dashboard')}
              imageSource={dashboardIcon}
              text={i18n.t('views.dashboard')}
              textStyle={styles.label}
            />
            <IconButton
              id="surveys"
              style={{
                ...styles.navItem,
                backgroundColor:
                  this.state.activeTab === 'Surveys' ? colors.primary : null
              }}
              onPress={() => this.navigateToScreen('Surveys')}
              icon="swap-calls"
              size={20}
              textStyle={styles.label}
              text={i18n.t('views.createLifemap')}
            />
            <IconButton
              id="sync"
              style={{
                ...styles.navItem,
                backgroundColor:
                  this.state.activeTab === 'Sync' ? colors.primary : null
              }}
              onPress={() => this.navigateToScreen('Sync')}
              icon="sync"
              size={20}
              text={i18n.t('views.synced')}
              textStyle={styles.label}
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
  lng: PropTypes.string,
  switchLanguage: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development'])
}

const mapStateToProps = ({ env, user, drafts }) => ({
  env,
  user,
  drafts
})

const mapDispatchToProps = {
  switchLanguage,
  logout
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
