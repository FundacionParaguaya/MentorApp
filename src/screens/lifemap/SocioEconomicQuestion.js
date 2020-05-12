import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

import Decoration from '../../components/decoration/Decoration'
import Checkboxes from '../../components/form/Checkboxes'
import Select from '../../components/form/Select'
import TextInput from '../../components/form/TextInput'
import StickyFooter from '../../components/StickyFooter'
import { updateDraft } from '../../redux/actions'
import colors from '../../theme.json'
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

export class SocioEconomicQuestion extends Component {
  readOnlyDraft = this.props.navigation.getParam('family') || []
  readOnly = this.props.navigation.getParam('readOnly') || false
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
    errors: [],
    showErrors: false
  }

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  setError = (error, field, memberIndex) => {
    const { errors } = this.state

    const fieldName = memberIndex ? `${field}-${memberIndex}` : field

    if (error && !errors.includes(fieldName)) {
      this.setState(previousState => {
        return {
          ...previousState,
          errors: [...previousState.errors, fieldName]
        }
      })
    } else if (!error) {
      this.setState({
        errors: errors.filter(item => item !== fieldName)
      })
    }
  }

  validateForm = () => {
    if (this.state.errors.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.onContinue()
    }
  }

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
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft
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

  getFamilyMemberFieldValue = (field, index, key) => {
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft

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
    ].socioEconomicAnswers.filter(item => item.key === field)[0][key]
  }

  onContinue = () => {
    const socioEconomics = this.props.navigation.getParam('socioEconomics')
    const STEP_FORWARD = 1
    const NEXT_SCREEN_NUMBER = setScreen(
      socioEconomics,
      this.getDraft(),
      STEP_FORWARD
    )

    !socioEconomics ||
    (socioEconomics &&
      socioEconomics.currentScreen === socioEconomics.totalScreens) ||
    (socioEconomics && NEXT_SCREEN_NUMBER > socioEconomics.totalScreens)
      ? this.props.navigation.navigate('BeginLifemap', {
          survey: this.survey,
          draftId: this.draftId
        })
      : this.props.navigation.replace('SocioEconomicQuestion', {
          survey: this.survey,
          draftId: this.draftId,
          socioEconomics: {
            currentScreen: NEXT_SCREEN_NUMBER,
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

  updateEconomicAnswer = (question, value, memberIndex) => {
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft
    const {
      conditionalQuestions,
      elementsWithConditionsOnThem: { questionsWithConditionsOnThem }
    } = this.state

    // We get a draft with updated answer
    let currentDraft
    const keyName = !Array.isArray(value) ? 'value' : 'multipleValue'
    const isOtherOption =
      typeof value === 'object' && value.hasOwnProperty('other')
    const otherOptionKey = question.options.find(
      option => option.otherOption === true
    )
    const newAnswer = {
      key: question.codeName,
      ...(isOtherOption
        ? {
            value: otherOptionKey && otherOptionKey.value,
            other: value.other
          }
        : {
            [keyName]:
              question.answerType === 'number'
                ? value.replace(/[,.]/g, '')
                : value
          })
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
      } else {
        const page = navigation.getParam('page') || 0
        navigation.setParams({
          socioEconomics: {
            currentScreen: page ? page + 1 : 1,
            questionsPerScreen,
            totalScreens
          },
          title: questionsPerScreen[page].forFamily[0]
            ? questionsPerScreen[page].forFamily[0].topic
            : questionsPerScreen[page].forFamilyMember[0].topic
        })
      }
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
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft

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

  cleanErrorsCodenamesOnUnmount = (field, memberIndex) => {
    let { errors } = this.state
    const fieldName = memberIndex ? `${field}-${memberIndex}` : field
    if (fieldName) {
      errors = errors.filter(item => item !== fieldName)
    }

    this.setState({
      errors
    })
  }

  render() {
    const { t } = this.props
    const { showErrors } = this.state
    const socioEconomics = this.props.navigation.getParam('socioEconomics')

    const questionsForThisScreen = socioEconomics
      ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
      : {}

    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft

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
      <StickyFooter
        onContinue={this.validateForm}
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
            .map(question => {
              if (
                question.answerType === 'select' ||
                question.answerType === 'radio'
              ) {
                const radioQuestionSelected =
                  draft.economicSurveyDataList.some(
                    answer => answer.key === question.codeName
                  ) || false

                return (
                  <View key={question.codeName}>
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
                      onChange={(value, otherOptionId) =>
                        this.updateEconomicAnswer(
                          question,
                          otherOptionId && otherOptionId === 'other'
                            ? { other: value }
                            : value,
                          false
                        )
                      }
                      placeholder={question.questionText}
                      label={question.questionText}
                      initialValue={
                        this.getFieldValue(question.codeName, 'value') || ''
                      }
                      options={getConditionalOptions(question, draft)}
                      readOnly={!!this.readOnly}
                      showErrors={showErrors}
                      setError={this.setError}
                      otherField={'other'}
                      otherPlaceholder={t('views.lifemap.writeYourAnswerHere')}
                      initialOtherValue={
                        this.getFieldValue(question.codeName, 'other') || ''
                      }
                      cleanErrorsOnUnmount={this.cleanErrorsCodenamesOnUnmount}
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
                    readOnly={!!this.readOnly}
                    showErrors={showErrors}
                    setError={isError =>
                      this.setError(isError, question.codeName)
                    }
                  />
                )
              } else if (question.answerType === 'checkbox') {
                let multipleValue = []
                //passong the asnwered questions form the checbox , if no questions are answered then send []
                draft.economicSurveyDataList.find(elem => {
                  if (
                    elem.key === question.codeName &&
                    typeof elem.multipleValue !== 'undefined' &&
                    elem.multipleValue.length
                  ) {
                    multipleValue = elem.multipleValue
                  }
                })

                return (
                  <View key={question.codeName}>
                    <Checkboxes
                      placeholder={question.questionText}
                      options={getConditionalOptions(question, draft)}
                      multipleValue={multipleValue}
                      readOnly={!!this.readOnly}
                      updateAnswers={update =>
                        this.updateEconomicAnswer(question, update, false)
                      }
                      setError={isError =>
                        this.setError(isError, question.codeName)
                      }
                      showErrors={showErrors}
                      required={question.required}
                    />
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
                    readOnly={!!this.readOnly}
                    showErrors={showErrors}
                    setError={isError =>
                      this.setError(isError, question.codeName)
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
                            onChange={(value, otherOptionId) =>
                              this.updateEconomicAnswer(
                                question,
                                otherOptionId && otherOptionId === 'other'
                                  ? { other: value }
                                  : value,
                                i
                              )
                            }
                            placeholder={question.questionText}
                            label={question.questionText}
                            initialValue={
                              this.getFamilyMemberFieldValue(
                                question.codeName,
                                i,
                                'value'
                              ) || ''
                            }
                            options={getConditionalOptions(question, draft, i)}
                            memberIndex={i + 1}
                            readOnly={!!this.readOnly}
                            showErrors={showErrors}
                            setError={this.setError}
                            otherField={'other'}
                            otherPlaceholder={t(
                              'views.lifemap.writeYourAnswerHere'
                            )}
                            initialOtherValue={
                              this.getFamilyMemberFieldValue(
                                question.codeName,
                                i,
                                'other'
                              ) || ''
                            }
                            cleanErrorsOnUnmount={
                              this.cleanErrorsCodenamesOnUnmount
                            }
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
                              i,
                              'value'
                            ) || ''
                          )}
                          validation="number"
                          keyboardType="numeric"
                          readOnly={!!this.readOnly}
                          showErrors={showErrors}
                          setError={isError =>
                            this.setError(isError, question.codeName)
                          }
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
                              i,
                              'value'
                            ) || ''
                          }
                          readOnly={!!this.readOnly}
                          showErrors={showErrors}
                          setError={isError =>
                            this.setError(isError, question.codeName)
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
      </StickyFooter>
    )
  }
}

const styles = StyleSheet.create({
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
