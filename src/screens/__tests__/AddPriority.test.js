import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import StickyFooter from '../../components/StickyFooter'
import { AddPriority } from '../lifemap/AddPriority'
import TextInput from '../../components/form/TextInput'
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
      priorities: []
    }
  ],
  ...props
})

describe('AddPriority View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<AddPriority {...props} />)
  })
  describe('rendering', () => {
    it('renders the continue button with proper label', () => {
      expect(wrapper.find(StickyFooter)).toHaveProp({
        continueLabel: 'general.save'
      })
    })
    it('renders Icon', () => {
      expect(wrapper.find(Icon)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
  })

  describe('functionality', () => {
    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({
        action: '',
        estimatedDate: null,
        indicator: 'income',
        reason: '',
        errorsDetected: [],
        validationError: false,
        showErrors: false,
        draft: expect.any(Object)
      })
    })
    it('gets reason value', () => {
      wrapper
        .find(TextInput)
        .first()
        .props()
        .onChangeText('Some reason')
      expect(wrapper.instance().state.reason).toEqual('Some reason')
    })
    it('gets action value', () => {
      wrapper
        .find(TextInput)
        .last()
        .props()
        .onChangeText('Some action')
      expect(wrapper.instance().state.action).toEqual('Some action')
    })
  })
})

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<AddPriority {...props} />)
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
    wrapper = shallow(<AddPriority {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
})
