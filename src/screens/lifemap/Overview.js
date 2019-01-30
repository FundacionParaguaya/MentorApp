import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { addDraftProgress } from '../../redux/actions'

import Tip from '../../components/Tip'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'
import LifemapOverview from '../../components/LifemapOverview'

import globalStyles from '../../globalStyles'
import colors from '../../theme.json'

export class Overview extends Component {
  draftId = this.props.navigation.getParam('draftId')
  familyLifemap = this.props.navigation.getParam('familyLifemap')
  survey = this.props.navigation.getParam('survey')
  indicatorsArray = this.survey.surveyStoplightQuestions.map(
    item => item.codeName
  )

  componentDidMount() {
    if (!this.props.navigation.getParam('resumeDraft')) {
      this.props.addDraftProgress(this.draftId, {
        screen: 'Overview'
      })
      this.props.navigation.setParams({
        onPressBack: this.onPressBack
      })
    }
  }

  onPressBack = () => {
    const draft = this.props.drafts.find(item => item.draftId === this.draftId)
    const skippedQuestions = draft.indicatorSurveyDataList.filter(
      question => question.value === 0
    )
    if (skippedQuestions.length > 0) {
      this.props.navigation.navigate('Skipped', {
        draftId: this.draftId,
        survey: this.survey
      })
    } else
      this.props.navigation.navigate('Question', {
        draftId: this.draftId,
        survey: this.survey,
        step: this.survey.surveyStoplightQuestions.length - 1
      })
  }

  navigateToScreen = (screen, indicator, indicatorText) =>
    this.props.navigation.navigate(screen, {
      draftId: this.draftId,
      survey: this.survey,
      indicator,
      indicatorText
    })

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  getMandatoryPrioritiesCount(draft) {
    const potentialPrioritiesCount = draft.indicatorSurveyDataList.filter(
      question => question.value === 1 || question.value === 2
    ).length

    return potentialPrioritiesCount > this.survey.minimumPriorities
      ? this.survey.minimumPriorities
      : potentialPrioritiesCount
  }

  render() {
    const { t } = this.props
    const data = this.familyLifemap
      ? this.familyLifemap
      : this.props.drafts.find(item => item.draftId === this.draftId)

    const mandatoryPrioritiesCount = this.getMandatoryPrioritiesCount(data)
    const resumeDraft = this.props.navigation.getParam('resumeDraft')
    return (
      <View style={[globalStyles.background, styles.contentContainer]}>
        <ScrollView>
          <View style={styles.indicatorsContainer}>
            <LifemapVisual
              questions={data.indicatorSurveyDataList}
              priorities={data.priorities}
              achievements={data.achievements}
              questionsLength={this.survey.surveyStoplightQuestions.length}
            />
            {resumeDraft ? (
              <Button
                style={{
                  marginTop: 20
                }}
                colored
                text={t('general.resumeDraft')}
                handleClick={() => {
                  this.props.navigation.replace(data.progress.screen, {
                    draftId: this.draftId,
                    survey: this.survey,
                    step: data.progress.step,
                    socioEconomics: data.progress.socioEconomics
                  })
                }}
              />
            ) : null}
          </View>
          <View>
            <Text style={{ ...globalStyles.subline, ...styles.listTitle }}>
              {t('views.lifemap.allIndicators')}
            </Text>
            <LifemapOverview
              surveyData={this.survey.surveyStoplightQuestions}
              draftData={data}
              navigateToScreen={this.navigateToScreen}
            />
          </View>

          {mandatoryPrioritiesCount ? (
            <Tip
              title={t('views.lifemap.beforeTheLifeMapIsCompleted')}
              description={
                mandatoryPrioritiesCount === 1
                  ? t('views.lifemap.youNeedToAddPriotity')
                  : t('views.lifemap.youNeedToAddPriorities').replace(
                      '%n',
                      mandatoryPrioritiesCount
                    )
              }
            />
          ) : (
            <View />
          )}
        </ScrollView>
        {!resumeDraft ? (
          <View style={{ height: 50 }}>
            <Button
              colored
              text={t('general.continue')}
              handleClick={() => {
                this.navigateToScreen('Final')
              }}
              disabled={mandatoryPrioritiesCount > data.priorities.length}
            />
          </View>
        ) : null}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  listTitle: {
    backgroundColor: colors.beige,
    height: 45,
    lineHeight: 45,
    flex: 1,
    textAlign: 'center'
  },
  indicatorsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 25
  }
})

const mapDispatchToProps = {
  addDraftProgress
}

Overview.propTypes = {
  t: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Overview)
)
