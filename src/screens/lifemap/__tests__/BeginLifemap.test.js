import { BeginLifemap } from '../BeginLifemap'
import React from 'react'
import { shallow } from 'enzyme'

const survey = {
  id: 1,
  title: 'Dev Demo',
  surveyStoplightQuestions: [
    {
      questionText: 'Question 1',
      codeName: 'income1'
    },
    {
      questionText: 'Question 2',
      codeName: 'income2'
    },
    {
      questionText: 'Question 3',
      codeName: 'income3'
    },
    {
      questionText: 'Question 4',
      codeName: 'income4'
    }
  ],
  surveyEconomicQuestions: [],
  surveyConfig: {}
}

const draftId = 1

const draft = {
  draftId,
  progress: { screen: 'FamilyParticipant', total: 5 },
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

const createTestProps = props => ({
  drafts: [draft, { draftId: 2 }],
  t: value => value,
  updateDraft: jest.fn(),
  navigation: {
    navigate: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'survey') {
        return survey
      } else if (param === 'draftId') {
        return draftId
      }
    })
  },
  ...props
})

let wrapper
let props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<BeginLifemap {...props} />)
})

it('receives proper survey from navigation', () => {
  expect(wrapper.instance().survey).toBe(survey)
})

it('receives proper draftId from navigation', () => {
  expect(wrapper.instance().draftId).toBe(draftId)
})

it('gets proper draft from draftId', () => {
  expect(wrapper.instance().draft).toBe(draft)
})

it('navigates to first Question on continue ', () => {
  wrapper.instance().onContinue()
  expect(props.navigation.navigate).toHaveBeenCalledWith('Question', {
    step: 0,
    survey,
    draftId
  })
})

it('navigates back to proper Location when no socio economic questions in survey', () => {
  wrapper.instance().onPressBack()

  expect(props.navigation.navigate).toHaveBeenCalledWith('Location', {
    fromBeginLifemap: true,
    survey,
    draftId
  })
})

it('navigates back to last socio economic screen when it exists in survey', () => {
  const surveyWithEconomics = {
    ...survey,
    surveyEconomicQuestions: [{ codeName: 'income' }]
  }

  props = createTestProps({
    drafts: [
      {
        ...draft,
        progress: { ...draft.progress, screen: 'BeginLifemap' },
        familyData: { ...draft.familyData, countFamilyMembers: 2 }
      }
    ],
    navigation: {
      navigate: jest.fn(),
      setParams: jest.fn(),
      getParam: jest.fn(param => {
        if (param === 'survey') {
          return surveyWithEconomics
        } else if (param === 'draftId') {
          return draftId
        }
      })
    }
  })

  wrapper = shallow(<BeginLifemap {...props} />)

  wrapper.instance().onPressBack()

  expect(props.navigation.navigate).toHaveBeenCalledWith(
    'SocioEconomicQuestion',
    {
      fromBeginLifemap: true,
      survey: surveyWithEconomics,
      draftId
    }
  )
})
