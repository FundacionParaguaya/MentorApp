import React from 'react'
import { shallow } from 'enzyme'
import { Image, FlatList } from 'react-native'
import { Skipped } from '../lifemap/Skipped'
import Tip from '../../components/Tip'
import StickyFooter from '../../components/StickyFooter'

const createTestProps = props => ({
  t: value => value,
  addDraftProgress: jest.fn(),
  navigation: {
    navigate: jest.fn(),
    isFocused: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'draftId') {
        return 1
      }
      if (param === 'survey') {
        return {
          id: 2,
          title: 'Other survey',
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
      indicatorSurveyDataList: [
        { key: 'phoneNumber', value: 0 },
        { key: 'education', value: 3 }
      ]
    }
  ],
  ...props
})

describe('Skipped Questions View when questions are skipped', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Skipped {...props} />)
  })
  describe('rendering', () => {
    it('renders the continue button with proper label', () => {
      expect(wrapper.find(StickyFooter)).toHaveProp({
        continueLabel: 'general.continue'
      })
    })
    it('renders Image', () => {
      expect(wrapper.find(Image)).toHaveLength(1)
    })

    it('rendersFlatList', () => {
      expect(wrapper.find(FlatList)).toHaveLength(1)
    })
    it('renders Tip', () => {
      expect(wrapper.find(Tip)).toHaveLength(1)
    })
  })
  describe('functionality', () => {
    it('calls navigator function on pressing Continue button', () => {
      wrapper
        .find(StickyFooter)
        .props()
        .handleClick()
      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
    })
    it('passess the correct data to FlatList', () => {
      expect(wrapper.find(FlatList).props().data).toEqual([
        { key: 'phoneNumber', value: 0 }
      ])
    })
    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({ tipIsVisible: true })
    })
    it('changes tipVisible state when tip is closed', () => {
      wrapper
        .find(Tip)
        .props()
        .onTipClose()
      expect(wrapper.instance().state.tipIsVisible).toBe(false)
    })
  })
  describe('Render optimization', () => {
    it('checks if screen is focused before updating', () => {
      wrapper.setProps({
        drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
      })
      expect(
        wrapper.instance().props.navigation.isFocused
      ).toHaveBeenCalledTimes(1)
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
      wrapper = shallow(<Skipped {...props} />)
      expect(wrapper.instance().props.drafts[1]).toBeFalsy()
    })
    it('calls setParam on mount', () => {
      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledTimes(1)
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
})
