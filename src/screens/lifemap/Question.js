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

    const indicators = [
      ...draft.indicatorSurveyDataList,
      { key: this.indicator.codeName, value: answer }
    ]

    const updatedIndicators = [...new Set(indicators.map(item => item))]

    //When the user changes the answer of a question
    if (fieldValue !== answer) {
      //If the indicator is green or skipped

      if (answer === 3 || answer === 0) {
        //delete priority
        this.setState({
          draft: {
            ...draft,
            indicatorSurveyDataList: updatedIndicators,
            priorities: [
              ...draft.priorities.filter(
                item => item.indicator !== this.indicator.codeName
              )
            ]
          }
        })
      }
      //If indicator is yellow, red or skipped
      if (answer < 3) {
        //Delete achievements
        this.setState({
          draft: {
            ...draft,
            indicatorSurveyDataList: updatedIndicators,
            achievements: [
              ...draft.achievements.filter(
                item => item.indicator !== this.indicator.codeName
              )
            ]
          }
        })
      }
    }

    if (
      this.step + 1 < this.indicators.length &&
      !this.props.navigation.getParam('skipped')
    ) {
      return this.props.navigation.replace('Question', {
        step: this.step + 1,
        draft: this.state.draft,
        survey: this.survey
      })
    } else if (this.step + 1 >= this.indicators.length && answer === 0) {
      return this.props.navigation.navigate('Skipped', {
        draft: this.state.draft,
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
        draft: this.state.draft,
        survey: this.survey
      })
    } else {
      return this.props.navigation.replace('Skipped', {
        draft: this.state.draft,
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

    const { t, dimensions, navigation } = this.props
    const { navigationHeight } = navigation.state.params
    const headerHeight = navigationHeight ? navigationHeight : 95
    const paddingOfStickyFooter = 15
    const portrait = !!dimensions && isPortrait(dimensions)
    const tablet = !!dimensions && isTablet(dimensions)
    const bodyHeight = dimensions.height - headerHeight - paddingOfStickyFooter

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
        <View
          style={[
            { height: bodyHeight },
            tablet && portrait ? { marginTop: 30 } : {}
          ]}
        >
          <SliderComponent
            slides={this.slides}
            value={this.getFieldValue(this.indicator.codeName)}
            selectAnswer={this.selectAnswer}
            bodyHeight={bodyHeight}
            tablet={tablet}
            portrait={portrait}
          />
          <View
            style={[
              styles.skip,
              !tablet && !portrait
                ? { height: 40 }
                : tablet && portrait
                ? { height: 120 }
                : { height: 60 }
            ]}
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
        </View>
      </StickyFooter>
    )
  }
}

const styles = StyleSheet.create({
  skip: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 30
    // marginTop: 0
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
