import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import colors from '../../theme.json'
import FilterListItem from '../FilterListItem'
import ListItem from '../ListItem'

const createTestProps = props => ({
  color: colors.red,
  amount: 35,
  onPress: jest.fn(),
  text: 'Red',
  ...props
})

describe('FilterListItem', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FilterListItem {...props} />)
  })

  it('fires onPress when pressed', () => {
    wrapper
      .find(ListItem)
      .props()
      .onPress()

    expect(wrapper.instance().props.onPress).toHaveBeenCalledTimes(1)
  })

  it('displays text', () => {
    expect(wrapper.find(Text)).toHaveLength(1)
    expect(wrapper.find(Text)).toHaveHTML(
      '<react-native-mock>Red (35)</react-native-mock>'
    )
  })
})
