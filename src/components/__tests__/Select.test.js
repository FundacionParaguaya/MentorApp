import React from 'react'
import { shallow } from 'enzyme'
import { TouchableOpacity, Text, Modal } from 'react-native'
import Select from '../Select'

const createTestProps = props => ({
  onChange: jest.fn(),
  options: [],
  value: '',
  placeholder: 'This is a select',
  field: 'test',
  countrySelect: true,
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
    expect(wrapper.find(Text)).toHaveLength(5)
  })

  it('opens a modal when pressed', () => {
    wrapper
      .find(TouchableOpacity)
      .first()
      .props()
      .onPress()

    expect(wrapper).toHaveState({ isOpen: true })
    expect(
      wrapper
        .find(Modal)
        .last()
        .find(TouchableOpacity)
    ).toHaveLength(5)
  })

  it('selects an option when one is pressed', () => {
    const spy = jest.spyOn(wrapper.instance(), 'validateInput')
    wrapper
      .find(TouchableOpacity)
      .first()
      .props()
      .onPress()

    wrapper
      .find(Modal)
      .last()
      .find(TouchableOpacity)
      .at(3)
      .props()
      .onPress()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('us')
  })
  it('selects NONE if the last option is pressed', () => {
    const spy = jest.spyOn(wrapper.instance(), 'validateInput')
    wrapper
      .find(TouchableOpacity)
      .first()
      .props()
      .onPress()

    wrapper
      .find(Modal)
      .last()
      .find(TouchableOpacity)
      .last()
      .props()
      .onPress()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('NONE')
  })
  it('render a list of items when passed options', () => {
    props = createTestProps({
      value: '2',
      options: [{ value: 1, text: '1' }, { value: 2, text: '2' }],
      countrySelect: false
    })
    wrapper = shallow(<Select {...props} />)
    const spy = jest.spyOn(wrapper.instance(), 'validateInput')

    wrapper
      .find(TouchableOpacity)
      .first()
      .props()
      .onPress()

    expect(
      wrapper
        .find(Modal)
        .last()
        .find(TouchableOpacity)
    ).toHaveLength(3)

    wrapper
      .find(Modal)
      .last()
      .find(TouchableOpacity)
      .last()
      .props()
      .onPress()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(2)
  })

  it('shows required error message when parent form is submitted', () => {
    props = createTestProps({ required: true, validation: 'string' })
    wrapper = shallow(<Select {...props} />)

    wrapper.setProps({ showErrors: true })

    expect(wrapper).toHaveState({ errorMsg: 'This field is required' })
  })
})
