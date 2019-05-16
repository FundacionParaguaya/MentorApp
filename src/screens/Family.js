import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native'
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
import { updateNav } from '../redux/actions'
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

  state = {
    activeTab: this.props.navigation.getParam('activeTab') || 'Details'
  }
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
  render() {
    const { activeTab } = this.state
    const { t, navigation } = this.props
    const { familyData } = this.familyLifemap

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.container}
      >
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

        {/* Details tab */}
        {activeTab === 'Details' ? (
          <ScrollView>
            <View style={styles.icon}>
              {familyData.countFamilyMembers > 1 && (
                <View style={styles.countCircleWrapper}>
                  <View style={styles.countCircle}>
                    <Text
                      style={[globalStyles.h4, { color: colors.lightdark }]}
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
                size={55}
              />
            </View>
            <View style={styles.section}>
              <Text style={globalStyles.h2}>
                {navigation.getParam('familyName')}
              </Text>
            </View>

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
                      text={`${item.firstName} ${!index ? item.lastName : ''}`}
                      handleClick={() => {
                        if (!index) {
                          navigation.navigate('FamilyParticipant', {
                            family: this.familyLifemap
                          })
                        } else {
                          navigation.navigate('FamilyMember', {
                            member: item
                          })
                        }
                      }}
                    />
                  )}
                />
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.content}>
                <Text style={[globalStyles.h4, { color: colors.lightdark }]}>
                  {t('views.family.household').toUpperCase()}
                </Text>
                <FamilyListItem
                  text={t('views.location')}
                  handleClick={() => {
                    navigation.navigate('Location', {
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
                            page: index
                          })
                        }}
                      />
                    ))
                  : null}
              </View>
            </View>
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
  }
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
