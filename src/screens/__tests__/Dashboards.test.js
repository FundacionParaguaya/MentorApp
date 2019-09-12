import { Dashboard, mapStateToProps } from '../Dashboard'

import { AndroidBackHandler } from 'react-navigation-backhandler'
import BottomModal from '../../components/BottomModal'
import DraftListItem from '../../components/DraftListItem'
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

let wrapper
let props
beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<Dashboard {...props} />)
})

it('clicking create new lifemap navigates to proper screen', () => {
  wrapper
    .find('#create-lifemap')
    .props()
    .handleClick()

  expect(props.navigation.navigate).toHaveBeenCalledTimes(1)
  expect(props.navigation.navigate).toHaveBeenCalledWith('Surveys')
})
it('receives empty data as props', () => {
  expect(wrapper.find(FlatList).props().data).toEqual([])
})

it('sorts drafts by latest first', () => {
  const drafts = [{ id: 1 }, { id: 2 }]
  props = createTestProps({ drafts })
  wrapper = shallow(<Dashboard {...props} />)

  const list = wrapper.find(FlatList)

  expect(list.props().data).toEqual(drafts.slice().reverse())
  expect(list.props().keyExtractor(drafts[0], 0)).toEqual('0')
  expect(list.props().renderItem({ item: drafts[0] })).toEqual(
    <DraftListItem
      handleClick={expect.any(Function)}
      item={drafts[0]}
      lng="en"
    />
  )
})

it('maps proper state', () => {
  expect(mapStateToProps({ env: 'test' })).toEqual({ env: 'test' })
})

it('disables back button', () => {
  expect(
    wrapper
      .find(AndroidBackHandler)
      .props()
      .onBackPress()
  ).toBe(true)
})

it('redirects to login if user has no token', () => {
  props = createTestProps({ user: { token: null } })
  wrapper = shallow(<Dashboard {...props} />)

  expect(props.navigation.navigate).toHaveBeenCalledWith('Login')
})

describe('filtering drafts', () => {
  beforeEach(() => {
    props = createTestProps({
      drafts: [
        { id: 1, status: 'Draft' },
        { id: 2, status: 'Draft' },
        { id: 3, status: 'Draft' },
        { id: 4, status: 'Synced' },
        { id: 5, status: 'Sync Error' },
        { id: 6, status: 'Sync Error' }
      ]
    })
    wrapper = shallow(<Dashboard {...props} />)
  })

  it('shows only drafts', () => {
    wrapper
      .find('#drafts')
      .props()
      .onPress()

    expect(wrapper.state().filteredDrafts).toHaveLength(3)

    expect(wrapper).toHaveState({ renderFiltered: true })

    wrapper
      .find('#all')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ renderFiltered: false })
  })

  it('shows only synced lifemaps', () => {
    wrapper
      .find('#synced')
      .props()
      .onPress()

    expect(wrapper.state().filteredDrafts).toHaveLength(1)
  })

  it('shows errors', () => {
    wrapper
      .find('#pending')
      .props()
      .onPress()

    expect(wrapper.state().filteredDrafts).toHaveLength(0)

    wrapper
      .find('#error')
      .props()
      .onPress()

    expect(wrapper.state().filteredDrafts).toHaveLength(0)
  })

  it('resets filters when clicking outside modal', () => {
    expect(wrapper).toHaveState({ filterModalIsOpen: false })

    wrapper
      .find('#filters')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ filterModalIsOpen: true })

    wrapper
      .find(BottomModal)
      .props()
      .onEmptyClose()

    expect(wrapper).toHaveState({ filterModalIsOpen: false })
  })
})

describe('checxking API version', () => {
  it('', () => {})
})
