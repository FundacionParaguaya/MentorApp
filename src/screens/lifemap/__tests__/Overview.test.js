import { Overview } from '../Overview'
import React from 'react'
import { shallow } from 'enzyme'

const survey = {
  id: 1,
  title: 'Dev Demo',
  surveyStoplightQuestions: [
    {
      questionText: 'Income Above the Poverty Line',
      codeName: 'income',
      dimension: 'Income and Employment',
      required: false,
      definition: 'Some definition',
      id: 1,
      stoplightColors: [
        {
          url: 'some.png',
          value: 3,
          description: 'My household’s yearly income is above $41,000.'
        },
        {
          url: 'some.png',
          value: 2,
          description:
            'My household’s yearly income is below $41,000 but over $21,000.'
        },
        {
          url: 'some.png',
          value: 1,
          description: 'My household’s yearly income is below $21,000.'
        }
      ]
    },
    {
      questionText: 'Access to education',
      codeName: 'education',
      dimension: 'Education',
      required: false,
      id: 2,
      stoplightColors: [
        {
          url: 'some.png',
          value: 3,
          description: 'This is the green one.'
        },
        {
          url: 'some.png',
          value: 2,
          description: 'This is the yellow one.'
        },
        {
          url: 'some.png',
          value: 1,
          description: 'This is the red one.'
        }
      ]
    }
  ],

  surveyEconomicQuestions: [],
  surveyConfig: {}
}

const draftId = 1

const draft = {
  draftId,
  progress: { screen: 'Question', step: 2, total: 5 },
  indicatorSurveyDataList: [],
  achievements: [],
  priorities: [],
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
  isFocused: jest.fn(() => true),
  navigate: jest.fn(),
  replace: jest.fn(),
  setParams: jest.fn(),
  getParam: jest.fn(param => {
    if (param === 'survey') {
      return survey
    } else if (param === 'draftId') {
      return draftId
    }
  })
}

const createTestProps = props => ({
  drafts: [draft, { draftId: 2 }],
  t: value => value,
  dimensions: {
    height: 740,
    scale: 2,
    width: 360
  },
  updateDraft: jest.fn(),
  navigation,
  ...props
})

let wrapper
let props

const resumedDraft = {
  draftId: 1,
  progress: { screen: 'Question', step: 2, total: 5 },
  indicatorSurveyDataList: [],
  survey: survey,
  achievements: [],
  priorities: [],
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

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<Overview {...props} />)
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

it('updates only when focused', () => {
  expect(wrapper.instance().shouldComponentUpdate()).toEqual(true)
})

describe('resuming a draft', () => {
  beforeEach(() => {
    props = createTestProps({
      drafts: [resumedDraft],

      navigation: {
        replace: jest.fn(),
        navigate: jest.fn(),
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
          } else if (param === 'resumeDraft') {
            return true
          } else {
            return 1
          }
        })
      }
    })
    wrapper = shallow(<Overview {...props} />)
  })

  it('get correct draft from redux after resuming', () => {
    expect(wrapper.instance().getDraft()).toBe(resumedDraft)
  })

  it('get the resume button if we resume the draft', () => {
    expect(wrapper.find('#resume-draft')).toHaveLength(1)
  })

  it('clicking on the button continues the draft', () => {
    wrapper.instance().resumeDraft()

    expect(props.navigation.replace).toHaveBeenCalledWith(
      resumedDraft.progress.screen,
      {
        draftId: resumedDraft.draftId,
        survey: resumedDraft.survey,
        step: resumedDraft.progress.step
      }
    )
  })
})

describe('readonly mode', () => {
  beforeEach(() => {
    props = createTestProps({
      drafts: [resumedDraft],
      readOnly: true,
      familyLifemap: resumedDraft,
      navigation: {
        isFocused: jest.fn(),
        replace: jest.fn(),
        navigate: jest.fn(),
        setParams: jest.fn(),
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readonly') {
            return true
          } else if (param === 'resumeDraft') {
            return true
          } else if (param === 'familyLifemap') {
            return resumedDraft
          } else {
            return 1
          }
        })
      }
    })
    wrapper = shallow(<Overview {...props} />)
  })
  it('expect the filer to be visible', () => {
    expect(wrapper.find('#filters')).toHaveLength(1)
  })
  it('expect to pass data to lifemapOverview', () => {
    expect(wrapper.find('#lifeMapOverview')).toHaveProp({
      draftData: resumedDraft
    })
  })

  it('expect select correct filter', () => {
    wrapper.instance().selectFilter(false, 'RED')
    expect(wrapper.state().selectedFilter).toBe(false)
    expect(wrapper.state().filterLabel).toBe('RED')
  })

  it('expect to navigate to the corrrect question', () => {
    wrapper.instance().navigateToScreen(resumedDraft.progress.screen, 1, 'Text')

    expect(props.navigation.navigate).toHaveBeenCalledWith(
      resumedDraft.progress.screen,
      {
        draftId: resumedDraft.draftId,
        indicatorText: 'Text',
        indicator: 1,
        survey: resumedDraft.survey
      }
    )
  })
})
