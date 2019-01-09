import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import { Overview } from '../lifemap/Overview'
import Button from '../../components/Button'
import Tip from '../../components/Tip'
import LifemapVisual from '../../components/LifemapVisual'
import LifemapOverview from '../../components/LifemapOverview'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    isFocused: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'draftId') {
        return 1
      }
      if (param === 'survey') {
        return {
          id: 2,
          title: 'Other survey',
          minimumPriorities: 5,
          surveyStoplightQuestions: [
            { phoneNumber: 'phoneNumber' },
            { education: 'education' },
            { c: 'c' }
          ]
        }
      }
    })
  },
  drafts: [
    {
      draftId: 1,
      priorities: [{ action: 'Some action' }],
      indicatorSurveyDataList: [
        { key: 'phoneNumber', value: 3 },
        { key: 'education', value: 1 },
        { key: 'ind', value: 1 },
        { key: 'Other ind', value: 2 }
      ]
    }
  ],

  ...props
})

describe('Overview Lifemap View when no questions are skipped', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<Overview {...props} />)
  })
  describe('rendering', () => {
    it('renders ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders LifemapVisual', () => {
      expect(wrapper.find(LifemapVisual)).toHaveLength(1)
    })
    it('renders LifemapOverview', () => {
      expect(wrapper.find(LifemapOverview)).toHaveLength(1)
    })
    it('renders Button', () => {
      expect(wrapper.find(Button)).toHaveLength(1)
    })
    it('renders Tip', () => {
      expect(wrapper.find(Tip)).toHaveLength(1)
    })
    it('does not render Tip when no priorities can be added (all indicators are green)', () => {
      const props = createTestProps({
        drafts: [
          {
            draftId: 1,
            priorities: [{ action: 'Some action' }],
            indicatorSurveyDataList: [{ key: 'phoneNumber', value: 3 }]
          }
        ]
      })
      wrapper = shallow(<Overview {...props} />)
      expect(wrapper.find(Tip)).toHaveLength(0)
    })
  })

  describe('functionality', () => {
    it('calls handleClick function when Button is clicked', () => {
      wrapper
        .find(Button)
        .props()
        .handleClick()
      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
    })

    it('button is enabled when enough priorities', () => {
      const props = createTestProps({
        drafts: [
          {
            draftId: 1,
            priorities: [{ action: 'Some action' }],
            indicatorSurveyDataList: [
              { key: 'phoneNumber', value: 3 },
              { key: 'education', value: 1 }
            ]
          }
        ]
      })
      wrapper = shallow(<Overview {...props} />)
      expect(wrapper.find(Button).props().disabled).toBe(false)
    })
    it('button is disabled when not enough priorities', () => {
      expect(wrapper.find(Button).props().disabled).toBe(true)
    })
    it('passes the correct survey data to lifemap overview', () => {
      expect(wrapper.find(LifemapOverview).props().surveyData).toEqual([
        { phoneNumber: 'phoneNumber' },
        { education: 'education' },
        { c: 'c' }
      ])
    })
    it('passes the correct draft data to lifemap overview', () => {
      expect(wrapper.find(LifemapOverview).props().draftData).toEqual({
        draftId: 1,
        priorities: [{ action: 'Some action' }],
        indicatorSurveyDataList: [
          { key: 'phoneNumber', value: 3 },
          { key: 'education', value: 1 },
          { key: 'ind', value: 1 },
          { key: 'Other ind', value: 2 }
        ]
      })
    })
  })
})

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Overview {...props} />)
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
    wrapper = shallow(<Overview {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
})
