import { shallow } from 'enzyme'
import moment from 'moment'
import React from 'react'
import { Text } from 'react-native'

import colors from '../../theme.json'
import DraftListItem from '../DraftListItem'
import ListItem from '../ListItem'

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
  user: { role: 'ROLE_SURVEY_TAKER' },
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

it('renders dash for name if something is data for primary participant is missing', () => {
  wrapper.setProps({
    item: {
      ...item,
      familyData: {
        ...item.familyData,
        familyMembersList: []
      }
    }
  })

  expect(wrapper.find('#fullName')).toHaveHTML(
    '<react-native-mock> - </react-native-mock>'
  )
})

it('renders correct status title', () => {
  expect(wrapper.find('#status')).toHaveHTML(
    '<react-native-mock>Completed</react-native-mock>'
  )
})

it('reders correct title when status is Draft', () => {
  wrapper.setProps({ item: { ...item, status: 'Draft' } })

  expect(wrapper.find('#status')).toHaveHTML(
    '<react-native-mock>Draft</react-native-mock>'
  )
})

it('reders correct title when status is Pending sync', () => {
  wrapper.setProps({ item: { ...item, status: 'Pending sync' } })

  expect(wrapper.find('#status')).toHaveHTML(
    '<react-native-mock>Sync pending</react-native-mock>'
  )
})

it('reders correct title when status is Sync error', () => {
  wrapper.setProps({ item: { ...item, status: 'Sync error' } })

  expect(wrapper.find('#status')).toHaveHTML(
    '<react-native-mock>Sync error</react-native-mock>'
  )
})

it('calls function with proper data on draft items click', () => {
  wrapper
    .find(ListItem)
    .props()
    .onPress()
  expect(props.handleClick).toHaveBeenCalledTimes(1)
  expect(props.handleClick).toHaveBeenCalledWith(item)
})

it('sets default values for title and label color if status is not one of the known types', () => {
  const STATUS = 'Unknown'
  expect(wrapper.instance().getColor(STATUS)).toBe(colors.palegrey)
  expect(wrapper.instance().setStatusTitle(STATUS)).toBe('')
})

it('sets empty sring if the date format is wrong', () => {
  const wrongDateFormat = 1945
  expect(wrapper.instance().capitalize(wrongDateFormat)).toBe('')
})
