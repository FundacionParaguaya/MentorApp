import { FamilyParticipant } from '../FamilyParticipant'
import React from 'react'
import StickyFooter from '../../../components/StickyFooter'
import TextInput from '../../../components/form/TextInput'
import { shallow } from 'enzyme'

// props
const survey = {
  id: 1,
  title: 'Dev Demo',
  survey_version_id: 2,
  surveyStoplightQuestions: [],
  surveyEconomicQuestions: [],
  surveyConfig: {
    surveyLocation: { country: 'BG' },
    gender: [
      {
        text: 'Female',
        value: 'F'
      },
      {
        text: 'Male',
        value: 'M'
      },
      {
        text: 'Prefer not to disclose',
        value: 'O',
        otherOption: true
      }
    ],
    documentType: [
      {
        text: 'National Insurance Number',
        value: 'NATIONALINSURANCE',
        otherOption: false
      },
      {
        text: 'Organisation Reference Number',
        value: 'ORGANISATIONALREFERENCENUMBER',
        otherOption: false
      },
      {
        text: 'Other identification',
        value: 'OTHER',
        otherOption: true
      }
    ]
  }
}

const defaultDraft = {
  draftId: expect.any(String),
  created: expect.any(Number),
  status: 'Draft',
  surveyId: 1,
  surveyVersionId: undefined,
  economicSurveyDataList: [],
  indicatorSurveyDataList: [],
  priorities: [],
  achievements: [],
  progress: {
    screen: 'FamilyParticipant',
    total: 5
  },
  familyData: {
    familyMembersList: [
      {
        firstParticipant: true,
        socioEconomicAnswers: [],
        birthCountry: 'BG'
      }
    ]
  }
}

const resumedDraft = {
  draftId: 1,
  progress: { screen: 'FamilyParticipant' },
  familyData: {
    countFamilyMembers: 1,
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
        firstParticipant: true,
        socioEconomicAnswers: [
          { key: 'educationPersonMostStudied', value: 'SCHOOL-COMPLETE' },
          { key: 'receiveStateIncome', value: 'NO' }
        ]
      }
    ]
  }
}

const navigation = {
  navigate: jest.fn(),
  getParam: jest.fn(param => {
    if (param === 'family') {
      return null
    } else if (param === 'survey') {
      return survey
    } else if (param === 'draftId') {
      return null
    } else if (param === 'readOnly') {
      return false
    } else {
      return 1
    }
  }),
  setParams: jest.fn(),
  isFocused: () => true
}

const createTestProps = props => ({
  drafts: [],
  t: value => value,
  createDraft: jest.fn(),
  updateDraft: jest.fn(),
  navigation,
  ...props
})

let wrapper
let props
beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<FamilyParticipant {...props} />)
})

it('receives proper survey from navigation', () => {
  expect(wrapper.instance().survey).toBe(survey)
})

it('generates family members count array', () => {
  const correctArray = [
    { text: 'views.family.onlyPerson', value: 1 },
    ...Array.from(new Array(24), (val, index) => ({
      value: index + 2,
      text: `${index + 2}`
    })),
    {
      text: 'views.family.preferNotToSay',
      value: -1
    }
  ]

  expect(wrapper.instance().familyMembersArray).toMatchObject(correctArray)
})

it('updates only when focused', () => {
  expect(wrapper.instance().shouldComponentUpdate()).toEqual(true)
})

describe('creating a new lifemap', () => {
  it('creates proper minimal draft on creating a new lifemap', () => {
    expect(props.createDraft).toHaveBeenCalledTimes(1)
    expect(props.createDraft).toHaveBeenCalledWith(defaultDraft)
  })

  it('sets draftId on creating a new draft', () => {
    expect(wrapper.instance().draftId).toEqual(expect.any(String))
  })
})

