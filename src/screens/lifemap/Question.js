import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import IconButton from '../../components/IconButton'
import StickyFooter from '../../components/StickyFooter'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { isPortrait, isTablet } from '../../responsivenessHelpers'
import { getTotalEconomicScreens } from './helpers'
import colors from '../../theme.json'
import SliderComponent from '../../components/Slider'

export class Question extends Component {
  step = this.props.navigation.getParam('step')
  survey = this.props.navigation.getParam('survey')
  indicators = this.props.navigation.getParam('survey').surveyStoplightQuestions
  indicator = this.indicators[this.step]
  slides = this.indicator.stoplightColors
  readOnly = this.props.navigation.getParam('readOnly')
  state = {
    draft: this.props.navigation.getParam('draft')
  }

  componentDidMount() {
    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft,
      onPressBack: this.onPressBack
    })

    const { draft } = this.state

    this.setState({
      draft: {
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'Question',
          step: this.step
        }
      }
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  getFieldValue = field => {
    const indicatorObject = this.state.draft.indicatorSurveyDataList.find(
      item => item.key === field
    )
    if (indicatorObject) {
      return indicatorObject.value
    }
  }

  selectAnswer = answer => {
    const { draft } = this.state
    const skippedQuestions = draft.indicatorSurveyDataList.filter(
      question => question.value === 0
    )
    const fieldValue = this.getFieldValue(this.indicator.codeName)

    let updatedIndicators

    if (
      draft.indicatorSurveyDataList.find(
        item => item.key === this.indicator.codeName
      )
    ) {
      updatedIndicators = draft.indicatorSurveyDataList.map(item => {
        if (item.key === this.indicator.codeName) {
          return { ...item, value: answer }
        } else {
          return item
        }
      })
    } else {
      updatedIndicators = [
        ...draft.indicatorSurveyDataList,
        { key: this.indicator.codeName, value: answer }
      ]
    }

    let updatedDraft = {
      ...draft,
      indicatorSurveyDataList: updatedIndicators
    }

    //When the user changes the answer of a question
    if (fieldValue !== answer) {
      //If the indicator is green or skipped

      if (answer === 3 || answer === 0) {
        //delete priority
        updatedDraft = {
          ...draft,
          indicatorSurveyDataList: updatedIndicators,
          priorities: [
            ...draft.priorities.filter(
              item => item.indicator !== this.indicator.codeName
            )
          ]
        }
      }
      //If indicator is yellow, red or skipped
      if (answer < 3) {
        //Delete achievements
        updatedDraft = {
          ...draft,
          indicatorSurveyDataList: updatedIndicators,
          achievements: [
            ...draft.achievements.filter(
              item => item.indicator !== this.indicator.codeName
            )
          ]
        }
      }
    }

    this.setState({
      draft: updatedDraft
    })

    if (
      this.step + 1 < this.indicators.length &&
      !this.props.navigation.getParam('skipped')
    ) {
      return this.props.navigation.replace('Question', {
        step: this.step + 1,
        draft: updatedDraft,
        survey: this.survey
      })
    } else if (this.step + 1 >= this.indicators.length && answer === 0) {
      return this.props.navigation.navigate('Skipped', {
        draft: updatedDraft,
        survey: this.survey
      })
    } else if (
      (this.props.navigation.getParam('skipped') &&
        skippedQuestions.length === 1 &&
        answer !== 0) ||
      skippedQuestions.length === 0
    ) {
      return this.props.navigation.navigate('Overview', {
        resumeDraft: false,
        draft: updatedDraft,
        survey: this.survey
      })
    } else {
      return this.props.navigation.replace('Skipped', {
        draft: updatedDraft,
        survey: this.survey
      })
    }
  }

  onPressBack = () => {
    if (this.step > 0) {
      this.props.navigation.replace('Question', {
        step: this.step - 1,
        draft: this.state.draft,
        survey: this.survey
      })
    } else
      this.props.navigation.navigate('BeginLifemap', {
        draft: this.state.draft,
        survey: this.survey
      })
  }

  render() {
    const { draft } = this.state

    const { t } = this.props
    return (
      <StickyFooter
        handleClick={this.handleClick}
        readonly
        progress={
          draft
            ? ((draft.familyData.countFamilyMembers > 1 ? 5 : 4) +
                getTotalEconomicScreens(this.survey) +
                this.step) /
              draft.progress.total
            : 0
        }
        currentScreen="Question"
      >
          <SliderComponent
            slides={this.slides}
            value={this.getFieldValue(this.indicator.codeName)}
            selectAnswer={this.selectAnswer}
          />
          <View
            style={styles.skip}
          >
            {this.indicator.required ? (
              <Text>{t('views.lifemap.responseRequired')}</Text>
            ) : (
              <IconButton
                text={t('views.lifemap.skipThisQuestion')}
                textStyle={styles.link}
                onPress={() => this.selectAnswer(0)}
              />
            )}
          </View>
      </StickyFooter>
    )
  }
}

const styles = StyleSheet.create({
  skip: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 30
  },
  link: {
    color: colors.palegreen
  }
})

Question.propTypes = {
  t: PropTypes.func.isRequired,
  dimensions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
}

const mapStateToProps = ({ dimensions }) => ({
  dimensions
})

const mapDispatchToProps = {}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Question)
)
