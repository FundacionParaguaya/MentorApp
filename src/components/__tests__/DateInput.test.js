import { shallow } from 'enzyme'
import React from 'react'
import { Text } from 'react-native'

import { DateInputComponent } from '../form/DateInput'

const createTestProps = props => ({
  readOnly: true,
  initialValue: 52454354,
  onValidDate: jest.fn(),
  setError: jest.fn(),
  required: false,
  t: value => value,
  label: 'Some label',
  field: 'birthDate',
  showErrors: false,
  ...props
})

describe('DateInput Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<DateInputComponent {...props} />)
  })
  describe('rendering', () => {
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
  })
  describe('functionality', () => {
    it('has the correct label', () => {
      expect(
        wrapper
          .find(Text)
          .render()
          .text()
      ).toBe('Some label ')
    })

    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({
        date: '31 August 1971',
        error: false
      })
    })
  })

  describe('Date validation', () => {
    it('calls setError with first argument true if date is invalid', () => {
      wrapper.instance().validateDate()

      expect(wrapper.instance().props.setError).toHaveBeenCalledTimes(3)
    })

    it('calls setError with first argument false if date is valid', () => {
      props = createTestProps({ required: true, validation: 'string' })

      wrapper.setState({ date: '1 June 2019' })
    })

    it('calls validateDate on mount', () => {
      const spy = jest.spyOn(wrapper.instance(), 'validateDate')

      wrapper.setProps({ showErrors: true })
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
