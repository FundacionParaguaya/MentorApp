import { Text, TouchableHighlight } from 'react-native'

import BottomModal from '../BottomModal'
import React from 'react'
import Select from '../form/Select'
import { shallow } from 'enzyme'

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
})
