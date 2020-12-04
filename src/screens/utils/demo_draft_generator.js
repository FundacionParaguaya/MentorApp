import { names } from './randomnames'
export const generateRandomDraftData = (
  draftId,
  surveyId,
  totalScreens,
  documentType,
  projectId,
) => {
  return {
    status: 'Draft',
    sendEmail: false,
    project:projectId,
    surveyId,
    sign: '',
    pictures: [],
    created: Date.now(),
    draftId,
    familyData: {
      countFamilyMembers: 2,
      familyMembersList: [
        {
          firstParticipant: true,
          socioEconomicAnswers: [],
          birthCountry: 'PY',
          phoneCode: '595',
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
          gender: 'F',
          socioEconomicAnswers: [],
        }
      ]
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
