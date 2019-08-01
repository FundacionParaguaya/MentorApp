import React from 'react'
import { shallow } from 'enzyme'
import { AddAchievement } from '../lifemap/AddAchievement'
import TextInput from '../../components/form/TextInput'
import StickyFooter from '../../components/StickyFooter'
import draft from '../__mocks__/draftMock.json'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    replace: jest.fn(),
    isFocused: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'indicator') {
        return 'income'
      }
      if (param === 'draft') {
        return draft
      }
      if (param === 'survey') {
        return {}
      }
    })
  },

  drafts: [
    {
      draftId: 2,
      surveyId: 1,
      achievements: [{ indicator: 'income' }]
    }
  ],
  ...props
})

describe('AddAchievement View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<AddAchievement {...props} />)
  })
  describe('rendering', () => {
    it('renders the continue button with proper label', () => {
      expect(wrapper.find(StickyFooter)).toHaveProp({
        continueLabel: 'general.save'
      })
    })

    it('shows errors if form is incorrect', () => {
      wrapper.instance().errorsDetected = ['country']

      wrapper
        .find(StickyFooter)
        .props()
        .handleClick()

      expect(wrapper).toHaveState({
        showErrors: true
      })
    })
  })

  describe('functionality', () => {
    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({
        errorsDetected: [],
        action: '',
        roadmap: '',
        showErrors: false,
        indicator: 'income',
        draft: expect.any(Object)
      })
    })

    it('records action to state', () => {
      wrapper
        .find(TextInput)
        .first()
        .props()
        .onChangeText('Some action')
      expect(wrapper.instance().state.action).toEqual('Some action')
    })

    it('records roadmap to state', () => {
      wrapper
        .find(TextInput)
        .last()
        .props()
        .onChangeText('Some roadmap')
      expect(wrapper.instance().state.roadmap).toEqual('Some roadmap')
    })
  })

  it('detects an error', () => {
    wrapper.instance().detectError(true, 'phoneNumber')
    wrapper.instance().detectError(true, 'months')
    expect(wrapper.instance().errorsDetected).toEqual(['phoneNumber', 'months'])

    wrapper.instance().detectError(false, 'phoneNumber')
    expect(wrapper.instance().errorsDetected).toEqual(['months'])
  })
})

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<AddAchievement {...props} />)
  })
  it('checks if screen is focused before updating', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    //It is called two times because we set state in componentDidMount, therefore it runs the componentShouldUpdate method twice
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      2
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
    wrapper = shallow(<AddAchievement {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
})
