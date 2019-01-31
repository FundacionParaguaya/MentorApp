import React, { Component } from 'react'
import {
  ScrollView,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage,
  Platform
} from 'react-native'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DrawerItems } from 'react-navigation'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { url } from '../../config'
import globalStyles from '../../globalStyles'
import i18n from '../../i18n'
import colors from '../../theme.json'
import { switchLanguage, logout } from '../../redux/actions'
import LogoutPopup from './LogoutPopup'

// Component that renders the drawer menu content. DrawerItems are the links to
// the given views.
export class DrawerContent extends Component {
  state = {
    checkboxesVisible: false,
    ckeckedBoxes: 0,
    showErrors: false
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
            <TouchableOpacity id="en" onPress={() => this.changeLanguage('en')}>
              <Text
                style={[
                  globalStyles.h3,
                  lng === 'en' ? styles.whiteText : styles.greyText
                ]}
              >
                ENG
              </Text>
            </TouchableOpacity>
            <Text style={[globalStyles.h3, styles.whiteText]}>
              {'  '}|{'  '}
            </Text>
            <TouchableOpacity id="es" onPress={() => this.changeLanguage('es')}>
              <Text
                style={[
                  globalStyles.h3,
                  lng === 'es' ? styles.whiteText : styles.greyText
                ]}
              >
                ESP
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            id="username"
            style={[styles.username, globalStyles.h3, styles.whiteText]}
          >
            {user.username}
          </Text>

          {/* Links */}
          <DrawerItems {...this.props} />
        </View>

        {/* Logout button */}
        <TouchableOpacity
          id="logout"
          style={styles.logout}
          onPress={() => {
            this.props.navigation.toggleDrawer()
            navigation.setParams({ logoutModalOpen: true })
          }}
        >
          <CommunityIcon
            name="login-variant"
            size={20}
            color={colors.palegreen}
          />
          <Text style={styles.logoutLabel}>
            {i18n.t('views.logout.logout')}
          </Text>
        </TouchableOpacity>

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
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired
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
  logout: {
    flexDirection: 'row',
    marginLeft: 15,
    marginBottom: 25
  },
  logoutLabel: {
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
