import React from 'react'
import { shallow } from 'enzyme'
import { Final } from '../lifemap/Final'
import Button from '../../components/Button'
import LifemapVisual from '../../components/LifemapVisual'
// import RNPrint from 'react-native-print'

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
  progress: { screen: 'Final', total: 5 },
  familyData: {
    countFamilyMembers: 3,
    familyMembersList: []
  }
}

const navigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  setParams: jest.fn(),
  isFocused: () => true,
  popToTop: jest.fn(),
  getParam: jest.fn(param => {
    if (param === 'draft') {
      return draft
    } else if (param === 'survey') {
      return survey
    }
  })
}

const createTestProps = props => ({
  t: value => value,
  user: { token: 'token' },
  env: 'env',
  submitDraft: jest.fn(),
  updateDraft: jest.fn(),
  navigation,
  ...props
})

let wrapper, props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<Final {...props} />)
})

it('receives proper survey from navigation', () => {
  expect(wrapper.instance().survey).toBe(survey)
})

it('receives proper draft from navigation', () => {
  expect(wrapper.instance().draft).toBe(draft)
})

it('navigates to Priorities on pressBack', () => {
  wrapper.instance().onPressBack()

  expect(props.navigation.replace).toHaveBeenCalledWith('Priorities', {
    resumeDraft: false,
    draftId,
    survey
  })
})

it('updates only when focused', () => {
  expect(wrapper.instance().shouldComponentUpdate()).toEqual(true)
})

it('renders Lifemap properly', () => {
  expect(wrapper.find(LifemapVisual)).toHaveLength(1)

  expect(wrapper.find(LifemapVisual)).toHaveProp({
    questions: draft.indicatorSurveyDataList
  })
  expect(wrapper.find(LifemapVisual)).toHaveProp({
    questionsLength: survey.surveyStoplightQuestions.length
  })
  expect(wrapper.find(LifemapVisual)).toHaveProp({
    priorities: draft.priorities
  })
  expect(wrapper.find(LifemapVisual)).toHaveProp({
    achievements: draft.achievements
  })
})

it('submits draft  when Button is clicked', () => {
  wrapper
    .find(Button)
    .last()
    .props()
    .handleClick()

  expect(wrapper.instance().props.submitDraft).toHaveBeenCalledTimes(1)
})
