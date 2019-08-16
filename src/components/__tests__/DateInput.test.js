import { DateInputComponent } from '../form/DateInput'
import React from 'react'
import { Text } from 'react-native'
import { shallow } from 'enzyme'

const createTestProps = props => ({
  readonly: true,
  onValidDate: jest.fn(),
  setError: jest.fn(),
  required: false,
  t: value => value,
  label: 'Some label',
  field: 'birthDate',
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
    it('renders Text when there is an error', () => {
      wrapper.setState({ error: true })
      expect(wrapper.find(Text)).toHaveLength(2)
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
        date: '',
        error: false
      })
    })
  })

  describe('Date validation', () => {
    it('calls setError with first argument true if date is invalid', () => {
      wrapper.instance().validateDate()

      expect(wrapper.instance().props.setError).toHaveBeenCalledTimes(1)
    })

    it('calls setError with first argument false if date is valid', () => {
      props = createTestProps({ required: true, validation: 'string' })

      wrapper.setState({ date: '1 June 2019' })
    })
  })
})
