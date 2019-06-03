import moment from 'moment'

/**
 * Filters the options that are going to be displayed for a question
 * @selectedVal {*} question the question that has the options to filter
 */

export const CONDITION_TYPES = {
  SOCIOECONOMIC: 'socioEconomic',
  FAMILY: 'family',
  MEMBER_SOCIOEONOMIC: 'memberSocioEconomic'
}

const evaluateCondition = (condition, targetQuestion) => {
  const OPERATORS = {
    EQUALS: 'equals',
    NOT_EQUALS: 'not_equals',
    LESS_THAN: 'less_than',
    GREATER_THAN: 'greater_than',
    LESS_THAN_EQ: 'less_than_eq',
    GREATER_THAN_EQ: 'greater_than_eq',
    BETWEEN: 'between'
  }
  if (!targetQuestion) {
    return false
  }

  if (condition.operator === OPERATORS.EQUALS) {
    if (moment.isMoment(targetQuestion.value)) {
      return (
        moment().diff(targetQuestion.value, 'years') === Number(condition.value)
      )
    }
    return targetQuestion.value === condition.value
  }
  if (condition.operator === OPERATORS.NOT_EQUALS) {
    if (moment.isMoment(targetQuestion.value)) {
      return (
        moment().diff(targetQuestion.value, 'years') !== Number(condition.value)
      )
    }
    return targetQuestion.value !== condition.value
  }
  if (condition.operator === OPERATORS.LESS_THAN) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') < condition.value
    }
    return targetQuestion.value < condition.value
  }
  if (condition.operator === OPERATORS.GREATER_THAN) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') > condition.value
    }
    return targetQuestion.value > condition.value
  }
  if (condition.operator === OPERATORS.LESS_THAN_EQ) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') <= condition.value
    }
    return targetQuestion.value <= condition.value
  }
  if (condition.operator === OPERATORS.GREATER_THAN_EQ) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') >= condition.value
    }
    return targetQuestion.value >= condition.value
  }
  return false
}

export const conditionMet = (condition, currentDraft, memberIndex) => {

  const socioEconomicAnswers = currentDraft.economicSurveyDataList || []
  const { familyMembersList } = currentDraft.familyData
  let targetQuestion = null
  // Adding this to support backwards compatibility
  const scope = condition.scope || condition.type
  if (scope === CONDITION_TYPES.SOCIOECONOMIC) {
    // In this case target should be located in the socioeconomic answers
    targetQuestion = socioEconomicAnswers.find(
      element => element.key === condition.codeName
    )
  } else if (scope === CONDITION_TYPES.FAMILY) {
    const familyMember = familyMembersList[memberIndex]
    // TODO HARDCODED FOR IRRADIA. WE NEED A BETTER WAY TO SPECIFY THAT THE CONDITION
    // HAS BEEN MADE ON A DATE
    // const value = familyMember[condition.codeName]
    //   ? moment.unix(familyMember[condition.codeName])
    //   : null;
    // TODO hardcoded for Irradia, the survey has an error with the field.
    // The lines above should be used once data is fixed for that survey
    let value
    if (condition.codeName.toLowerCase() === 'birthdate') {
      value = familyMember['birthDate']
        ? moment.unix(familyMember['birthDate'])
        : null
      // TODO DELETE THIS after reviewing the conditional logic
      // In case the target question is null, we should return true.
      // Eventually, the conditional object should include information about that
      // and delete this hard-coding
      if (!value) {
        // Now we have a proper feature of showIfNoData. Keeping this
        // hardcode just for backwards compatibility for IRRADIA.
        return true
      }
    } else {
      value = familyMember[condition.codeName]
    }
    targetQuestion = { value }
  } else if (scope === CONDITION_TYPES.MEMBER_SOCIOEONOMIC) {
    const {
      socioEconomicAnswers: memberSocioEconomicAnswers = []
    } = familyMembersList[memberIndex]
    targetQuestion = memberSocioEconomicAnswers.find(
      element => element.key === condition.codeName
    )
  }

  // Added support for showIfNoData. In the case this field is set to true in the
  // condition config and the target question does not have value, we show the question
  // without any further evaluation
  if (
    condition.showIfNoData &&
    (!targetQuestion || (!targetQuestion.value && targetQuestion.value !== 0))
  ) {
    return true
  }
  // Adding support for several values spec. In case we find more than one value,
  // the condition is considered to be met if the evaluation returns true for at least one
  // of the values received in the array
  if (Array.isArray(condition.values) && condition.values.length > 0) {
    return condition.values.reduce((acc, current) => {
      return (
        acc ||
        evaluateCondition({ ...condition, value: current }, targetQuestion)
      )
    }, false)
  }
  return evaluateCondition(condition, targetQuestion)
}

export const shouldShowQuestion = (question, currentDraft, memberIndex) => {

  let shouldShow = true
  if (question.conditions && question.conditions.length > 0) {
    question.conditions.forEach(condition => {
      if (!conditionMet(condition, currentDraft, memberIndex)) {
        shouldShow = false
      }
    })
  }
  return shouldShow
}

export const familyMemberWillHaveQuestions = (
  questions,
  currentDraft,
  memberIndex
) => {
  return questions.forFamilyMember.reduce(
    (acc, current) =>
      acc || shouldShowQuestion(current, currentDraft, memberIndex),
    false
  )
}

export const getConditionalOptions = (question, currentDraft, index) =>
  question.options.filter(option =>
    shouldShowQuestion(option, currentDraft, index)
  )
