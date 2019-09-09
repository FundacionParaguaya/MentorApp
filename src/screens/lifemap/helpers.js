import { familyMemberWillHaveQuestions } from '../utils/conditional_logic'

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

export const getTotalScreens = (survey, draft) => {
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

/*
    - NOTHING IS REQUIRED
    "requiredFields": {
      "primaryParticipant": [],
      "familyMember": []
    }

    - APPLY DEFAULT VALIDATION FOR ALL FIELDS
    "requiredFields": {
      "primaryParticipant": null,
      "familyMember": null
    }

    - APPLY DEFAULT VALIDATION FOR "primaryParticipant"
        AND FOR "familyMember" SET ONLY BIRTHDAY FIELD AS REQUIRED
    "requiredFields": {
      "primaryParticipant": null,
      "familyMember": ["birthDate"]
    }
*/
export const setValidationSchema = (
  requiredFieldsForSurvey,
  field,
  defaultValidation
) => {
  if (!requiredFieldsForSurvey || !field) {
    return defaultValidation
  }

  return Array.isArray(requiredFieldsForSurvey)
    ? requiredFieldsForSurvey.length
      ? requiredFieldsForSurvey.some(f => f === field)
      : defaultValidation
    : defaultValidation
}

export const setScreen = (screenData, draft, step) => {
  const SKIP_SCREEN_WITH_ONE_STEP = step

  /* 'fromBeginLifemap' when pressing baack on the last screen we receive
      current screen === totalScreens :
      to get actual data for current -1 , to get data previous screen -1
      that caused the -2 value */

  const QUESTIONS_FOR_NEXT_SCREEN =
    screenData.questionsPerScreen[
      screenData.currentScreen === screenData.totalScreens && step === -1
        ? screenData.currentScreen - 2 //
        : screenData.currentScreen
    ]
  if (
    !(
      QUESTIONS_FOR_NEXT_SCREEN.forFamily &&
      QUESTIONS_FOR_NEXT_SCREEN.forFamily.length
    ) &&
    QUESTIONS_FOR_NEXT_SCREEN.forFamilyMember &&
    QUESTIONS_FOR_NEXT_SCREEN.forFamilyMember.length
  ) {
    const { familyMembersList } = draft.familyData
    const atLeastOneMemberHasQuestions = familyMembersList.some(
      (_member, index) => {
        return familyMemberWillHaveQuestions(
          QUESTIONS_FOR_NEXT_SCREEN,
          draft,
          index
        )
      }
    )

    return !atLeastOneMemberHasQuestions
      ? screenData.currentScreen + step + SKIP_SCREEN_WITH_ONE_STEP
      : screenData.currentScreen + step
  }

  return screenData.currentScreen + step
}
