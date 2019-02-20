import React from 'react'
import { shallow } from 'enzyme'
import {
  ScrollView,
  View,
  Button,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { Families } from '../Families'
import SearchBar from '../../components/SearchBar'

const createTestProps = props => ({
  loadFamilies: jest.fn(),
  env: 'development',
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    setParams: jest.fn()
  },
  families: [
    {
      familyId: 12,
      name: 'Adams Family',
      code: '123'
    },
    {
      familyId: 21,
      name: 'The Flintstones',
      code: '234'
    },
    {
      familyId: 33,
      name: 'The Jetsons',
      code: '456'
    }
  ],
  user: { token: '' },
  offline: { online: true, outbox: [{ type: 'LOAD_FAMILIES' }] },
  ...props
})

describe('Families View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Families {...props} />)
  })

  describe('rendering', () => {
    it('renders base ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })

    it('renders Activity indicator when there are families to fetch and the user is online', () => {
      expect(wrapper.find(ActivityIndicator)).toHaveLength(1)
    })

    it('does not render Activity indicator when there are no families to fetch', () => {
      props = createTestProps({ offline: { online: true, outbox: [] } })
      wrapper = shallow(<Families {...props} />)
      expect(wrapper.find(ActivityIndicator)).toHaveLength(0)
    })

    it('does not render Activity indicator when user is offline', () => {
      props = createTestProps({
        offline: { online: false, outbox: [{ type: 'LOAD_FAMILIES' }] }
      })
      wrapper = shallow(<Families {...props} />)
      expect(wrapper.find(ActivityIndicator)).toHaveLength(0)
    })

    it('renders SearchBar', () => {
      expect(wrapper.find(SearchBar)).toHaveLength(1)
    })

    it('renders a list of families', () => {
      expect(wrapper.find(FlatList)).toHaveLength(1)
    })
  })

  it('passes the correct number of families to FlatList', () => {
    expect(wrapper.find(FlatList).props().data).toHaveLength(3)
  })

  describe('functionality', () => {
    it('makes a call to fetch families when user is online and no other call is in the queue', () => {
      props = createTestProps({ offline: { online: true, outbox: [] } })
      wrapper = shallow(<Families {...props} />)
      expect(wrapper.instance().props.loadFamilies).toHaveBeenCalledTimes(1)
    })

    it('does not make a call to fetch families when user is online', () => {
      props = createTestProps({
        offline: { online: false, outbox: [] }
      })
      wrapper = shallow(<Families {...props} />)
      expect(wrapper.instance().props.loadFamilies).toHaveBeenCalledTimes(0)
    })
    it('changing search bar value changes search state', () => {
      wrapper
        .find(SearchBar)
        .props()
        .onChangeText('Adams')
      expect(wrapper.instance().state.search).toEqual('Adams')
    })
  })
  it('filters family when search bar value changes', () => {
    wrapper
      .find(SearchBar)
      .props()
      .onChangeText('Adams')
    expect(wrapper.find(FlatList).props().data).toHaveLength(1)
  })
  it('calls sets the screen title on mount', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      1
    )
  })
  it('updates screen title when lng prop changes', () => {
    wrapper.setProps({ lng: 'es' })
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      2
    )
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledWith({
      title: 'views.families'
    })
  })
})
