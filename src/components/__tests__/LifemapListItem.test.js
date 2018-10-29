import React from 'react'

import { shallow } from 'enzyme'
import { TouchableOpacity, Text, View, Image } from 'react-native'

import LifemapListItem from '../LifemapListItem'

const createTestProps = props => ({
  handleClick: jest.fn(),
  name: 'Survey title',
  ...props
})

describe('LifemapListItem Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<LifemapListItem {...props} />)
  })

  describe('rendering', () => {
    it('renders <TouchableOpacity />', () => {
      expect(wrapper.find(TouchableOpacity)).toHaveLength(1)
    })
    it('renders <View />', () => {
      expect(wrapper.find(View)).toHaveLength(1)
    })
    it('renders <Text />', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
    it('renders <Image />', () => {
      expect(wrapper.find(Image)).toHaveLength(1)
    })

    it('renders the correct name in Text component', () => {
      expect(
        wrapper
          .find(Text)
          .first()
          .props().children
      ).toEqual('Survey title')
    })
  })
  describe('functionality', () => {
    it('should call handleClick onPress', () => {
      wrapper
        .find(TouchableOpacity)
        .props()
        .onPress()
      expect(wrapper.instance().props.handleClick).toHaveBeenCalledTimes(1)
    })
  })
})
