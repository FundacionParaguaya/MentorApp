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
  navigation: {
    navigate: jest.fn()
  },
  families: [
    {
      familyId: 12,
      name: 'Adams Family'
    },
    {
      familyId: 21,
      name: 'The Flintstones'
    },
    {
      familyId: 33,
      name: 'The Jetsons'
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
  describe('functionality', () => {
    it('makes a call to fetch families when user is online', () => {
      expect(wrapper.instance().props.loadFamilies).toHaveBeenCalledTimes(1)
    })

    it('does not make a call to fetch families when user is online', () => {
      props = createTestProps({
        offline: { online: false, outbox: [] }
      })
      wrapper = shallow(<Families {...props} />)
      expect(wrapper.instance().props.loadFamilies).toHaveBeenCalledTimes(0)
    })
  })
})
