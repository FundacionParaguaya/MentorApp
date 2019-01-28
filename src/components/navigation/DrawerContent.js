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
import Icon from 'react-native-vector-icons/MaterialIcons'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Checkbox from '../Checkbox'
import { url } from '../../config'
import globalStyles from '../../globalStyles'
import i18n from '../../i18n'
import colors from '../../theme.json'
import { switchLanguage, logout } from '../../redux/actions'
import Popup from '../Popup'
import Button from '../Button'

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
    if (this.state.ckeckedBoxes === 4) {
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
        <Popup
          isOpen={navigation.getParam('logoutModalOpen')}
          onClose={() => {
            this.setState({
              checkboxesVisible: false
            })
            navigation.setParams({ logoutModalOpen: false })
          }}
        >
          <View style={{ alignItems: 'flex-end' }}>
            <Icon name="close" size={20} />
          </View>

          <View style={styles.modalContainer}>
            <View style={{ alignItems: 'center' }}>
              {!checkboxesVisible ? (
                <Icon
                  name="sentiment-dissatisfied"
                  color={colors.lightdark}
                  size={44}
                />
              ) : (
                <CommunityIcon
                  name="exclamation"
                  color={colors.palered}
                  size={60}
                />
              )}
              <Text
                style={[
                  styles.title,
                  checkboxesVisible ? { color: colors.palered } : {}
                ]}
              >
                {!checkboxesVisible
                  ? i18n.t('views.logout.logout')
                  : `${i18n.t('general.warning')}!`}
              </Text>
            </View>

            {/* Popup text */}
            {!checkboxesVisible ? (
              <View>
                {unsyncedDrafts ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={globalStyles.h3}>
                      {i18n.t('views.logout.youHaveUnsynchedData')}
                    </Text>
                    <Text style={[globalStyles.h3, { color: colors.palered }]}>
                      {i18n.t('views.logout.thisDataWillBeLost')}
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={globalStyles.h3}>
                      {i18n.t('views.logout.weWillMissYou')}
                    </Text>
                    <Text
                      style={[globalStyles.h3, { color: colors.palegreen }]}
                    >
                      {i18n.t('views.logout.comeBackSoon')}
                    </Text>
                  </View>
                )}
                <Text style={[styles.confirm, globalStyles.h3]}>
                  {i18n.t('views.logout.areYouSureYouWantToLogOut')}
                </Text>
              </View>
            ) : (
              // Checkboxes section
              <View style={{ alignItems: 'center' }}>
                <View style={{ marginBottom: 25, alignItems: 'center' }}>
                  <Text style={globalStyles.h3}>
                    {i18n.t('views.logout.looseYourData')}
                  </Text>
                  <Text style={[globalStyles.h3, { color: colors.palered }]}>
                    {i18n.t('views.logout.cannotUndo')}
                  </Text>
                </View>
                <View style={{ marginBottom: 15 }}>
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={this.onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.drafts'
                    )}`}
                  />
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={this.onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.lifeMaps'
                    )}`}
                  />
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={this.onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.familyInfo'
                    )}`}
                  />
                  <Checkbox
                    containerStyle={styles.checkbox}
                    checkboxColor={colors.palered}
                    textStyle={styles.checkboxText}
                    showErrors={showErrors}
                    onIconPress={this.onPressCheckbox}
                    title={`${i18n.t('general.delete')} ${i18n.t(
                      'general.cachedData'
                    )}`}
                  />
                </View>
              </View>
            )}

            {/* Buttons bar */}
            <View style={styles.buttonBar}>
              <Button
                outlined
                text={
                  checkboxesVisible
                    ? i18n.t('general.delete')
                    : i18n.t('general.yes')
                }
                borderColor={unsyncedDrafts ? colors.palered : colors.palegreen}
                style={{ width: 107, alignSelf: 'flex-start' }}
                handleClick={
                  unsyncedDrafts && !checkboxesVisible
                    ? this.showCheckboxes
                    : this.logUserOut
                }
              />
              <Button
                outlined
                borderColor={colors.grey}
                text={
                  !checkboxesVisible
                    ? i18n.t('general.no')
                    : i18n.t('general.cancel')
                }
                style={{ width: 107, alignSelf: 'flex-end' }}
                handleClick={() => {
                  this.setState({
                    checkboxesVisible: false
                  })
                  navigation.setParams({ logoutModalOpen: false })
                }}
              />
            </View>
          </View>
        </Popup>
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
  },
  modalContainer: {
    marginTop: 60
  },
  title: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '600'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontWeight: 'normal',
    color: colors.lightdark,
    fontSize: 24,
    marginBottom: 25
  },
  confirm: {
    color: colors.lightdark,
    marginTop: 25,
    marginBottom: 16,
    textAlign: 'center'
  },
  buttonBar: {
    marginBottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  checkbox: {
    marginTop: 0,
    marginBottom: 18,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  checkboxText: {
    fontWeight: 'normal',
    fontSize: 16,
    fontFamily: 'Roboto',
    color: colors.lightdark
  }
})
