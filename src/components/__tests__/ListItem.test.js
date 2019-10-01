import React from 'react'
import { shallow } from 'enzyme'
import ListItem from '../ListItem'
import { TouchableHighlight } from 'react-native'

const createTestProps = props => ({
  onPress: jest.fn(),
  disabled: false,
  ...props
})

let wrapper, props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<ListItem {...props} />)
})

it('renders with correct props', () => {
  expect(wrapper.find(TouchableHighlight)).toHaveLength(1)
})
