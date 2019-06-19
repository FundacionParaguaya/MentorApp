import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text, Platform } from 'react-native'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import TextInput from '../../components/TextInput'
import Select from '../../components/Select'
import Checkbox from '../../components/Checkbox'
import { addSurveyDataCheckBox } from '../../redux/actions'
import colors from '../../theme.json'
import {
  shouldShowQuestion,
  getConditionalOptions,
  getDraftWithUpdatedEconomic,
  getDraftWithUpdatedFamilyEconomics,
  getDraftWithUpdatedQuestionsCascading
} from '../utils/conditional_logic'
import { getTotalScreens } from './helpers'

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
  draftId = this.props.navigation.getParam('draft')
    ? this.props.navigation.getParam('draft').draftId
    : null
  readOnly = this.props.navigation.getParam('readOnly')

  errorsDetected = []
  state = {
    errorsDetected: [],
    showErrors: false,
    draft:
      this.props.navigation.getParam('draft') ||
      this.props.navigation.getParam('family') ||
      {}
  }

  constructor(props) {
    super(props)
    const { draft } = this.state
    // If this is the first socio economics screen set the whole process
    // in the navigation. On every next screen it will know which questions
    // to ask and if it is done.
    if (!props.navigation.getParam('socioEconomics')) {
      let currentDimension = ''
      let questionsPerScreen = []
      let totalScreens = 0

      // go trough all questions and separate them by screen
      // filter method - checks if family members meet the conditions based on age
      this.survey.surveyEconomicQuestions
        .filter(question =>
          !!question.conditions &&
          question.conditions.length &&
          !!question.forFamilyMember &&
          question.conditions[0].codeName.toLocaleLowerCase() === 'birthdate'
            ? draft.familyData.familyMembersList.filter(
                (member, index) => !!shouldShowQuestion(question, draft, index)
              ).length
              ? question
              : false
            : question
        )
        .forEach(question => {
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
    const { draft } = this.state
    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft
    })

    if (!this.readOnly) {
      this.setState({
        draft: {
          ...draft,
          progress: {
            ...draft.progress,
            screen: 'SocioEconomicQuestion',
            total: getTotalScreens(this.survey)
          }
        }
      })

      this.props.navigation.setParams({
        onPressBack: this.onPressBack
      })
    }
  }

  onPressBack = () => {
    const socioEconomics = this.props.navigation.getParam('socioEconomics')

    socioEconomics.currentScreen === 1
      ? this.props.navigation.push('Location', {
          survey: this.survey,
          draft: this.state.draft
        })
      : this.props.navigation.push('SocioEconomicQuestion', {
          socioEconomics: {
            currentScreen: socioEconomics.currentScreen - 1,
            questionsPerScreen: socioEconomics.questionsPerScreen,
            totalScreens: socioEconomics.totalScreens
          },
          survey: this.survey,
          draft: this.state.draft
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

  getFieldValue = (field, propertyKey) => {
    const { draft } = this.state
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
    const { draft } = this.state
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

  detectError = (error, field, memberIndex) => {
    // if the current Screen has members with one and the same question add index after the codeName of the question
    const fieldName = memberIndex ? `${field}-${memberIndex}` : field
    if (error && !this.errorsDetected.includes(fieldName)) {
      this.errorsDetected.push(fieldName)
    } else if (!error) {
      this.errorsDetected = this.errorsDetected.filter(
        item => item !== fieldName
      )
    }

    this.setState({
      errorsDetected: this.errorsDetected
    })
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

  submitForm = () => {
    if (this.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      const socioEconomics = this.props.navigation.getParam('socioEconomics')

      !socioEconomics ||
      socioEconomics.currentScreen === socioEconomics.totalScreens
        ? this.props.navigation.navigate('BeginLifemap', {
            survey: this.survey,
            draft: this.state.draft
          })
        : this.props.navigation.push('SocioEconomicQuestion', {
            survey: this.survey,
            draft: this.state.draft,
            socioEconomics: {
              currentScreen: socioEconomics.currentScreen + 1,
              questionsPerScreen: socioEconomics.questionsPerScreen,
              totalScreens: socioEconomics.totalScreens
            }
          })
    }
  }

  onPressCheckbox = (text, field) => {
    const { draft } = this.state
    let deleteVal = false
    draft.economicSurveyDataList.forEach(e => {
      if (e.key === field) {
        if (typeof e.multipleValue !== 'undefined') {
          e.multipleValue.forEach((el, i) => {
            if (el === text) {
              deleteVal = true
              e.multipleValue.splice(i, 1)
            }
          })
        }
      }
    })

    if (!deleteVal) {
      this.props.addSurveyDataCheckBox(
        draft.draftId,
        'economicSurveyDataList',
        {
          [field]: text
        }
      )
    }
  }

  updateEconomicAnswer = (question, value, memberIndex) => {
    const {
      conditionalQuestions,
      elementsWithConditionsOnThem: { questionsWithConditionsOnThem }
    } = this.props.nav

    // We get a draft with updated answer
    let currentDraft
    const newAnswer = {
      key: question.codeName,
      value
    }

    if (question.forFamilyMember) {
      currentDraft = getDraftWithUpdatedFamilyEconomics(
        this.state.draft,
        newAnswer,
        memberIndex
      )
    } else {
      currentDraft = getDraftWithUpdatedEconomic(this.state.draft, newAnswer)
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
    this.setState({ draft: currentDraft })
  }

  render() {
    const { t } = this.props
    const { showErrors, draft } = this.state
    const socioEconomics = this.props.navigation.getParam('socioEconomics')
    const questionsForThisScreen = socioEconomics
      ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
      : {}

    const showMemberName = (member, memberIndex, questionsForFamilyMember) => {
      const memberHasQuestions = questionsForFamilyMember.filter(question =>
        shouldShowQuestion(question, draft, memberIndex)
      ).length
      return memberHasQuestions ? (
        <Text style={styles.memberName}>{member.firstName}</Text>
      ) : null
    }

    return (
      <StickyFooter
        handleClick={this.submitForm}
        continueLabel={t('general.continue')}
        readonly={this.readOnly}
        progress={
          !this.readOnly && draft
            ? ((draft.familyData.countFamilyMembers > 1 ? 3 : 2) +
                (socioEconomics ? socioEconomics.currentScreen : 1)) /
              draft.progress.total
            : 0
        }
      >
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
                  <React.Fragment key={question.codeName}>
                    {this.readOnly && !radioQuestionSelected ? null : (
                      <View>
                        {question.answerType === 'radio' ? (
                          <Text style={{ marginLeft: 10, marginBottom: 15 }}>
                            {question.questionText}
                          </Text>
                        ) : null}
                      </View>
                    )}

                    <Select
                      radio={question.answerType === 'radio' ? true : false}
                      required={question.required}
                      onChange={value =>
                        this.updateEconomicAnswer(question, value, false)
                      }
                      placeholder={question.questionText}
                      showErrors={showErrors}
                      label={question.questionText}
                      field={question.codeName}
                      value={
                        this.getFieldValue(question.codeName, 'value') || ''
                      }
                      detectError={this.detectError}
                      cleanErrorsOnUnmount={this.cleanErrorsCodenamesOnUnmount}
                      readonly={this.readOnly}
                      options={getConditionalOptions(question, draft)}
                    />
                  </React.Fragment>
                )
              } else if (question.answerType === 'number') {
                return (
                  <TextInput
                    multiline
                    key={question.codeName}
                    required={question.required}
                    onChangeText={value =>
                      this.updateEconomicAnswer(question, value, false)
                    }
                    placeholder={question.questionText}
                    showErrors={showErrors}
                    field={question.codeName}
                    value={this.getFieldValue(question.codeName, 'value') || ''}
                    detectError={this.detectError}
                    readonly={this.readOnly}
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
                        {question.questionText}
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
                  </View>
                )
              } else {
                return (
                  <TextInput
                    multiline
                    key={question.codeName}
                    required={question.required}
                    onChangeText={value =>
                      this.updateEconomicAnswer(question, value, false)
                    }
                    placeholder={question.questionText}
                    showErrors={showErrors}
                    field={question.codeName}
                    value={this.getFieldValue(question.codeName, 'value') || ''}
                    detectError={this.detectError}
                    readonly={this.readOnly}
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
                  .map(question =>
                    question.answerType === 'select' ||
                    question.answerType === 'radio' ? (
                      <Select
                        radio={question.answerType === 'radio' ? true : false}
                        key={question.codeName}
                        required={question.required}
                        onChange={value =>
                          this.updateEconomicAnswer(question, value, i)
                        }
                        placeholder={question.questionText}
                        showErrors={showErrors}
                        label={question.questionText}
                        field={question.codeName}
                        value={
                          this.getFamilyMemberFieldValue(
                            question.codeName,
                            i
                          ) || ''
                        }
                        detectError={this.detectError}
                        readonly={this.readOnly}
                        options={getConditionalOptions(question, draft, i)}
                        memberIndex={i + 1}
                        cleanErrorsOnUnmount={
                          this.cleanErrorsCodenamesOnUnmount
                        }
                      />
                    ) : (
                      <TextInput
                        key={question.codeName}
                        multiline
                        required={question.required}
                        onChangeText={value =>
                          this.updateEconomicAnswer(question, value, i)
                        }
                        placeholder={question.questionText}
                        showErrors={showErrors}
                        field={question.codeName}
                        value={
                          this.getFamilyMemberFieldValue(
                            question.codeName,
                            i
                          ) || ''
                        }
                        detectError={this.detectError}
                        readonly={this.readOnly}
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
  addSurveyDataCheckBox: PropTypes.func,
  drafts: PropTypes.array,
  nav: PropTypes.object
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

const mapDispatchToProps = {
  addSurveyDataCheckBox
}

const mapStateToProps = ({ drafts, nav }) => ({ drafts, nav })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SocioEconomicQuestion)
)
