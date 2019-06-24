import React from 'react'
import { shallow } from 'enzyme'
import { TouchableHighlight, Text } from 'react-native'
import Select from '../Select'
import ListItem from '../ListItem'
import BottomModal from '../BottomModal'

const createTestProps = props => ({
  onChange: jest.fn(),
  options: [],
  value: '',
  placeholder: 'This is a select',
  field: 'test',
  countrySelect: false,
  required: false,
  detectError: jest.fn(),
  ...props
})

describe('Select dropdown', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Select {...props} />)
  })
  it('has proper initial state', () => {
    expect(wrapper).toHaveState({
      isOpen: false,
      errorMsg: ''
    })
  })
  it('renders all necessary text fields', () => {
    expect(wrapper.find(Text)).toHaveLength(1)
  })

  it('opens a modal when pressed', () => {
    wrapper
      .find(TouchableHighlight)
      .first()
      .props()
      .onPress()

    expect(wrapper).toHaveState({ isOpen: true })
    expect(wrapper.find(BottomModal)).toHaveProp({ isOpen: true })
  })

  it('selects NONE if the last option is pressed', () => {
    const spy = jest.spyOn(wrapper.instance(), 'validateInput')
    wrapper
      .find(BottomModal)
      .props()
      .onEmptyClose()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('')
  })

  it('shows required error message when parent form is submitted', () => {
    props = createTestProps({ required: true, validation: 'string' })
    wrapper = shallow(<Select {...props} />)

    wrapper.setProps({ showErrors: true })

    expect(wrapper).toHaveState({ errorMsg: 'This field is required' })
  })
})
