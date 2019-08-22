import React from 'react'
import Select from '../../../components/form/Select'
import { SocioEconomicQuestion } from '../SocioEconomicQuestion'
import { shallow } from 'enzyme'

const survey = {
  title: 'Chile - Geco',
  surveyId: 100,
  surveyConfig: {},
  surveyStoplightQuestions: [],
  surveyEconomicQuestions: [
    {
      questionText:
        'Is there any member with disabilities in your household? Please indicate the disability type',
      answerType: 'select',
      dimension: 'Family details',
      topic: 'Family details',
      required: true,
      forFamilyMember: false,
      codeName: 'memberDisabilities',
      options: [
        { value: 'PHYSICAL', text: 'Phisical' },
        { value: 'MENTAL', text: 'Mental' },
        { value: 'LEARNING', text: 'Learning' },
        {
          value: 'NO-MEMBER-DISABILITIES',
          text: 'No member with disabilities'
        }
      ]
    },
    {
      questionText: 'What is the property title situation of your household?',
      answerType: 'select',
      dimension: 'Family details',
      topic: 'Family details',
      required: false,
      codeName: 'situation',
      forFamilyMember: false,
      options: [
        { value: 'OWNER', text: 'Owner' },
        {
          value: 'COUNCIL-HOUSING-ASSOCIATION',
          text: 'Council/Housing Association'
        },
        { value: 'PRIVATE-RENTAL', text: 'Private rental' },
        { value: 'LIVING-WITH-PARENTS', text: 'Living with Parents' },
        { value: 'PREFER-NOT-TO-SAY', text: 'Prefer not to say' }
      ]
    },
    {
      questionText: 'What is your highest educational level?',
      answerType: 'select',
      dimension: 'Education',
      topic: 'Education',
      codeName: 'highestEducation',
      required: true,
      forFamilyMember: true,
      options: [
        { value: 'SCHOOL-INCOMPLETE', text: 'School incomplete' },
        { value: 'SCHOOL-COMPLETE', text: 'Apprenticeship complete' },
        { value: 'APPRENTICESHIP-COMPLETE', text: 'Unmployed' },
        { value: 'COLLEGE-COMPLETE', text: 'College complete' },
        { value: 'UNIVERSITY-COMPLETE', text: 'University complete' }
      ]
    },
    {
      questionText: 'What is your firstParticipant economic activity?',
      answerType: 'select',
      dimension: 'Income',
      topic: 'Income',
      required: true,
      codeName: 'participantJob',
      forFamilyMember: false,
      options: [
        { value: 'EMPLOYED', text: 'Employed' },
        { value: 'SELF-EMPLOYED', text: 'Self Employed' },
        { value: 'UNEMPLOYED', text: 'Unmployed' },
        { value: 'RETIRED', text: 'Retired' },
        { value: 'NONE', text: 'None' }
      ]
    },
    {
      questionText:
        'Please estimate your gross monthly household income (i.e, before taxes National Insurance contributions or other deductions)',
      answerType: 'text',
      dimension: 'Income',
      topic: 'Income',
      codeName: 'grossIncome',
      required: true,
      forFamilyMember: false,
      options: []
    },
    {
      questionText:
        'Do you receive any state income. (e.g. allowances, benefits, disability, pension)?',
      answerType: 'select',
      dimension: 'Income',
      topic: 'Income',
      codeName: 'stateIncome',
      required: false,
      forFamilyMember: false,
      options: [{ value: 'YES', text: 'yes' }, { value: 'NO', text: 'no' }]
    }
  ]
}

const { surveyEconomicQuestions } = survey

const questionsPerScreen = [
  {
    forFamily: [surveyEconomicQuestions[0], surveyEconomicQuestions[1]],
    forFamilyMember: []
  },
  {
    forFamily: [],
    forFamilyMember: [surveyEconomicQuestions[2]]
  },
  {
    forFamily: [
      surveyEconomicQuestions[3],
      surveyEconomicQuestions[4],
      surveyEconomicQuestions[5]
    ],
    forFamilyMember: []
  }
]

const draftId = 1

const draft = {
  draftId,
  progress: { screen: 'FamilyParticipant', total: 8 },
  familyData: {
    countFamilyMembers: 1,
    country: 'BG',
    familyMembersList: [
      {
        firstName: 'Juan',
        lastName: 'Perez',
        documentNumber: '123456',
        documentType: '0',
        email: 'juan@gmail.com',
        birthCountry: 'PY',
        gender: 'M',
        birthDate: 12345,
        firstParticipant: true
      },
      {
        firstName: 'Ana',
        firstParticipant: false
      }
    ]
  },
  economicSurveyDataList: []
}