describe('resuming a draft', () => {
  const { familyData } = resumedDraft
  const participant = familyData.familyMembersList[0]

  beforeEach(() => {
    props = createTestProps({
      drafts: [resumedDraft],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return false
          } else {
            return 1
          }
        })
      }
    })
    wrapper = shallow(<FamilyParticipant {...props} />)
  })

  it('gets correct draft from Redux on resuming', () => {
    expect(wrapper.instance().getDraft()).toBe(resumedDraft)
  })

  it('sets draft navigation when navigation from a different page', () => {
    props = createTestProps({
      drafts: [
        {
          ...resumedDraft,
          progress: { ...resumedDraft.progress, screen: 'Location' }
        }
      ],
      navigation: {
        navigate: jest.fn(),
        isFocused: jest.fn(),
        setParams: jest.fn(),
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return false
          } else {
            return 1
          }
        })
      }
    })

    wrapper = shallow(<FamilyParticipant {...props} />)

    expect(props.updateDraft).toHaveBeenCalledWith({
      ...resumedDraft,
      progress: {
        ...resumedDraft.progress,
        screen: 'FamilyParticipant'
      }
    })
  })

  it('sets correct value from draft to each field', () => {
    expect(wrapper.find('#firstName')).toHaveProp({
      initialValue: participant.firstName
    })

    expect(wrapper.find('#lastName')).toHaveProp({
      initialValue: participant.lastName
    })

    expect(wrapper.find('#gender')).toHaveProp({
      initialValue: participant.gender
    })

    expect(wrapper.find('#birthDate')).toHaveProp({
      initialValue: participant.birthDate
    })

    expect(wrapper.find('#documentType')).toHaveProp({
      initialValue: participant.documentType
    })

    expect(wrapper.find('#documentNumber')).toHaveProp({
      initialValue: participant.documentNumber
    })

    expect(wrapper.find('#birthCountry')).toHaveProp({
      initialValue: participant.birthCountry
    })

    expect(wrapper.find('#email')).toHaveProp({
      initialValue: participant.email
    })

    expect(wrapper.find('#phoneNumber')).toHaveProp({
      initialValue: participant.phoneNumber
    })

    expect(wrapper.find('#countFamilyMembers')).toHaveProp({
      initialValue: familyData.countFamilyMembers
    })
  })

  it('updates the draft with correct data', () => {
    wrapper.instance().updateParticipant('User', 'firstName')

    expect(props.updateDraft).toHaveBeenCalledWith({
      ...resumedDraft,
      familyData: {
        ...resumedDraft.familyData,
        familyMembersList: Object.assign(
          [],
          resumedDraft.familyData.familyMembersList,
          {
            [0]: {
              ...resumedDraft.familyData.familyMembersList[0],
              firstName: 'User'
            }
          }
        )
      }
    })
  })

  it('updates the draft on each field change', () => {
    wrapper
      .find('#firstName')
      .props()
      .onChangeText()

    wrapper
      .find('#lastName')
      .props()
      .onChangeText()

    wrapper
      .find('#documentNumber')
      .props()
      .onChangeText()

    wrapper
      .find('#email')
      .props()
      .onChangeText()

    wrapper
      .find('#phoneNumber')
      .props()
      .onChangeText()

    wrapper
      .find('#gender')
      .props()
      .onChange()

    wrapper
      .find('#documentType')
      .props()
      .onChange()

    wrapper
      .find('#birthCountry')
      .props()
      .onChange()

    wrapper
      .find('#countFamilyMembers')
      .props()
      .onChange()

    wrapper
      .find('#countFamilyMembers')
      .props()
      .onChange()

    wrapper
      .find('#birthDate')
      .props()
      .onValidDate()

    expect(props.updateDraft).toHaveBeenCalledTimes(11)
  })

  it('sets errors on each field change', () => {
    const spy = jest.spyOn(wrapper.instance(), 'setError')
    wrapper
      .find('#firstName')
      .props()
      .setError(true)

    expect(spy).toHaveBeenCalledWith(true, 'firstName')

    wrapper
      .find('#lastName')
      .props()
      .setError(true)

    expect(wrapper).toHaveState({ errors: ['firstName', 'lastName'] })

    wrapper
      .find('#lastName')
      .props()
      .setError(false)

    expect(wrapper).toHaveState({ errors: ['firstName'] })

    wrapper
      .find('#documentNumber')
      .props()
      .setError(true)

    wrapper
      .find('#email')
      .props()
      .setError(true)

    wrapper
      .find('#phoneNumber')
      .props()
      .setError(true)

    wrapper
      .find('#gender')
      .props()
      .setError(true)

    wrapper
      .find('#documentType')
      .props()
      .setError(true)

    wrapper
      .find('#birthCountry')
      .props()
      .setError(true)

    wrapper
      .find('#countFamilyMembers')
      .props()
      .setError(true)

    wrapper
      .find('#countFamilyMembers')
      .props()
      .setError(true)

    wrapper
      .find('#birthDate')
      .props()
      .setError(true)

    expect(spy).toHaveBeenCalledTimes(12)
  })

  it('validates form on pressing continue', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onContinue')

    wrapper
      .find(StickyFooter)
      .props()
      .onContinue()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('prevents continue on form errors', () => {
    wrapper.setState({ errors: ['field'] })
    wrapper
      .find(StickyFooter)
      .props()
      .onContinue()

    expect(wrapper).toHaveState({ showErrors: true })
  })

  it('updates family members count', () => {
    wrapper.instance().addFamilyCount(2)
    expect(props.updateDraft).toHaveBeenCalledWith({
      ...resumedDraft,
      familyData: {
        ...resumedDraft.familyData,
        countFamilyMembers: 2,
        familyMembersList: [
          resumedDraft.familyData.familyMembersList[0],
          { firstParticipant: false }
        ]
      }
    })

    wrapper.instance().addFamilyCount(0)

    expect(props.updateDraft).toHaveBeenCalledWith({
      ...resumedDraft,
      familyData: {
        ...resumedDraft.familyData,
        countFamilyMembers: 0
      }
    })

    wrapper.instance().addFamilyCount(-1)
    expect(props.updateDraft).toHaveBeenCalledWith({
      ...resumedDraft,
      familyData: {
        ...resumedDraft.familyData,
        countFamilyMembers: -1
      }
    })
  })

  it('adds new family members', () => {
    props = createTestProps({
      drafts: [
        {
          ...resumedDraft,
          familyData: {
            ...resumedDraft.familyData,
            countFamilyMembers: 0
          }
        }
      ],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return false
          } else {
            return 1
          }
        })
      }
    })

    wrapper = shallow(<FamilyParticipant {...props} />)

    wrapper.instance().addFamilyCount(2)

    props = createTestProps({
      drafts: [
        {
          ...resumedDraft,
          familyData: {
            ...resumedDraft.familyData,
            countFamilyMembers: -1
          }
        }
      ],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return false
          } else {
            return 1
          }
        })
      }
    })

    wrapper = shallow(<FamilyParticipant {...props} />)

    wrapper.instance().addFamilyCount(1)

    expect(props.updateDraft).toHaveBeenCalledTimes(1)
  })

  it('continues to location screen if only 1 family member', () => {
    props = createTestProps({
      drafts: [
        {
          ...resumedDraft,
          familyData: { countFamilyMembers: 1, ...resumedDraft.familyData }
        }
      ],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return false
          } else {
            return 1
          }
        })
      }
    })

    wrapper = shallow(<FamilyParticipant {...props} />)
    wrapper.instance().onContinue()

    expect(props.navigation.navigate).toHaveBeenCalledWith('Location', {
      draftId: 1,
      survey
    })
  })
  it('continues to member details screen if only multiple family members', () => {
    props = createTestProps({
      drafts: [
        {
          ...resumedDraft,
          familyData: { ...resumedDraft.familyData, countFamilyMembers: 3 }
        }
      ],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return false
          } else {
            return 1
          }
        })
      }
    })

    wrapper = shallow(<FamilyParticipant {...props} />)
    wrapper.instance().onContinue()

    expect(props.navigation.navigate).toHaveBeenCalledWith(
      'FamilyMembersNames',
      {
        draftId: 1,
        survey
      }
    )
  })

  it('sets custom fequired fields when one is present in survey', () => {
    props = createTestProps({
      drafts: [resumedDraft],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return {
              ...survey,
              surveyConfig: {
                ...survey.surveyConfig,
                requiredFields: { primaryParticipant: ['firstName'] }
              }
            }
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return false
          } else {
            return 1
          }
        })
      }
    })
    wrapper = shallow(<FamilyParticipant {...props} />)

    expect(wrapper.find('#firstName')).toHaveProp({ required: true })
    expect(wrapper.find('#lastName')).toHaveProp({ required: false })
    expect(wrapper.find('#gender')).toHaveProp({ required: false })
  })
})

describe('readonly mode', () => {
  beforeEach(() => {
    props = createTestProps({
      drafts: [
        {
          ...resumedDraft,
          familyData: { ...resumedDraft.familyData, countFamilyMembers: null }
        }
      ],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return props.drafts[0]
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readonly') {
            return true
          } else {
            return 1
          }
        })
      }
    })
    wrapper = shallow(<FamilyParticipant {...props} />)
  })

  it('disables editing fields', () => {
    expect(wrapper.find(TextInput).first()).toHaveProp({ readonly: true })
  })

  it('does not update in readonly mode', () => {
    expect(wrapper.instance().updateParticipant()).toBeFalsy()
    expect(wrapper.instance().addFamilyCount()).toBeFalsy()
    expect(wrapper.instance().onContinue()).toBeFalsy()
  })
})
