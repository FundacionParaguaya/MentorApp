import React from 'react'
import { shallow } from 'enzyme'
import {
  Text,
  ProgressBarAndroid,
  TouchableHighlight
} from 'react-native'
import { Question } from '../lifemap/Question'
import SliderComponent from '../../components/Slider'
import IconButton from '../../components/IconButton'
import StickyFooter from '../../components/StickyFooter'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    setParams: jest.fn(),
    isFocused: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'survey') {
        return survey
      } else if (param === 'step') {
        return 0
      } else if (param === 'draftId') {
        return 1
      }
    }),
    state: { params: { headerHeight: 100  } }
  },
  dimensions: { height: 100 },
  addSurveyData: jest.fn(),
  addDraftProgress: jest.fn(),
  deleteSurveyPriorityAcheivementData: jest.fn(),
  drafts: [
    {
      draftId: 1,
      indicatorSurveyDataList: [
        { key: 'phoneNumber', value: 3 },
        { key: 'education', value: 1 }
      ],
      progress: { "screen": "Question" , "current": 3}      
    }
  ],
  ...props
})

describe('Question View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<Question {...props} />)
    survey.surveyStoplightQuestions[0].required = false
  })
  describe('rendering', () => {
    it('renders StickyFooter', () => {
      expect(wrapper.find(StickyFooter)).toHaveLength(1)
    })

    it('renders Slider', () => {
      expect(wrapper.find(SliderComponent)).toHaveLength(1)
    })
  })

  describe('functionality', () => {
    it('calls selectAnswer when slide is clicked', () => {
      const spy = jest.spyOn(wrapper.instance(), 'selectAnswer')
      wrapper
        .find(SliderComponent)
        .props()
        .selectAnswer()

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('calls selectAnswer with argument 0 when link is clicked', () => {
      const spy = jest.spyOn(wrapper.instance(), 'selectAnswer')
      wrapper
        .find(IconButton)
        .props()
        .onPress()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(0)
    })
    it('renders IconButton when indicator is not required', () => {
      expect(wrapper.find(IconButton)).toHaveLength(1)
    })
    it('renders Text when indicator is required', () => {
      survey.surveyStoplightQuestions[0].required = true
      const props = createTestProps()
      wrapper = shallow(<Question {...props} />)
      expect(wrapper.find(TouchableHighlight)).toHaveLength(0)
    })
  })
})
const survey = {
  id: 1,
  title: 'Test survey 1',
  surveyStoplightQuestions: [
    {
      stoplightColors: [{ codeName: 'phoneNumber' }],
      required: false,
      dimension: 'Dimension'
    }
  ]
}

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Question {...props} />)
  })
  it('checks if screen is focused before updating', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      1
    )
  })
  it('updates screen if focused', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    expect(wrapper.instance().props.drafts[1]).toEqual({ draftId: 5 })
  })
  it('does not update screen if not focused', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    props = createTestProps({
      navigation: { ...props.navigation, isFocused: jest.fn(() => false) }
    })
    wrapper = shallow(<Question {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
  it('calls setParam on mount', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      1
    )
  })
  it('calls addDraftProgress on mount', () => {
    expect(wrapper.instance().props.addDraftProgress).toHaveBeenCalledTimes(1)
  })
  it('calls onPressBack', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onPressBack')

    wrapper.instance().onPressBack()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
