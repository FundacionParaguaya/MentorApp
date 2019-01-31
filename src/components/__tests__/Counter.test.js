import React from 'react'
import { shallow } from 'enzyme'
import { TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Counter from '../Counter'

const createTestProps = props => ({
  ...props,
  editCounter: jest.fn(),
  count: 3,
  text: 'Some checkbox text'
})

describe('Counter Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Counter {...props} />)
  })
  describe('rendering', () => {
    it('renders TouchableOpacity', () => {
      expect(wrapper.find(TouchableOpacity)).toHaveLength(2)
    })
    it('renders Icon', () => {
      expect(wrapper.find(Icon)).toHaveLength(2)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
  })
  describe('functionality', () => {
    it('clicking first button calls edit counter with arg "minus"', () => {
      wrapper
        .find(TouchableOpacity)
        .first()
        .props()
        .onPress()
      expect(wrapper.instance().props.editCounter).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().props.editCounter).toHaveBeenCalledWith('minus')
    })

    it('clicking second button calls edit counter with arg "plus"', () => {
      wrapper
        .find(TouchableOpacity)
        .last()
        .props()
        .onPress()
      expect(wrapper.instance().props.editCounter).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().props.editCounter).toHaveBeenCalledWith('plus')
    })
    it('disables editCounter  when readonly prop is true', () => {
      props = createTestProps({ readonly: true })
      wrapper = shallow(<Counter {...props} />)

      expect(
        wrapper
          .find(TouchableOpacity)
          .first()
          .props().disabled
      ).toBe(true)

      expect(
        wrapper
          .find(TouchableOpacity)
          .last()
          .props().disabled
      ).toBe(true)
    })
  })
})
