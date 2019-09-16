import { generateRandomDraftData } from './demo_draft_generator'
import { getTotalScreens } from '../lifemap/helpers'

const LATIN_CHARS = /^[A-Za-z0-9]*$/

export const checkAndReplaceSpecialChars = question => {
  return {
    ...question,
    options: question.options.map(option => {
      return {
        ...option,
        text: LATIN_CHARS.test(option.text.replace(/\s/g, '')) // check for strange chars and if found decode
          ? option.text
          : decodeURIComponent(option.text)
      }
    })
  }
}

export const prepareDraftForSubmit = (draft, survey) => {
  // remove unnecessary for sync properties from saved draft
  const { progress, errors, status, ...result } = Object.assign({}, draft)

  // we remove
  progress
  errors
  status

  // check for frequent sync errors

  // set country to survey country if not set
  if (!result.familyData.country) {
    result.familyData.country =
      survey.surveyConfig.surveyLocation &&
      survey.surveyConfig.surveyLocation.country
  }

  return result
}

export const generateNewDemoDraft = (survey, draftId) => {
  const toalScreens = getTotalScreens(survey)
  const random = Math.floor(
    Math.random() & survey.surveyConfig.documentType.length
  )
  const documentType = survey.surveyConfig.documentType[random]
  const surveyId = survey.id
  return generateRandomDraftData(draftId, surveyId, toalScreens, documentType)
}
