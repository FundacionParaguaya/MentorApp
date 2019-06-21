import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, Text } from 'react-native'
import { Final } from '../lifemap/Final'
import RoundImage from '../../components/RoundImage'
import Button from '../../components/Button'
import LifemapVisual from '../../components/LifemapVisual'
import draft from '../__mocks__/draftMock.json'

const createTestProps = props => ({
  t: value => value,
  user: { token: 'token' },
  env: 'env',
  submitDraft: jest.fn(),
  updateDraft: jest.fn(),
  
  navigation: {
    navigate: jest.fn(),
    replace: jest.fn(),
    setParams: jest.fn(),
    isFocused: jest.fn(),
    popToTop: jest.fn(),
    reset: jest.fn(),

    getParam: jest.fn(param => {
      if (param === 'draft') {
        return draft
      } else if (param === 'survey') {
        return { surveyStoplightQuestions: [] }
      }
    })
  },
  ...props
})

describe('Final Lifemap View when no questions are skipped', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps({
      drafts: [
        {
          draftId: 1,
          achievements: [],
          priorities: [],
          indicatorSurveyDataList: [
            { key: 'phoneNumber', value: 3 },
            { key: 'education', value: 1 }
          ]
        }
      ]
    })
    wrapper = shallow(<Final {...props} />)
  })
  describe('rendering', () => {
    it('renders ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders RoundImage', () => {
      expect(wrapper.find(RoundImage)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders LifemapVisual', () => {
      expect(wrapper.find(LifemapVisual)).toHaveLength(1)
    })
    it('renders Button', () => {
      expect(wrapper.find(Button)).toHaveLength(1)
    })
  })

  describe('functionality', () => {
    it('calls handleClick function when Button is clicked', () => {
      wrapper
        .find(Button)
        .props()
        .handleClick()
      expect(
        wrapper.instance().props.navigation.popToTop
      ).toHaveBeenCalledTimes(1)
    })
  })
  it('calls setParam on mount', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      1
    )
  })
  it('calls onPressBack', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onPressBack')

    wrapper.instance().onPressBack()
    expect(spy).toHaveBeenCalledTimes(1)
  })
  it('submits draft  when Button is clicked', () => {
    wrapper
      .find(Button)
      .props()
      .handleClick()

    expect(wrapper.instance().props.submitDraft).toHaveBeenCalledTimes(1)
  })
})
