import { Priorities } from '../Priorities'
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
  priorities: [],
  achievements: [],
  indicatorSurveyDataList: [],
  progress: { screen: 'FamilyParticipant', total: 5 },
  familyData: {
    countFamilyMembers: 1,
    familyMembersList: []
  }
}

const createTestProps = props => ({
  drafts: [draft, { draftId: 2 }],
  t: value => value,
  updateDraft: jest.fn(),
  navigation: {
    isFocused: () => true,
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
  wrapper = shallow(<Priorities {...props} />)
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
      drafts: [draft],

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
    wrapper = shallow(<Priorities {...props} />)
  })

  it('get correct draft from redux after resuming', () => {
    expect(wrapper.instance().getDraft()).toBe(draft)
  })
})

describe('check if component render properly', () => {
  beforeEach(() => {
    props = createTestProps({
      drafts: [draft],
      readOnly: true,
      familyLifemap: draft,
      navigation: {
        isFocused: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
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
            return draft
          } else {
            return 1
          }
        })
      }
    })
    wrapper = shallow(<Priorities {...props} />)
  })

  it('expect to pass data to lifemapOverview', () => {
    expect(wrapper.find('#lifeMapOverview')).toHaveProp({
      draftData: draft
    })
  })

  it('expect select correct filter', () => {
    wrapper.instance().selectFilter(false, 'RED')
    expect(wrapper.state().selectedFilter).toBe(false)
    expect(wrapper.state().filterLabel).toBe('RED')
  })
})
