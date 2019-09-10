import { Dashboard } from '../Dashboard'
import { FlatList } from 'react-native'
import React from 'react'
import { shallow } from 'enzyme'

const createTestProps = props => ({
  toggleAPIVersionModal: jest.fn(),
  markVersionCheked: jest.fn(),
  apiVersion: { timestamp: null, showModal: false },
  navigation: {
    getParam: () => true,
    navigate: jest.fn(),
    setParams: jest.fn()
  },
  user: {
    username: 'demo',
    token: '1e52523'
  },
  lng: 'en',
  t: value => value,
  drafts: [],
  families: [],
  ...props
})

it('clicking create new lifemap navigates to proper screen', () => {
  const props = createTestProps({})
  const wrapper = shallow(<Dashboard {...props} />)
  wrapper
    .find('#create-lifemap')
    .props()
    .handleClick()

  expect(props.navigation.navigate).toHaveBeenCalledTimes(1)
  expect(props.navigation.navigate).toHaveBeenCalledWith('Surveys')
})
it('receives empty data as props', () => {
  const props = createTestProps({})
  const wrapper = shallow(<Dashboard {...props} />)
  expect(wrapper.find(FlatList).props().data).toEqual([])
})

it('receives not empty data as props', () => {
  const props = createTestProps({ drafts: [{ banica: 0 }] })
  const wrapper = shallow(<Dashboard {...props} />)
  expect(wrapper.find(FlatList).props().data).toEqual([{ banica: 0 }])
})
