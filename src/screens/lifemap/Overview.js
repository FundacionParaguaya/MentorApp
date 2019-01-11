import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import Tip from '../../components/Tip'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'
import LifemapOverview from '../../components/LifemapOverview'

import globalStyles from '../../globalStyles'
import colors from '../../theme.json'

export class Overview extends Component {
  draftId = this.props.navigation.getParam('draftId')
  survey = this.props.navigation.getParam('survey')
  resumeDraft = this.props.navigation.getParam('resumeDraft')
  indicatorsArray = this.survey.surveyStoplightQuestions.map(
    item => item.codeName
  )

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
    const draft = this.props.drafts.filter(
      item => item.draftId === this.draftId
    )[0]
    const mandatoryPrioritiesCount = this.getMandatoryPrioritiesCount(draft)
    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <View
            style={{
              ...globalStyles.container,
              paddingTop: 20
            }}
          >
            <LifemapVisual
              questions={draft.indicatorSurveyDataList}
              priorities={draft.priorities}
              achievements={draft.achievements}
              questionsLength={this.survey.surveyStoplightQuestions.length}
            />
            {this.resumeDraft ? (
              <Button
                style={{
                  marginTop: 20
                }}
                colored
                text={t('general.resumeDraft')}
                handleClick={() => {}}
              />
            ) : null}
          </View>
          <View>
            <Text style={{ ...globalStyles.subline, ...styles.listTitle }}>
              {t('views.lifemap.allIndicators')}
            </Text>
            <LifemapOverview
              surveyData={this.survey.surveyStoplightQuestions}
              draftData={draft}
              navigateToScreen={this.navigateToScreen}
            />
          </View>
        </View>
        {!this.resumeDraft ? (
          <View style={{ height: 50 }}>
            <Button
              colored
              text={t('general.continue')}
              handleClick={() => {
                this.navigateToScreen('Final')
              }}
              disabled={mandatoryPrioritiesCount > draft.priorities.length}
            />
          </View>
        ) : null}

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
    )
  }
}
const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  listTitle: {
    backgroundColor: colors.beige,
    height: 45,
    lineHeight: 45,
    flex: 1,
    textAlign: 'center'
  }
})

Overview.propTypes = {
  t: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

export default withNamespaces()(connect(mapStateToProps)(Overview))
