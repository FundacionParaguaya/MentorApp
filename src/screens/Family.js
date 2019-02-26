import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import moment from 'moment'

import colors from '../theme.json'
import globalStyles from '../globalStyles'
import FamilyTab from '../components/FamilyTab'
import Overview from './lifemap/Overview'
import RoundImage from '../components/RoundImage'
import Button from '../components/Button'

export class Family extends Component {
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

  state = { activeTab: 'Details' }
  familyLifemap = this.props.navigation.getParam('familyLifemap')
  isDraft = this.props.navigation.getParam('isDraft')

  componentDidMount() {
    this.props.navigation.setParams({
      withoutCloseButton: true
    })
  }
  survey = this.props.surveys.find(
    item => item.id === this.familyLifemap.surveyId
  )
  render() {
    console.log(this.isDraft)
    const { activeTab } = this.state
    const { t } = this.props
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
        {activeTab === 'Details' ? (
          <Text id="details">Details here</Text>
        ) : null}
        {activeTab === 'LifeMap' ? (
          <ScrollView id="lifemap">
            {this.isDraft ? (
              <View>
                <Text
                  style={{
                    ...styles.lifemapCreated,
                    ...globalStyles.h2Bold,
                    fontSize: 16,
                    color: '#000000'
                  }}
                >{`${t('views.family.lifeMapCreatedOn')}: \n${moment(
                  this.familyLifemap.created
                ).format('MMM, DD YYYY')}`}</Text>
                <View style={styles.draftContainer}>
                  <RoundImage source="lifemap" />
                  <Button
                    id="resume-draft"
                    style={{
                      marginTop: 20
                    }}
                    colored
                    text={t('general.resumeDraft')}
                    handleClick={() => {
                      this.props.navigation.replace(
                        this.familyLifemap.progress.screen,
                        {
                          draftId: this.familyLifemap.draftId,
                          survey: this.survey,
                          step: this.familyLifemap.progress.step,
                          socioEconomics: this.familyLifemap.progress
                            .socioEconomics
                        }
                      )
                    }}
                  />
                </View>
              </View>
            ) : (
              <ScrollView>
                <Text
                  style={{ ...styles.lifemapCreated, ...globalStyles.h3 }}
                >{`${t('views.family.created')}:  ${moment
                  .unix(this.familyLifemap.createdAt)
                  .utc()
                  .format('MMM, DD YYYY')}`}</Text>
                <Overview
                  navigation={this.props.navigation}
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
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func
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

const mapStateToProps = ({ surveys }) => ({ surveys })

export default withNamespaces()(connect(mapStateToProps)(Family))
