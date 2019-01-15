import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  Text,
  ProgressBarAndroid,
  View,
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { addSurveyData, addDraftProgress } from '../../redux/actions'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import SliderComponent from '../../components/Slider'

export class Question extends Component {
  step = this.props.navigation.getParam('step')
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')

  indicators = this.survey.surveyStoplightQuestions
  indicator = this.indicators[this.step]
  slides = this.indicator.stoplightColors

  componentDidMount() {
    this.props.addDraftProgress(this.draftId, {
      screen: 'Question',
      step: this.step
    })
    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  getFieldValue(draft, field) {
    const indicatorObject = draft.indicatorSurveyDataList.find(
      item => item.key === field
    )
    if (indicatorObject) {
      return indicatorObject.value
    }
  }

  selectAnswer(answer) {
    this.props.addSurveyData(this.draftId, 'indicatorSurveyDataList', {
      [this.indicator.codeName]: answer
    })

    const draft = this.props.drafts.find(item => item.draftId === this.draftId)

    const skippedQuestions = draft.indicatorSurveyDataList.filter(
      question => question.value === 0
    )

    if (
      this.step + 1 < this.indicators.length &&
      !this.props.navigation.getParam('skipped')
    ) {
      return this.props.navigation.replace('Question', {
        draftId: this.draftId,
        survey: this.survey,
        step: this.step + 1
      })
    } else if (this.step + 1 >= this.indicators.length && answer === 0) {
      return this.props.navigation.navigate('Skipped', {
        draftId: this.draftId,
        survey: this.survey
      })
    } else if (
      (this.props.navigation.getParam('skipped') &&
        skippedQuestions.length === 1 &&
        answer !== 0) ||
      skippedQuestions.length === 0
    ) {
      return this.props.navigation.navigate('Overview', {
        draftId: this.draftId,
        survey: this.survey,
        resumeDraft: false
      })
    } else {
      return this.props.navigation.navigate('Skipped', {
        draftId: this.draftId,
        survey: this.survey
      })
    }
  }

  onPressBack = () => {
    if (this.step > 0) {
      this.props.navigation.replace('Question', {
        draftId: this.draftId,
        survey: this.survey,
        step: this.step - 1
      })
    } else
      this.props.navigation.navigate('BeginLifemap', {
        draftId: this.draftId,
        survey: this.survey
      })
  }

  render() {
    const draft = this.props.drafts.find(item => item.draftId === this.draftId)
    const { t } = this.props
    return (
      <ScrollView style={globalStyles.background}>
        <View style={{ ...globalStyles.container, paddingTop: 15 }}>
          <Text style={{ ...globalStyles.h5 }}>
            {this.indicator.dimension.toUpperCase()}
          </Text>
          <Text style={{ ...globalStyles.h3, marginTop: 5 }}>{`${
            this.indicator.questionText
          }`}</Text>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            color={colors.green}
            indeterminate={false}
            progress={(this.step + 1) / this.indicators.length}
            style={{ marginTop: 5, marginBottom: -15 }}
          />
        </View>
        <SliderComponent
          slides={this.slides}
          value={this.getFieldValue(draft, this.indicator.codeName)}
          selectAnswer={answer => this.selectAnswer(answer)}
        />
        <View style={styles.skip}>
          {this.indicator.required ? (
            <Text>{t('views.lifemap.responseRequired')}</Text>
          ) : (
            <TouchableOpacity onPress={() => this.selectAnswer(0)}>
              <Text style={styles.link}>
                {t('views.lifemap.skipThisQuestion')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  skip: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30
  },
  link: {
    color: colors.green
  }
})

Question.propTypes = {
  t: PropTypes.func.isRequired,
  addSurveyData: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

const mapDispatchToProps = {
  addSurveyData,
  addDraftProgress
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Question)
)
