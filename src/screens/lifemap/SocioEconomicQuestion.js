import { Platform, StyleSheet, Text, View } from 'react-native'
import React, { Component } from 'react'
import {
  getConditionalOptions,
  getConditionalQuestions,
  getDraftWithUpdatedEconomic,
  getDraftWithUpdatedFamilyEconomics,
  getDraftWithUpdatedQuestionsCascading,
  getElementsWithConditionsOnThem,
  shouldShowQuestion
} from '../utils/conditional_logic'
import { getTotalScreens, setScreen } from './helpers'

import Checkbox from '../../components/Checkbox'
import Decoration from '../../components/decoration/Decoration'
import Form from '../../components/form/Form'
import PropTypes from 'prop-types'
import Select from '../../components/form/Select'
import TextInput from '../../components/form/TextInput'
import colors from '../../theme.json'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import { withNamespaces } from 'react-i18next'

export class SocioEconomicQuestion extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={styles.headerTitleStyle}
        >
          {navigation.getParam('title')}
        </Text>
      )
    }
  }

  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')
  draftId = this.props.navigation.getParam('draftId')

  state = {
    checkboxError: false
  }

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  onPressBack = () => {
    const socioEconomics = this.props.navigation.getParam('socioEconomics')

    const STEP_BACK = -1

    if (
      (socioEconomics && socioEconomics.currentScreen === 1) ||
      !socioEconomics
    ) {
      this.props.navigation.navigate('Location', {
        survey: this.survey,
        draftId: this.draftId
      })
    } else {
      this.props.navigation.replace('SocioEconomicQuestion', {
        socioEconomics: {
          currentScreen: setScreen(socioEconomics, this.getDraft(), STEP_BACK),
          questionsPerScreen: socioEconomics.questionsPerScreen,
          totalScreens: socioEconomics.totalScreens
        },
        survey: this.survey,
        draftId: this.draftId
      })
    }
  }
  getFieldValue = (field, propertyKey) => {
    const draft = this.getDraft()
    if (
      !draft ||
      !draft.economicSurveyDataList ||
      !draft.economicSurveyDataList.filter(item => item.key === field)[0]
    ) {
      return
    }

    return draft.economicSurveyDataList.filter(item => item.key === field)[0][
      propertyKey
    ]
  }

  getFamilyMemberFieldValue = (field, index) => {
    const draft = this.getDraft()

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

  cleanErrorsCodenamesOnUnmount = (field, memberIndex) => {
    const fieldName = memberIndex ? `${field}-${memberIndex}` : field
    if (fieldName) {
      this.errorsDetected = this.errorsDetected.filter(
        item => item !== fieldName
      )
    }

    this.setState({
      errorsDetected: this.errorsDetected
    })
  }

  onContinue = () => {
    const socioEconomics = this.props.navigation.getParam('socioEconomics')
    const STEP_FORWARD = 1

    !socioEconomics ||
    socioEconomics.currentScreen === socioEconomics.totalScreens
      ? this.props.navigation.navigate('BeginLifemap', {
          survey: this.survey,
          draftId: this.draftId
        })
      : this.props.navigation.navigate('SocioEconomicQuestion', {
          survey: this.survey,
          draftId: this.draftId,
          socioEconomics: {
            currentScreen: setScreen(
              socioEconomics,
              this.getDraft(),
              STEP_FORWARD
            ),
            questionsPerScreen: socioEconomics.questionsPerScreen,
            totalScreens: socioEconomics.totalScreens
          }
        })
  }
  addDots = value => {
    return value
      .toString()
      .replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        this.props.language === 'en' ? '$1,' : '$1.'
      )
  }
  onPressCheckbox = (text, field) => {
    const draft = this.getDraft()

    const question = draft.economicSurveyDataList.find(
      item => item.key === field
    )

    if (!question) {
      this.props.updateDraft({
        ...draft,
        economicSurveyDataList: [
          ...draft.economicSurveyDataList,
          { key: field, value: null, multipleValue: [text] }
        ]
      })
    } else {
      this.props.updateDraft({
        ...draft,
        economicSurveyDataList: [
          ...draft.economicSurveyDataList.filter(item => item.key !== field),
          {
            key: field,
            value: null,
            multipleValue: question.multipleValue.find(item => item === text)
              ? question.multipleValue.filter(item => item !== text)
              : [...question.multipleValue, text]
          }
        ]
      })
    }

    const questionAfterSave = draft.economicSurveyDataList.find(
      item => item.key === field
    )

    if (questionAfterSave) {
      !questionAfterSave.multipleValue.length
        ? this.setState({ checkboxError: true })
        : this.setState({ checkboxError: false })
    }
  }

  updateEconomicAnswer = (question, value, memberIndex) => {
    const draft = this.getDraft()
    const {
      conditionalQuestions,
      elementsWithConditionsOnThem: { questionsWithConditionsOnThem }
    } = this.state

    // We get a draft with updated answer
    let currentDraft
    const newAnswer = {
      key: question.codeName,
      value:
        question.answerType === 'number' ? value.replace(/[,.]/g, '') : value
    }
    if (question.forFamilyMember) {
      currentDraft = getDraftWithUpdatedFamilyEconomics(
        draft,
        newAnswer,
        memberIndex
      )
    } else {
      currentDraft = getDraftWithUpdatedEconomic(draft, newAnswer)
    }

    if (questionsWithConditionsOnThem.includes(question.codeName)) {
      currentDraft = getDraftWithUpdatedQuestionsCascading(
        currentDraft,
        conditionalQuestions.filter(
          conditionalQuestion =>
            conditionalQuestion.codeName !== question.codeName
        ),
        false
      )
    }
    this.props.updateDraft(currentDraft)
  }

  setSocioEconomicsParam() {
    const { navigation } = this.props

    // If this is the first socio economics screen set the whole process
    // in the navigation. On every next screen it will know which questions
    // to ask and if it is done.
    if (!navigation.getParam('socioEconomics')) {
      let currentDimension = ''
      let questionsPerScreen = []
      let totalScreens = 0

      // go trough all questions and separate them by screen
      // filter method - checks if family members meet the conditions based on age
      this.survey.surveyEconomicQuestions.forEach(question => {
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

      if (navigation.getParam('fromBeginLifemap')) {
        navigation.setParams({
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
        navigation.setParams({
          socioEconomics: {
            currentScreen: navigation.getParam('page')
              ? navigation.getParam('page') + 1
              : 1,
            questionsPerScreen,
            totalScreens
          },
          title: questionsPerScreen[0].forFamily[0]
            ? questionsPerScreen[0].forFamily[0].topic
            : questionsPerScreen[0].forFamilyMember[0].topic
        })
    } else {
      const socioEconomics = navigation.getParam('socioEconomics')
      const questionsForThisScreen = socioEconomics
        ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
        : []

      navigation.setParams({
        title: questionsForThisScreen.forFamily[0]
          ? questionsForThisScreen.forFamily[0].topic
          : questionsForThisScreen.forFamilyMember[0].topic
      })
    }
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  componentDidMount() {
    this.setSocioEconomicsParam()
    const draft = this.getDraft()

    if (!this.readOnly) {
      const conditionalQuestions = getConditionalQuestions(this.survey)
      const elementsWithConditionsOnThem = getElementsWithConditionsOnThem(
        conditionalQuestions
      )
      this.setState({
        conditionalQuestions,
        elementsWithConditionsOnThem
      })

      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'SocioEconomicQuestion',
          total: getTotalScreens(this.survey)
        }
      })

      this.props.navigation.setParams({
        onPressBack: this.onPressBack
      })
    }
  }

  render() {
    const { t } = this.props
    const { showErrors } = this.state
    const socioEconomics = this.props.navigation.getParam('socioEconomics')

    const questionsForThisScreen = socioEconomics
      ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
      : {}

    const draft = this.getDraft()

    const showMemberName = (member, memberIndex, questionsForFamilyMember) => {
      const memberHasQuestions = questionsForFamilyMember.filter(question =>
        shouldShowQuestion(question, draft, memberIndex)
      ).length
      return memberHasQuestions ? (
        <Text id={member.firstName} style={styles.memberName}>
          {member.firstName}
        </Text>
      ) : null
    }

    return (
      <Form
        onContinue={this.onContinue}
        continueLabel={t('general.continue')}
        readOnly={!!this.readOnly}
        progress={
          !this.readOnly && draft
            ? ((draft.familyData.countFamilyMembers > 1 ? 3 : 2) +
                (socioEconomics ? socioEconomics.currentScreen : 1)) /
              draft.progress.total
            : 0
        }
      >
        <Decoration variation="socioEconomicQuestion" />
        {/* questions for entire family */}
        {socioEconomics ? (
          questionsForThisScreen.forFamily
            .filter(question =>
              question.conditions && question.conditions.length
                ? shouldShowQuestion(question, draft)
                  ? question
                  : false
                : question
            )
            .map((question, index) => {
              if (
                question.answerType === 'select' ||
                question.answerType === 'radio'
              ) {
                const radioQuestionSelected =
                  draft.economicSurveyDataList.some(
                    answer => answer.key === question.codeName
                  ) || false

                return (
                  <View key={index}>
                    {this.readOnly && !radioQuestionSelected ? null : (
                      <View>
                        {question.answerType === 'radio' ? (
                          <Text style={{ marginLeft: 10, marginBottom: 15 }}>
                            {!question.required
                              ? question.questionText
                              : `${question.questionText}*`}
                          </Text>
                        ) : null}
                      </View>
                    )}

                    <Select
                      id={question.codeName}
                      radio={question.answerType === 'radio' ? true : false}
                      required={question.required}
                      onChange={value =>
                        this.updateEconomicAnswer(question, value, false)
                      }
                      placeholder={question.questionText}
                      label={question.questionText}
                      initialValue={
                        this.getFieldValue(question.codeName, 'value') || ''
                      }
                      // cleanErrorsOnUnmount={this.cleanErrorsCodenamesOnUnmount}
                      options={getConditionalOptions(question, draft)}
                    />
                  </View>
                )
              } else if (question.answerType === 'number') {
                return (
                  <TextInput
                    id={question.codeName}
                    multiline
                    key={question.codeName}
                    required={question.required}
                    onChangeText={value =>
                      this.updateEconomicAnswer(question, value, false)
                    }
                    placeholder={question.questionText}
                    lng={this.props.language || 'en'}
                    initialValue={this.addDots(
                      this.getFieldValue(question.codeName, 'value') || ''
                    )}
                    validation="number"
                    keyboardType="numeric"
                  />
                )
              } else if (question.answerType === 'checkbox') {
                let multipleValue = []
                //passing multipleValues from the checkbox question
                draft.economicSurveyDataList.forEach(elem => {
                  if (elem.key === question.codeName) {
                    if (typeof elem.multipleValue !== 'undefined') {
                      if (elem.multipleValue.length) {
                        multipleValue = elem.multipleValue
                      }
                    }
                  }
                })

                return (
                  <View key={question.codeName}>
                    {this.readOnly && !multipleValue.length ? null : (
                      <Text style={{ marginLeft: 10 }}>
                        {!question.required
                          ? question.questionText
                          : `${question.questionText}*`}
                      </Text>
                    )}

                    {question.options.map(e => {
                      return (
                        <View key={e.value}>
                          <Checkbox
                            multipleValue={multipleValue}
                            containerStyle={styles.checkbox}
                            checkboxColor={colors.green}
                            showErrors={showErrors}
                            onIconPress={() =>
                              this.onPressCheckbox(e.value, question.codeName)
                            }
                            readonly={this.readOnly}
                            title={e.text}
                            value={e.value}
                            codeName={question.codeName}
                          />
                        </View>
                      )
                    })}
                    {question.required && this.state.checkboxError ? (
                      <Text style={styles.error}>
                        {t('validation.fieldIsRequired')}{' '}
                      </Text>
                    ) : null}
                  </View>
                )
              } else {
                return (
                  <TextInput
                    id={question.codeName}
                    multiline
                    key={question.codeName}
                    required={question.required}
                    onChangeText={value =>
                      this.updateEconomicAnswer(question, value, false)
                    }
                    placeholder={question.questionText}
                    initialValue={
                      this.getFieldValue(question.codeName, 'value') || ''
                    }
                  />
                )
              }
            })
        ) : (
          <View />
        )}

        {/* questions for family members */}
        {socioEconomics ? (
          questionsForThisScreen.forFamilyMember.length ? (
            draft.familyData.familyMembersList.map((member, i) => (
              <View key={member.firstName}>
                {showMemberName(
                  member,
                  i,
                  questionsForThisScreen.forFamilyMember
                )}
                {questionsForThisScreen.forFamilyMember
                  .filter(question =>
                    question.conditions && question.conditions.length
                      ? shouldShowQuestion(question, draft, i)
                        ? question
                        : false
                      : question
                  )
                  .map((question, index) => {
                    if (
                      question.answerType === 'select' ||
                      question.answerType === 'radio'
                    ) {
                      const radioQuestionSelected =
                        draft.economicSurveyDataList.some(
                          answer => answer.key === question.codeName
                        ) || false
                      return (
                        <View key={index}>
                          {this.readOnly && !radioQuestionSelected ? null : (
                            <View>
                              {question.answerType === 'radio' ? (
                                <Text
                                  style={{ marginLeft: 10, marginBottom: 15 }}
                                >
                                  {question.questionText}
                                </Text>
                              ) : null}
                            </View>
                          )}
                          <Select
                            id={question.codeName}
                            radio={
                              question.answerType === 'radio' ? true : false
                            }
                            key={question.codeName}
                            required={question.required}
                            onChange={value =>
                              this.updateEconomicAnswer(question, value, i)
                            }
                            placeholder={question.questionText}
                            label={question.questionText}
                            initialValue={
                              this.getFamilyMemberFieldValue(
                                question.codeName,
                                i
                              ) || ''
                            }
                            options={getConditionalOptions(question, draft, i)}
                            memberIndex={i + 1}
                            // cleanErrorsOnUnmount={
                            //   this.cleanErrorsCodenamesOnUnmount
                            // }
                          />
                        </View>
                      )
                    } else if (question.answerType === 'number') {
                      return (
                        <TextInput
                          id={question.codeName}
                          multiline
                          key={question.codeName}
                          required={question.required}
                          onChangeText={value =>
                            this.updateEconomicAnswer(question, value, i)
                          }
                          placeholder={question.questionText}
                          lng={this.props.language || 'en'}
                          initialValue={this.addDots(
                            this.getFamilyMemberFieldValue(
                              question.codeName,
                              i
                            ) || ''
                          )}
                          validation="number"
                          keyboardType="numeric"
                        />
                      )
                    } else {
                      return (
                        <TextInput
                          id={question.codeName}
                          key={question.codeName}
                          multiline
                          required={question.required}
                          onChangeText={value =>
                            this.updateEconomicAnswer(question, value, i)
                          }
                          placeholder={question.questionText}
                          initialValue={
                            this.getFamilyMemberFieldValue(
                              question.codeName,
                              i
                            ) || ''
                          }
                        />
                      )
                    }
                  })}
              </View>
            ))
          ) : (
            <View />
          )
        ) : (
          <View />
        )}
      </Form>
    )
  }
}

const styles = StyleSheet.create({
  error: {
    paddingLeft: 15,
    paddingRight: 25,
    // lineHeight: 50,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 50,
    color: colors.red
  },
  memberName: {
    marginHorizontal: 20,
    fontWeight: 'normal',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 20
  },
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    color: colors.black,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

SocioEconomicQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  addSurveyDataCheckBox: PropTypes.func,
  drafts: PropTypes.array,
  language: PropTypes.string
}

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = ({ drafts, language }) => ({
  drafts,
  language
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SocioEconomicQuestion)
)
