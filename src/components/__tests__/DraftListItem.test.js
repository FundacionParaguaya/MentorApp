import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import DraftListItem from '../DraftListItem'
import ListItem from '../ListItem'
import moment from 'moment'

const item = {
  status: 'Synced',
  familyData: {
    countFamilyMembers: 1,
    country: 'PY',
    familyMembersList: [
      {
        firstName: 'Juan',
        lastName: 'Perez',
        documentNumber: '123456',
        documentType: '0',
        email: 'juan@gmail.com',
        birthCountry: 'PY',
        gender: 'M',
        birthDate: 12345,
        firstParticipant: true
      },
      {
        firstName: 'Ana',
        firstParticipant: false
      }
    ]
  }
}

const createTestProps = props => ({
  item,
  handleClick: jest.fn(),
  lng: 'en',
  ...props
})

let props, wrapper

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<DraftListItem {...props} />)
})

it('renders all text elements', () => {
  expect(wrapper.find(Text)).toHaveLength(3)
})

it('renders correct date', () => {
  expect(
    wrapper
      .find('#dateCreated')
      .render()
      .text()
  ).toBe(moment(Date.now()).format('MMM DD, YYYY'))
})

it('renders correct participant name', () => {
  expect(wrapper.find('#fullName')).toHaveHTML(
    '<react-native-mock>Juan Perez</react-native-mock>'
  )
})

it('renders correct status title', () => {
  expect(wrapper.find('#status')).toHaveHTML(
    '<react-native-mock>Completed</react-native-mock>'
  )
})

it('on draft items click calls function with proper  data', () => {
  wrapper
    .find(ListItem)
    .props()
    .onPress()
  expect(props.handleClick).toHaveBeenCalledTimes(1)
  expect(props.handleClick).toHaveBeenCalledWith(item)
})
