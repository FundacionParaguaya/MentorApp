import React from 'react'
import { Skipped } from '../Skipped'
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

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<Skipped {...props} />)
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