const resumedDraft = {
  ...draft,
  economicSurveyDataList: [
    { key: 'memberDisabilities', value: 'PHYSICAL' },
    { key: 'situation', value: 'PRIVATE-RENTAL' }
  ],
  familyData: {
    ...draft.familyData,
    familyMembersList: [
      {
        ...draft.familyData.familyMembersList[0],
        socioEconomicAnswers: [
          { key: 'highestEducation', value: 'SCHOOL-INCOMPLETE' }
        ]
      },
      {
        ...draft.familyData.familyMembersList[1],
        socioEconomicAnswers: [
          { key: 'highestEducation', value: 'SCHOOL-INCOMPLETE' }
        ]
      }
    ]
  }
}

const navigation = {
  isFocused: () => true,
  navigate: jest.fn(),
  setParams: jest.fn(),
  getParam: jest.fn(param => {
    if (param === 'readOnly') {
      return false
    } else if (param === 'survey') {
      return survey
    } else if (param === 'draftId') {
      return draftId
    } else if (param === 'socioEconomics') {
      return null
    } else if (param === 'title') {
      return 'Socio Economics'
    } else if (param === 'fromBeginLifemap') {
      return false
    }
  })
}

const createTestProps = props => ({
  t: value => value,
  navigation,
  drafts: [draft, { draftId: 2 }],
  updateDraft: jest.fn(),
  language: 'en',
  ...props
})

let wrapper
let props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<SocioEconomicQuestion {...props} />)
})

it('receives proper survey from navigation', () => {
  expect(wrapper.instance().survey).toBe(survey)
})

it('receives proper draftId from navigation', () => {
  expect(wrapper.instance().draftId).toBe(draftId)
})

it('gets proper draft from draftId', () => {
  expect(wrapper.instance().getDraft()).toBe(draft)
})

it('navigates to begin lifemap on continue ', () => {
  wrapper.instance().onContinue()
  expect(props.navigation.navigate).toHaveBeenCalledWith('BeginLifemap', {
    survey,
    draftId
  })
})

it('updates only when focused', () => {
  expect(wrapper.instance().shouldComponentUpdate()).toEqual(true)
})

it('navigates back to proper screen', () => {
  wrapper.instance().onPressBack()
  expect(props.navigation.navigate).toHaveBeenCalledWith('Location', {
    survey,
    draftId
  })
})

it('sets draft navigation when navigation from a different page', () => {
  expect(props.updateDraft).toHaveBeenCalledWith({
    ...draft,
    progress: {
      ...draft.progress,
      screen: 'SocioEconomicQuestion'
    }
  })
})

it('creates socioEconomics param when navigating for first time', () => {
  wrapper.instance().setSocioEconomicsParam()

  expect(props.navigation.setParams).toHaveBeenCalledWith({
    socioEconomics: {
      currentScreen: 1,
      questionsPerScreen: questionsPerScreen,
      totalScreens: 3
    },
    title: 'Family details'
  })
})

it('creates socioEconomics param when navigating from begin lifemap', () => {
  props = createTestProps({
    navigation: {
      ...navigation,
      getParam: jest.fn(param => {
        if (param === 'readOnly') {
          return false
        } else if (param === 'survey') {
          return survey
        } else if (param === 'draftId') {
          return draftId
        } else if (param === 'socioEconomics') {
          return null
        } else if (param === 'title') {
          return 'Socio Economics'
        } else if (param === 'fromBeginLifemap') {
          return true
        }
      })
    }
  })
  wrapper = shallow(<SocioEconomicQuestion {...props} />)

  wrapper.instance().setSocioEconomicsParam()

  expect(props.navigation.setParams).toHaveBeenCalledWith({
    socioEconomics: {
      currentScreen: 3,
      questionsPerScreen: questionsPerScreen,
      totalScreens: 3
    },
    title: 'Income'
  })
})

