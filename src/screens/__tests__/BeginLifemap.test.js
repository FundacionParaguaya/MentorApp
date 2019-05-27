import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import { BeginLifemap } from '../lifemap/BeginLifemap'
import RoundImage from '../../components/RoundImage'
import StickyFooter from '../../components/StickyFooter'
import draft from '../__mocks__/draftMock.json'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    replace: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'family') {
        return null
      } else if (param === 'survey') {
        return {
          surveyEconomicQuestions: [],
          id: 2,
          title: 'Other survey',
          surveyStoplightQuestions: [{ a: 'a' }, { b: 'b' }, { c: 'c' }]
        }
      } else if (param === 'draft') {
        return draft
      }
    })
  },
  drafts: [draft],
  addDraftProgress: jest.fn(),
  ...props
})

describe('BeginLifemap View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<BeginLifemap {...props} />)
  })
  describe('rendering', () => {
    it('renders StickyFooter', () => {
      expect(wrapper.find(StickyFooter)).toHaveLength(1)
    })
    it('renders RoundImage', () => {
      expect(wrapper.find(RoundImage)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
  })

  describe('functionality', () => {
    it('calls setParam on mount', () => {
      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledTimes(2)
    })
    it('calls addDraftProgress on mount', () => {
      expect(wrapper.instance().props.addDraftProgress).toHaveBeenCalledTimes(1)
    })
    it('calls onPressBack', () => {
      const spy = jest.spyOn(wrapper.instance(), 'onPressBack')

      wrapper.instance().onPressBack()
      expect(spy).toHaveBeenCalledTimes(1)
    })
    it('navigates to first indicator question on pressing continue', () => {
      wrapper.instance().handleClick()
      expect(props.navigation.navigate).toHaveBeenCalledWith(
        'Question',
        expect.any(Object)
      )
    })
  })
})
