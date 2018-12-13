import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, Text } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { AddPriority } from '../lifemap/AddPriority'
import TextInput from '../../components/TextInput'
import Button from '../../components/Button'
import Counter from '../../components/Counter'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    isFocused: jest.fn(),
    getParam: jest.fn(param => (param === 'indicator' ? 'income' : 2))
  },
  addSurveyPriorityAcheivementData: jest.fn(),
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
    it('renders ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders Icon', () => {
      expect(wrapper.find(Icon)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders Counter', () => {
      expect(wrapper.find(Counter)).toHaveLength(1)
    })
    it('renders Button', () => {
      expect(wrapper.find(Button)).toHaveLength(1)
    })
  })

  describe('functionality', () => {
    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({
        reason: '',
        action: '',
        indicator: 'income',
        estimatedDate: 0
      })
    })
    it('increases count correctly', () => {
      wrapper
        .find(Counter)
        .props()
        .editCounter('plus')
      expect(wrapper.instance().state.estimatedDate).toEqual(1)
    })
    it('decreases count correctly', () => {
      wrapper.setState({ estimatedDate: 5 })
      wrapper
        .find(Counter)
        .props()
        .editCounter('minus')
      expect(wrapper.instance().state.estimatedDate).toEqual(4)
    })
    it('does not decrease estimatedDate when it is already 0', () => {
      wrapper
        .find(Counter)
        .props()
        .editCounter('minus')
      expect(wrapper.instance().state.estimatedDate).toEqual(0)
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
    it('saves the priority', () => {
      wrapper
        .find(Button)
        .props()
        .handleClick()

      expect(
        wrapper.instance().props.addSurveyPriorityAcheivementData
      ).toHaveBeenCalledTimes(1)
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
