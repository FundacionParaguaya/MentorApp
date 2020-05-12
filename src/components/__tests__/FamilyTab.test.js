import React from 'react'

import { shallow } from 'enzyme'
import { TouchableHighlight, Text } from 'react-native'
import FamilyTab from '../FamilyTab'

const createTestProps = props => ({
  ...props,
  onPress: jest.fn(),
  title: 'Some title'
})

describe('FamilyTab Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyTab {...props} />)
  })
  describe('rendering', () => {
    it('renders <TouchableHighlight />', () => {
      expect(wrapper.find(TouchableHighlight)).toHaveLength(1)
    })

    it('renders <Text />', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
      expect(wrapper.find(Text).props().children).toBe('Some title')
    })
  })
  describe('functionality', () => {
    it('should call handleClick onPress', () => {
      wrapper
        .find(TouchableHighlight)
        .props()
        .onPress()

      expect(wrapper.instance().props.onPress).toHaveBeenCalledTimes(1)
    })
  })
})
