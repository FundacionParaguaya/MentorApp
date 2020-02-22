import { shallow } from 'enzyme'
import React from 'react'

import BottomModal from '../BottomModal'
import DatePickerWheel from '../form/DatePickerWheel'

const years = Array.from({ length: 101 }, (v, i) => {
  let d = new Date()
  let value = d.getFullYear() - 101 + i + 1
  return { text: value, value }
}).reverse()

const months = [
  { text: 'January', value: 'January' },
  { text: 'February', value: 'February' },
  { text: 'May', value: 'May' }
]

const days = Array.from({ length: 31 }, (v, i) => ({
  text: i + 1,
  value: i + 1
}))

const createTestProps = props => ({
  onChange: jest.fn(),
  years,
  months,
  days,
  value: '',
  placeholder: 'Select date',
  readOnly: false,
  hasError: false,
  ...props
})

let wrapper, props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<DatePickerWheel {...props} />)
})
it('has proper initial state', () => {
  expect(wrapper).toHaveState({
    isOpen: false,
    day: '',
    month: '',
    year: ''
  })
})

it('renders placeholder', () => {
  expect(wrapper.find('#placeholder')).toHaveLength(1)
})

it('opens a modal when pressed', () => {
  wrapper
    .find('#datePicker')
    .props()
    .onPress()

  expect(wrapper).toHaveState({ isOpen: true })
  expect(wrapper.find(BottomModal)).toHaveProp({ isOpen: true })
})

it('sets correct date when pressed', () => {
  wrapper
    .find('#confirm')
    .props()
    .onPress()

  expect(props.onChange).toHaveBeenCalledTimes(1)
  expect(props.onChange).toHaveBeenCalledWith('1 January 2020')
  expect(wrapper.find(BottomModal)).toHaveProp({ isOpen: false })
})

it('can change the date', () => {
  wrapper
    .find('#dayWheel')
    .props()
    .onItemSelected({ position: 16, data: 17 })
  wrapper
    .find('#monthWheel')
    .props()
    .onItemSelected({ position: 4, data: 'May' })
  wrapper
    .find('#yearWheel')
    .props()
    .onItemSelected({ position: 3, data: 2016 })

  wrapper
    .find('#confirm')
    .props()
    .onPress()

  expect(props.onChange).toHaveBeenCalledWith('17 May 2016')
})
