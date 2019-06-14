import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableHighlight,
  Linking
} from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialIcons'
import globalStyles from '../globalStyles'
import FamilyListItem from '../components/FamilyListItem'
import colors from '../theme.json'
import FamilyTab from '../components/FamilyTab'
import OverviewComponent from './lifemap/Overview'
import RoundImage from '../components/RoundImage'
import Button from '../components/Button'
import StickyFooter from '../components/StickyFooter'
import { updateNav } from '../redux/actions'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import marker from '../../assets/images/marker.png'
import mapPlaceholderLarge from '../../assets/images/map_placeholder_1000.png'

export class Family extends Component {
  // set the title of the screen to the family name
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.getParam('familyName', 'Families')}  ${
        navigation.getParam('familyLifemap', 'Families').familyData
          .countFamilyMembers > 1
          ? `+ ${navigation.getParam('familyLifemap', 'Families').familyData
              .countFamilyMembers - 1}`
          : ''
      }`
    }
  }
  unsubscribeNetChange
  state = {
    activeTab: this.props.navigation.getParam('activeTab') || 'Details'
  }
  isRetakeSurvey = this.props.navigation.getParam('retakeSurvey')
  familyLifemap = this.props.navigation.getParam('familyLifemap')
  isDraft = this.props.navigation.getParam('isDraft')

  // extract socio economic categories from snapshot
  socioEconomicCategories = [
    ...new Set(
      this.props.navigation
        .getParam('survey')
        .surveyEconomicQuestions.map(question => question.topic)
    )
  ]
  componentDidMount() {
    const { survey } = this.props.nav
    const { navigation } = this.props

    // // monitor for connection changes
    this.unsubscribeNetChange = NetInfo.addEventListener(isOnline => {
      this.setState({ isOnline })
    })

    // check if online first
    NetInfo.fetch().then(state => {
      this.setState({ isOnline: state.isConnected })
    })

    this.props.navigation.setParams({
      withoutCloseButton: true
    })

    if (typeof survey !== 'undefined') {
      this.props.updateNav({
        survey: this.props.surveys.find(
          item => item.id === this.familyLifemap.surveyId
        ),
        draftId: navigation.getParam('draftId'),
        readonly: true
      })
    }
  }
  sendEmail = async email => {
    let url = `mailto:${email}`
    const canOpen = await Linking.canOpenURL(url)
    if (canOpen) {
      Linking.openURL(url)
    }
  }
  callPhone = async phone => {
    let url = `tel:${phone}`
    const canOpen = await Linking.canOpenURL(url)
    if (canOpen) {
      Linking.openURL(url)
    }
  }
  handleResumeClick = () => {
    const { navigation } = this.props
    this.props.updateNav({
      readonly: false
    })
    navigation.replace(this.familyLifemap.progress.screen, {
      draftId: this.familyLifemap.draftId,
      survey: this.survey,
      step: this.familyLifemap.progress.step,
      socioEconomics: this.familyLifemap.progress.socioEconomics
    })
  }

  survey = this.props.surveys.find(
    item => item.id === this.familyLifemap.surveyId
  )

  retakeSurveyWithThisFamily = () => {
    const { navigation } = this.props
    this.props.updateNav({
      readonly: false
      // familyRetakeOldIndicators: this.familyLifemap.indicatorSurveyDataList
    })
    navigation.push('FamilyParticipant', {
      isRetakeSurvey: this.isRetakeSurvey,
      survey: navigation.getParam('survey'),
      familyData: {
        ...this.familyLifemap.familyData,
        familyId: navigation.getParam('familyID'),
        familyMembersList: this.familyLifemap.familyData.familyMembersList.map(
          member => ({
            ...member,
            socioEconomicAnswers: []
          })
        )
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeNetChange()
  }

  render() {
    const { activeTab } = this.state
    const { t, navigation } = this.props
    const { familyData } = this.familyLifemap
    let email = false
    let phone = false
    if (
      typeof familyData.familyMembersList[0].email !== 'undefined' &&
      familyData.familyMembersList[0].email !== null
    ) {
      if (familyData.familyMembersList[0].email.length) {
        email = familyData.familyMembersList[0].email
      }
    }
    if (
      typeof familyData.familyMembersList[0].phoneNumber !== 'undefined' &&
      familyData.familyMembersList[0].phoneNumber !== null
    ) {
      if (familyData.familyMembersList[0].phoneNumber.length) {
        phone = familyData.familyMembersList[0].phoneNumber
      }
    }
    return (
      <StickyFooter
        handleClick={this.retakeSurveyWithThisFamily}
        continueLabel={'Choose this family'}
        progress={this.props.navigation.getParam('retakeSurvey') ? 3 / 50 : 0}
        visible={!!this.isRetakeSurvey}
      >
        <ScrollView
          style={globalStyles.background}
          contentContainerStyle={styles.container}
        >
          {!this.isRetakeSurvey && (
            <View style={styles.tabs}>
              <FamilyTab
                title={t('views.family.details')}
                onPress={() => this.setState({ activeTab: 'Details' })}
                active={activeTab === 'Details'}
              />
              <FamilyTab
                title={t('views.family.lifemap')}
                onPress={() => this.setState({ activeTab: 'LifeMap' })}
                active={activeTab === 'LifeMap'}
              />
            </View>
          )}

          {/* Details tab */}
          {activeTab === 'Details' ? (
            <ScrollView>
              <View>
                {!!familyData.latitude &&
                !!familyData.longitude &&
                !!this.state.isOnline ? (
                  // Load Map
                  <View style={{ marginTop: -50 }}>
                    <View pointerEvents="none" style={styles.fakeMarker}>
                      <Image source={marker} />
                    </View>
                    <MapboxGL.MapView
                      centerCoordinate={[
                        +familyData.longitude,
                        +familyData.latitude
                      ]}
                      zoomLevel={15}
                      style={{ width: '100%', height: 219 }}
                      logoEnabled={false}
                      zoomEnabled={false}
                      rotateEnabled={false}
                      scrollEnabled={false}
                      pitchEnabled={false}
                      minZoomLevel={10}
                      maxZoomLevel={15}
                      onPress={() => {
                        navigation.navigate('Location', {
                          readOnly: true,
                          survey: this.survey,
                          family: this.familyLifemap
                        })
                      }}
                    />
                  </View>
                ) : (
                  // Load Map Image
                  <TouchableHighlight
                    onPress={() => {
                      navigation.navigate('Location', {
                        readOnly: true,
                        survey: this.survey,
                        family: this.familyLifemap
                      })
                    }}
                  >
                    <Image
                      style={styles.imagePlaceholder}
                      source={mapPlaceholderLarge}
                    />
                  </TouchableHighlight>
                )}
                <View style={styles.faceIconWrapper}>
                  <View style={[styles.icon, { marginTop: -16 }]}>
                    {familyData.countFamilyMembers > 1 && (
                      <View style={styles.countCircleWrapper}>
                        <View style={styles.countCircle}>
                          <Text
                            style={[
                              globalStyles.h4,
                              { color: colors.lightdark }
                            ]}
                          >
                            + {familyData.countFamilyMembers - 1}
                          </Text>
                        </View>
                      </View>
                    )}

                    <Icon
                      name="face"
                      style={styles.faceIcon}
                      color={colors.grey}
                      size={60}
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={globalStyles.h2}>
                    {navigation.getParam('familyName')}
                  </Text>
                </View>
              </View>
              {phone || email ? (
                <View style={styles.familiesIcon}>
                  {email ? (
                    <View style={styles.familiesIconContainer}>
                      <Icon
                        onPress={() => this.sendEmail(email)}
                        name="email"
                        style={styles.familiesIconIcon}
                        size={35}
                      />
                    </View>
                  ) : null}
                  {phone ? (
                    <View style={styles.familiesIconContainer}>
                      <Icon
                        onPress={() => this.callPhone(phone)}
                        name="phone"
                        style={styles.familiesIconIcon}
                        size={35}
                      />
                    </View>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.section}>
                <View style={styles.content}>
                  <Text style={[globalStyles.h4, { color: colors.lightdark }]}>
                    {t('views.familyMembers').toUpperCase()}
                  </Text>
                  <FlatList
                    data={familyData.familyMembersList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <FamilyListItem
                        icon
                        isRetakeSurvey={this.isRetakeSurvey}
                        text={`${decodeURIComponent(escape(item.firstName))} ${
                          !index
                            ? decodeURIComponent(escape(item.lastName))
                            : ''
                        }`}
                        handleClick={() => {
                          if (!index) {
                            navigation.navigate('FamilyParticipant', {
                              survey: this.survey,
                              family: this.familyLifemap,
                              readOnly: true
                            })
                          } else {
                            navigation.navigate('FamilyMember', {
                              survey: this.survey,
                              readOnly: true,
                              member: item
                            })
                          }
                        }}
                      />
                    )}
                  />
                </View>
              </View>
              {!this.isRetakeSurvey && (
                <View style={styles.section}>
                  <View style={styles.content}>
                    <Text
                      style={[globalStyles.h4, { color: colors.lightdark }]}
                    >
                      {t('views.family.household').toUpperCase()}
                    </Text>
                    <FamilyListItem
                      text={t('views.location')}
                      handleClick={() => {
                        navigation.navigate('Location', {
                          survey: this.survey,
                          readOnly: true,
                          family: this.familyLifemap
                        })
                      }}
                    />
                    {!this.isDraft
                      ? this.socioEconomicCategories.map((item, index) => (
                          <FamilyListItem
                            key={item}
                            text={item}
                            handleClick={() => {
                              navigation.navigate('SocioEconomicQuestion', {
                                family: this.familyLifemap,
                                page: index,
                                readOnly: true,
                                survey: this.survey,
                                title: item
                              })
                            }}
                          />
                        ))
                      : null}
                  </View>
                </View>
              )}
            </ScrollView>
          ) : null}

          {/* Lifemap tab */}
          {activeTab === 'LifeMap' ? (
            <ScrollView id="lifemap">
              {this.isDraft ? (
                <View>
                  <View style={styles.draftContainer}>
                    <Text
                      style={{
                        ...styles.lifemapCreated,
                        ...globalStyles.h2Bold,
                        fontSize: 16,
                        marginBottom: 10,
                        textAlign: 'center',
                        color: '#000000'
                      }}
                    >{`${t('views.family.lifeMapCreatedOn')}: \n${moment(
                      this.familyLifemap.created
                    ).format('MMM DD, YYYY')}`}</Text>
                    <RoundImage source="lifemap" />

                    {navigation.getParam('familyLifemap').status === 'Draft' ? (
                      <Button
                        id="resume-draft"
                        style={{
                          marginTop: 20
                        }}
                        colored
                        text={t('general.resumeDraft')}
                        handleClick={() => this.handleResumeClick()}
                      />
                    ) : (
                      <Text
                        style={{
                          ...globalStyles.h2Bold,
                          ...{
                            textAlign: 'center'
                          }
                        }}
                      >
                        {t('views.family.lifeMapAfterSync')}
                      </Text>
                    )}
                  </View>
                </View>
              ) : (
                <ScrollView>
                  <Text
                    style={{ ...styles.lifemapCreated, ...globalStyles.h3 }}
                  >{`${t('views.family.created')}:  ${moment
                    .unix(this.familyLifemap.createdAt)
                    .utc()
                    .format('MMM DD, YYYY')}`}</Text>
                  <OverviewComponent
                    navigation={navigation}
                    familyLifemap={this.familyLifemap}
                  />
                </ScrollView>
              )}
            </ScrollView>
          ) : null}
        </ScrollView>
      </StickyFooter>
    )
  }
}

Family.propTypes = {
  surveys: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func,
  updateNav: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  familiesIconContainer: {
    backgroundColor: '#50AA47',
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  familiesIconIcon: {
    margin: 'auto',
    color: 'white'
  },
  familiesIcon: {
    flex: 1,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    height: 55,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1
  },
  faceIcon: {
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 15
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  countCircleWrapper: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  countCircle: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: 13 }, { translateY: -13 }]
  },
  content: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 30
  },
  draftContainer: {
    paddingHorizontal: 25,
    marginTop: 70
  },
  lifemapCreated: {
    marginHorizontal: 25,
    marginTop: 15,
    marginBottom: -10,
    zIndex: 10
  },
  fakeMarker: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 10, //raise the marker so it's point, not center, marks the location
    justifyContent: 'center',
    alignItems: 'center'
  },
  faceIconWrapper: {
    width: 92,
    height: 92,
    borderRadius: 100,
    marginBottom: 10,
    marginTop: -65,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  imagePlaceholder: { width: '100%', height: 169 }
})
const mapDispatchToProps = {
  updateNav
}
const mapStateToProps = ({ nav, surveys }) => ({ nav, surveys })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Family)
)