describe('after setup', () => {
  beforeEach(() => {
    props = createTestProps({
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'readOnly') {
            return false
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return draftId
          } else if (param === 'socioEconomics') {
            return {
              currentScreen: 1,
              questionsPerScreen: questionsPerScreen,
              totalScreens: 3
            }
          } else if (param === 'title') {
            return 'Socio Economics'
          } else if (param === 'fromBeginLifemap') {
            return false
          }
        })
      }
    })
    wrapper = shallow(<SocioEconomicQuestion {...props} />)
  })
  it('shows an input for each question', () => {
    expect(wrapper.find(Select)).toHaveLength(2)
    expect(wrapper.find(Select).first()).toHaveProp({
      id: surveyEconomicQuestions[0].codeName,
      label: surveyEconomicQuestions[0].questionText,
      required: surveyEconomicQuestions[0].required,
      options: surveyEconomicQuestions[0].options
    })

    // DONE --- ToDo :: Check props for the last one
    expect(wrapper.find(Select).last()).toHaveProp({
      id: surveyEconomicQuestions[1].codeName,
      label: surveyEconomicQuestions[1].questionText,
      required: surveyEconomicQuestions[1].required,
      options: surveyEconomicQuestions[1].options
    })
  })

  it('shows an input for each member question', () => {
    props = createTestProps({
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'readOnly') {
            return false
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return draftId
          } else if (param === 'socioEconomics') {
            return {
              currentScreen: 2,
              questionsPerScreen: questionsPerScreen,
              totalScreens: 3
            }
          } else if (param === 'title') {
            return 'Socio Economics'
          } else if (param === 'fromBeginLifemap') {
            return false
          }
        })
      }
    })
    wrapper = shallow(<SocioEconomicQuestion {...props} />)

    expect(wrapper.find(Select)).toHaveLength(2)
    expect(wrapper.find('#Juan')).toHaveLength(1)
    expect(wrapper.find('#Juan')).toHaveHTML(
      '<react-native-mock>Juan</react-native-mock>'
    )

    // DONE -- ToDo surveyEconomicQuestions[2] check props of first and last select
    expect(wrapper.find(Select).first()).toHaveProp({
      id: surveyEconomicQuestions[2].codeName,
      label: surveyEconomicQuestions[2].questionText,
      required: surveyEconomicQuestions[2].required,
      options: surveyEconomicQuestions[2].options
    })

    expect(wrapper.find(Select).last()).toHaveProp({
      id: surveyEconomicQuestions[2].codeName,
      label: surveyEconomicQuestions[2].questionText,
      required: surveyEconomicQuestions[2].required,
      options: surveyEconomicQuestions[2].options
    })
  })

  it('updates a socio economic answer in draft', () => {
    // Done --- TODO -- Was failing because of the
    wrapper
      .instance()
      .updateEconomicAnswer(surveyEconomicQuestions[0], 'random')
    expect(props.updateDraft).toHaveBeenCalledWith({
      ...draft,
      progress: {
        ...draft.progress,
        screen: 'SocioEconomicQuestion'
      }
    })
  })
})

describe('resuming a draft', () => {
  /*
    TODO
    test TextInput

    Test if the first screen have the right initial values for the two selects
    Test screen 2 / The first Participant has initial value / Ana 's question should be empty because she didn't selected anything
    Test 3 screen (add in resume draft test)
  */
  beforeEach(() => {
    props = createTestProps({
      drafts: [resumedDraft],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'readOnly') {
            return false
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return draftId
          } else if (param === 'socioEconomics') {
            return {
              currentScreen: 1,
              questionsPerScreen: questionsPerScreen,
              totalScreens: 3
            }
          } else if (param === 'title') {
            return 'Socio Economics'
          } else if (param === 'fromBeginLifemap') {
            return false
          }
        })
      }
    })
    wrapper = shallow(<SocioEconomicQuestion {...props} />)
  })

  it('gets correct draft from Redux store on resuming', () => {
    // TODO
    expect(wrapper.instance().getDraft()).toBe(resumedDraft)
  })

  it('sets correct initial values for the selects on the first screen', () => {
    // TODO
    expect(wrapper.find(Select).first()).toHaveProp({
      initialValue: props.drafts[0].economicSurveyDataList[0].value
    })

    expect(wrapper.find(Select).last()).toHaveProp({
      initialValue: props.drafts[0].economicSurveyDataList[1].value
    })
  })

  it('sets correct initial values for the selects on the second screen', () => {
    // TODO

    props = createTestProps({
      drafts: [resumedDraft],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'readOnly') {
            return false
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return draftId
          } else if (param === 'socioEconomics') {
            return {
              currentScreen: 2,
              questionsPerScreen: questionsPerScreen,
              totalScreens: 3
            }
          } else if (param === 'title') {
            return 'Socio Economics'
          } else if (param === 'fromBeginLifemap') {
            return false
          }
        })
      }
    })
    wrapper = shallow(<SocioEconomicQuestion {...props} />)

    expect(wrapper.find(Select).first()).toHaveProp({
      initialValue:
        resumedDraft.familyData.familyMembersList[0].socioEconomicAnswers[0]
          .value
    })
  })

  it('updates socioEconomics param when navigating from another socioEconomics page', () => {
    wrapper.instance().setSocioEconomicsParam()

    expect(props.navigation.setParams).toHaveBeenCalledWith({
      socioEconomics: {
        currentScreen: 3,
        questionsPerScreen: questionsPerScreen,
        totalScreens: 3
      },
      title: 'Income'
    })
  })
})

describe('readonly mode', () => {
  beforeEach(() => {
    props = createTestProps({
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'readOnly') {
            return true
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return draftId
          } else if (param === 'socioEconomics') {
            return null
          } else if (param === 'title') {
            return 'Socio Economics'
          } else if (param === 'fromBeginLifemap') {
            return false
          }
        })
      }
    })
    wrapper = shallow(<SocioEconomicQuestion {...props} />)
  })
})
