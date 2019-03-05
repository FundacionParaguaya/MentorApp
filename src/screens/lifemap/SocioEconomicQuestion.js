import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import TextInput from '../../components/TextInput'
import Select from '../../components/Select'
import {
  addSurveyData,
  addSurveyFamilyMemberData,
  addDraftProgress
} from '../../redux/actions'

export class SocioEconomicQuestion extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title')
    }
  }

  errorsDetected = []
  readonly = !!this.props.navigation.getParam('family')
  state = { errorsDetected: [], showErrors: false }
  draftId = this.props.navigation.getParam('draftId')
  survey = this.props.navigation.getParam('survey')

  constructor(props) {
    super(props)

    // If this is the first socio economics screen set the whole process
    // in the navigation. On every next screen it will know which questions
    // to ask and if it is done.
    if (!props.navigation.getParam('socioEconomics')) {
      let currentDimension = ''
      let questionsPerScreen = []
      let totalScreens = 0

      // go trough all questions and separate them by screen
      props.navigation
        .getParam('survey')
        .surveyEconomicQuestions.forEach(question => {
          // if the dimention of the questions change, change the page
          if (question.topic !== currentDimension) {
            currentDimension = question.topic
            totalScreens += 1
          }

          // if there is object for n screen create one
          if (!questionsPerScreen[totalScreens - 1]) {
            questionsPerScreen[totalScreens - 1] = {
              forFamilyMember: [],
              forFamily: []
            }
          }

          if (question.forFamilyMember) {
            questionsPerScreen[totalScreens - 1].forFamilyMember.push(question)
          } else {
            questionsPerScreen[totalScreens - 1].forFamily.push(question)
          }
        })
      if (props.navigation.getParam('fromBeginLifemap')) {
        props.navigation.setParams({
          socioEconomics: {
            currentScreen: totalScreens,
            questionsPerScreen,
            totalScreens
          },
          title: questionsPerScreen[totalScreens - 1].forFamily[0]
            ? questionsPerScreen[totalScreens - 1].forFamily[0].topic
            : questionsPerScreen[totalScreens - 1].forFamilyMember[0].topic
        })
      } else
        props.navigation.setParams({
          socioEconomics: {
            currentScreen: this.props.navigation.getParam('page')
              ? this.props.navigation.getParam('page') + 1
              : 1,
            questionsPerScreen,
            totalScreens
          },
          title: questionsPerScreen[0].forFamily[0]
            ? questionsPerScreen[0].forFamily[0].topic
            : questionsPerScreen[0].forFamilyMember[0].topic
        })
    } else {
      const socioEconomics = this.props.navigation.getParam('socioEconomics')
      const questionsForThisScreen = socioEconomics
        ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
        : []

      this.props.navigation.setParams({
        title: questionsForThisScreen.forFamily[0]
          ? questionsForThisScreen.forFamily[0].topic
          : questionsForThisScreen.forFamilyMember[0].topic
      })
    }
  }

  componentDidMount() {
    if (!this.readonly) {
      this.props.addDraftProgress(this.draftId, {
        screen: 'SocioEconomicQuestion',
        socioEconomics: this.props.navigation.getParam('socioEconomics')
      })

      this.props.navigation.setParams({
        onPressBack: this.onPressBack
      })
    }
  }

  onPressBack = () => {
    const socioEconomics = this.props.navigation.getParam('socioEconomics')

    socioEconomics.currentScreen === 1
      ? this.props.navigation.navigate('Location', {
          draftId: this.draftId,
          survey: this.survey
        })
      : this.props.navigation.push('SocioEconomicQuestion', {
          draftId: this.draftId,
          survey: this.survey,
          socioEconomics: {
            currentScreen: socioEconomics.currentScreen - 1,
            questionsPerScreen: socioEconomics.questionsPerScreen,
            totalScreens: socioEconomics.totalScreens
          }
        })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  addSurveyData = (text, field) => {
    this.props.addSurveyData(this.draftId, 'economicSurveyDataList', {
      [field]: text
    })
  }
  addSurveyFamilyMemberData = (text, field, index) => {
    this.props.addSurveyFamilyMemberData({
      id: this.draftId,
      index,
      isSocioEconomicAnswer: true,
      payload: {
        [field]: text
      }
    })
  }
  getFieldValue = (draft, field) => {
    if (
      !draft ||
      !draft.economicSurveyDataList ||
      !draft.economicSurveyDataList.filter(item => item.key === field)[0]
    ) {
      return
    }

    return draft.economicSurveyDataList.filter(item => item.key === field)[0]
      .value
  }
  getFamilyMemberFieldValue = (draft, field, index) => {
    if (
      !draft ||
      !draft.familyData.familyMembersList[index].socioEconomicAnswers ||
      !draft.familyData.familyMembersList[index].socioEconomicAnswers.filter(
        item => item.key === field
      )[0]
    ) {
      return
    }

    return draft.familyData.familyMembersList[
      index
    ].socioEconomicAnswers.filter(item => item.key === field)[0].value
  }
  detectError = (error, field) => {
    if (error && !this.errorsDetected.includes(field)) {
      this.errorsDetected.push(field)
    } else if (!error) {
      this.errorsDetected = this.errorsDetected.filter(item => item !== field)
    }

    this.setState({
      errorsDetected: this.errorsDetected
    })
  }
  submitForm = () => {
    if (this.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      const socioEconomics = this.props.navigation.getParam('socioEconomics')

      socioEconomics.currentScreen === socioEconomics.totalScreens
        ? this.props.navigation.navigate('BeginLifemap', {
            draftId: this.draftId,
            survey: this.survey
          })
        : this.props.navigation.push('SocioEconomicQuestion', {
            draftId: this.draftId,
            survey: this.survey,
            socioEconomics: {
              currentScreen: socioEconomics.currentScreen + 1,
              questionsPerScreen: socioEconomics.questionsPerScreen,
              totalScreens: socioEconomics.totalScreens
            }
          })
    }
  }
  render() {
    const { t } = this.props
    const { showErrors } = this.state

    const draft =
      this.props.navigation.getParam('family') ||
      this.props.drafts.find(draft => draft.draftId === this.draftId)

    const socioEconomics = this.props.navigation.getParam('socioEconomics')
    const questionsForThisScreen = socioEconomics
      ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
      : []

    return (
      <StickyFooter
        handleClick={this.submitForm}
        continueLabel={t('general.continue')}
        readonly={this.readonly}
      >
        {/* questions for entire family */}
        {socioEconomics ? (
          questionsForThisScreen.forFamily.map(question =>
            question.answerType === 'select' ? (
              <Select
                key={question.codeName}
                required={question.required}
                onChange={this.addSurveyData}
                placeholder={question.questionText}
                showErrors={showErrors}
                label={question.questionText}
                field={question.codeName}
                value={this.getFieldValue(draft, question.codeName) || ''}
                detectError={this.detectError}
                readonly={this.readonly}
                options={question.options}
              />
            ) : question.answerType === 'number' ? (
              <TextInput
                multiline
                key={question.codeName}
                required={question.required}
                onChangeText={this.addSurveyData}
                placeholder={question.questionText}
                showErrors={showErrors}
                field={question.codeName}
                value={this.getFieldValue(draft, question.codeName) || ''}
                detectError={this.detectError}
                readonly={this.readonly}
                validation="number"
                keyboardType="numeric"
              />
            ) : (
              <TextInput
                multiline
                key={question.codeName}
                required={question.required}
                onChangeText={this.addSurveyData}
                placeholder={question.questionText}
                showErrors={showErrors}
                field={question.codeName}
                value={this.getFieldValue(draft, question.codeName) || ''}
                detectError={this.detectError}
                readonly={this.readonly}
              />
            )
          )
        ) : (
          <View />
        )}

        {/* questions for family members */}
        {socioEconomics ? (
          questionsForThisScreen.forFamilyMember.length ? (
            draft.familyData.familyMembersList.map((member, i) => (
              <View key={member.firstName}>
                <Text style={styles.memberName}>{member.firstName}</Text>
                {questionsForThisScreen.forFamilyMember.map(question =>
                  question.answerType === 'select' ? (
                    <Select
                      key={question.codeName}
                      required={question.required}
                      onChange={(text, field) =>
                        this.addSurveyFamilyMemberData(text, field, i)
                      }
                      placeholder={question.questionText}
                      showErrors={showErrors}
                      label={question.questionText}
                      field={question.codeName}
                      value={
                        this.getFamilyMemberFieldValue(
                          draft,
                          question.codeName,
                          i
                        ) || ''
                      }
                      detectError={this.detectError}
                      readonly={this.readonly}
                      options={question.options}
                    />
                  ) : (
                    <TextInput
                      key={question.codeName}
                      multiline
                      required={question.required}
                      onChangeText={(text, field) =>
                        this.addSurveyFamilyMemberData(text, field, i)
                      }
                      placeholder={question.questionText}
                      showErrors={showErrors}
                      field={question.codeName}
                      value={
                        this.getFamilyMemberFieldValue(
                          draft,
                          question.codeName,
                          i
                        ) || ''
                      }
                      detectError={this.detectError}
                      readonly={this.readonly}
                    />
                  )
                )}
              </View>
            ))
          ) : (
            <View />
          )
        ) : (
          <View />
        )}
      </StickyFooter>
    )
  }
}

SocioEconomicQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  addSurveyData: PropTypes.func.isRequired,
  addSurveyFamilyMemberData: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  memberName: {
    marginHorizontal: 20,
    fontWeight: 'normal',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 20
  }
})

const mapDispatchToProps = {
  addSurveyData,
  addSurveyFamilyMemberData,
  addDraftProgress
}

const mapStateToProps = ({ drafts, surveys }) => ({
  drafts,
  surveys
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SocioEconomicQuestion)
)
