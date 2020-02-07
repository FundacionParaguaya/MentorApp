import { shallow } from 'enzyme'
import React from 'react'
import { Text } from 'react-native'
import { FormInput } from 'react-native-elements'

import TextInput from '../form/TextInput'

const createTestProps = props => ({
  onChangeText: jest.fn(),
  setError: jest.fn(),
  label: 'Some label',
  placeholder: 'Some label',
  value: '',
  id: 'phoneNumber',
  ...props
})

describe('TextInput Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<TextInput {...props} />)
  })
  describe('rendering', () => {
    it('renders FormInput', () => {
      expect(wrapper.find(FormInput)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders error message when there is an error', () => {
      expect(wrapper.find('#errorWrapper')).toHaveLength(0)
      wrapper.setState({ status: 'error', errorMsg: 'error' })
      expect(wrapper.find('#errorWrapper')).toHaveLength(1)
    })
  })
  describe('functionality', () => {
    it('has the correct label', () => {
      expect(
        wrapper
          .find(Text)
          .first()
          .render()
          .text()
      ).toBe('Some label')
    })

    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({
        text: '',
        status: 'blur',
        errorMsg: null,
        hasError: false
      })
    })

    it('changes text state when onChangeText is called', () => {
      wrapper
        .find(FormInput)
        .props()
        .onChangeText('Changed text')

      expect(wrapper.instance().state.text).toEqual('Changed text')
    })

    it('changes state to active when onFocus is called', () => {
      wrapper
        .find(FormInput)
        .props()
        .onFocus()

      expect(wrapper.instance().state.status).toEqual('active')
    })

    it('changes state to blur when onBlur is called', () => {
      wrapper.setState({ status: 'active' })
      wrapper
        .find(FormInput)
        .props()
        .onBlur()
      expect(wrapper.instance().state.status).toEqual('blur')
    })

    it('shows top label when input field is active', () => {
      props = createTestProps({
        label: '',
        status: 'filled',
        readonly: false
      })
      wrapper = shallow(<TextInput {...props} />)
      wrapper.setState({ text: '', status: 'filled' })
      expect(wrapper.find('#topLabel')).toHaveLength(1)
    })
  })
})
