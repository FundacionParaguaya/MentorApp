import React from 'react'
import { shallow } from 'enzyme'
import { TouchableOpacity } from 'react-native'
import { CheckBox } from 'react-native-elements'
import Checkbox from '../Checkbox'

const createTestProps = props => ({
  ...props,
  onIconPress: jest.fn(),
  title: 'Some checkbox text'
})

describe('Checkbox Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Checkbox {...props} />)
  })
  describe('rendering', () => {
    it('renders CheckBox', () => {
      expect(wrapper.find(CheckBox)).toHaveLength(1)
    })
  })
  describe('functionality', () => {
    it('has the correct title', () => {
      expect(wrapper.find(CheckBox).props().title).toBe('Some checkbox text')
    })

    it('calls onPress when icon is pressed', () => {
      wrapper
        .find(TouchableOpacity)
        .props()
        .onPress()

      expect(wrapper.instance().props.onIconPress).toHaveBeenCalledTimes(1)
    })
  })
})
