import { names } from './randomnames'
export const generateRandomDraftData = (
  draftId,
  surveyId,
  totalScreens,
  documentType
) => {
  return {
    status: 'Draft',
    surveyId,
    created: Date.now(),
    draftId,
    familyData: {
      countFamilyMembers: 2,
      familyMembersList: [
        {
          firstParticipant: true,
          socioEconomicAnswers: [],
          birthCountry: 'PY',
          firstName: 'Stoplight Demo',
          lastName: `${getRandomName()}`,
          gender: 'M',
          birthDate: 98323200,
          documentType: documentType.value,
          documentNumber: '0000'
        },
        {
          firstParticipant: false,
          firstName: `${getRandomName()}`,
          gender: 'F'
        }
      ],
      country: 'PY',
      longitude: -70.6692655,
      latitude: -33.44888970000001,
      accuracy: 0
    },
    economicSurveyDataList: [],
    priorities: [],
    indicatorSurveyDataList: [],
    achievements: [],
    progress: {
      screen: 'FamilyParticipant',
      total: totalScreens
    }
  }
}

const getRandomName = () => {
  return names[Math.floor(Math.random() * names.length)]
}
