import store from '../../redux/store'
import draftMock from '../__mocks__/draftMock'

export const getDraft = () =>
  store
    .getState()
    .drafts.find(draft => draft.draftId === store.getState().nav.draftId) ||
  draftMock

export const getTotalEconomicScreens = survey => {
  let currentDimension = ''
  let totalScreens = 0

  survey.surveyEconomicQuestions.forEach(question => {
    // if the dimention of the questions change, change the page
    if (question.topic !== currentDimension) {
      currentDimension = question.topic
      totalScreens += 1
    }
  })

  return totalScreens
}

export const getTotalScreens = survey => {
  const draft = getDraft()

  // there are 5 screens each snapshot always has:
  // participant, location, begin lifemap, overview and final
  return (
    5 +
    survey.surveyStoplightQuestions.length +
    getTotalEconomicScreens(survey) +
    (draft && draft.familyData.countFamilyMembers > 1 ? 1 : 0) +
    (draft && draft.indicatorSurveyDataList.filter(item => !item.value).length
      ? 1
      : 0)
  )
}

export const setValidationSchema = (
  requiredFieldsForSurvey,
  field,
  defaultValidation
) => {
  return Array.isArray(requiredFieldsForSurvey)
    ? requiredFieldsForSurvey.length
      ? requiredFieldsForSurvey.some(f => f === field)
      : false
    : defaultValidation
}
