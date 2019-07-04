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

  // filter out ghost family members
  result.familyData.familyMembersList = result.familyData.familyMembersList.filter(
    member => member.firstName
  )

  result.familyData.countFamilyMembers =
    result.familyData.familyMembersList.length

  // check for family members with no firstParticipant property
  if (
    result.familyData.familyMembersList.some(member => !member.firstParticipant)
  ) {
    result.familyData.familyMembersList.map(member => {
      if (!member.firstParticipant) {
        return {
          ...member,
          firstParticipant: false
        }
      } else {
        return member
      }
    })
  }

  return result
}
