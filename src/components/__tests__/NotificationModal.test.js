import { Text, View } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import NotificationModal from '../NotificationModal'
import React from 'react'
import { shallow } from 'enzyme'

const createTestProps = props => ({
  isOpen: true,
  onClose: jest.fn(),
  label: 'This is a modal',
  subLabel: 'Some notes',
  ...props
})

let wrapper
let props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<NotificationModal {...props} />)
})

it('shows it\'s contents', () => {
  const labels = wrapper.find(Text)

  expect(labels.first()).toHaveHTML(
    '<react-native-mock>This is a modal</react-native-mock>'
  )

  expect(labels.last()).toHaveHTML(
    '<react-native-mock>Some notes</react-native-mock>'
  )
})

it('fires on close property function when closed', () => {
  wrapper
    .find(Icon)
    .props()
    .onPress()

  expect(props.onClose).toHaveBeenCalledTimes(1)
})

it('doesn\'t show when isOpen is false', () => {
  props = createTestProps({ isOpen: false })
  wrapper = shallow(<NotificationModal {...props} />)
  expect(wrapper.find(View)).toHaveLength(0)
})

it('shows empty modal if not labels are provided', () => {
  props = createTestProps({ label: null, subLabel: null })
  wrapper = shallow(<NotificationModal {...props} />)
  expect(wrapper.find(View)).toHaveLength(1)
  expect(wrapper.find(Text)).toHaveLength(0)
})
