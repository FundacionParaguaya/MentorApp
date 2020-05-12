import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import LifemapListItem from '../LifemapListItem'
import ListItem from '../ListItem'

const createTestProps = props => ({
  name: 'Chile - Geco',
  handleClick: jest.fn(),
  ...props
})

let wrapper, props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<LifemapListItem {...props} />)
})

it('renders the list item', () => {
  expect(wrapper.find(ListItem)).toHaveLength(1)
})

it('sets the correct survey name', () => {
  expect(wrapper.find(Text)).toHaveHTML(
    '<react-native-mock>Chile - Geco</react-native-mock>'
  )
})

it('triggers handleClick function when press on the list item', () => {
  const listItem = wrapper.find(ListItem)
  listItem.props().onPress()
  expect(props.handleClick).toHaveBeenCalledTimes(1)
})
