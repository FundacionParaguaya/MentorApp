import IconButton from '../../../components/IconButton'
import Popup from '../../../components/Popup'
import { Question } from '../Question'
import React from 'react'
import SliderComponent from '../../../components/Slider'
import { Text } from 'react-native'
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

const navigation = {
  isFocused: jest.fn(() => true),
  navigate: jest.fn(),
  setParams: jest.fn(),
  getParam: jest.fn(param => {
    if (param === 'survey') {
      return survey
    } else if (param === 'step') {
      return 0
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
  wrapper = shallow(<Question {...props} />)
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

it('sets draft navigation when navigation from a different page', () => {
  expect(props.updateDraft).toHaveBeenCalledWith({
    ...draft,
    progress: {
      ...draft.progress,
      step: 0,
      screen: 'Question'
    }
  })
})

it('shows 3 possible answers to each indicator question', () => {
  expect(wrapper.find(SliderComponent)).toHaveProp({
    slides: survey.surveyStoplightQuestions[0].stoplightColors
  })
})

it('shows skip question button', () => {
  expect(wrapper.find(IconButton)).toHaveLength(1)
})

it('hides skip question button when question is mandatory', () => {
  props = createTestProps({
    navigation: {
      ...navigation,
      getParam: jest.fn(param => {
        if (param === 'survey') {
          return {
            ...survey,
            surveyStoplightQuestions: [
              { ...survey.surveyStoplightQuestions[0], required: true }
            ]
          }
        } else if (param === 'step') {
          return 0
        } else if (param === 'draftId') {
          return draftId
        }
      })
    }
  })

  wrapper = shallow(<Question {...props} />)

  expect(wrapper.find(IconButton)).toHaveLength(0)
  expect(wrapper.find(Text).last()).toHaveHTML(
    '<react-native-mock>views.lifemap.responseRequired</react-native-mock>'
  )
})

it('shows question definition popup when prompted', () => {
  expect(wrapper).toHaveState({ showDefinition: false })
  expect(wrapper.find(Popup)).toHaveLength(0)

  wrapper
    .find('#show-definition')
    .props()
    .onPress()

  expect(wrapper).toHaveState({ showDefinition: true })

  expect(wrapper.find(Popup)).toHaveLength(1)
  expect(wrapper.find('#definition')).toHaveHTML(
    `<react-native-mock>${survey.surveyStoplightQuestions[0].definition}</react-native-mock>`
  )
})

it('updates draft on selecting a question', () => {})

it('updates draft on skipping a question', () => {})

it('navigates to next question on selecting or skipping a question', () => {})

it('navigates to skipped questions screen upon answering last question when there are such', () => {})

it('navigates to overview upon answering last question when there are no skipped questions', () => {})

it('navigates back to a different question', () => {})

it('navigates back to begin lifemap when on first question', () => {})

it('shows the answer to a previously answered questio', () => {})
