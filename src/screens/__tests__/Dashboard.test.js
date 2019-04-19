import React from 'react'
import { shallow } from 'enzyme'
import { AsyncStorage as storage, ScrollView, FlatList } from 'react-native'
import { Dashboard } from '../Dashboard'
import Button from '../../components/Button'
import RoundImage from '../../components/RoundImage'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: arg => arg,
    setParams: jest.fn()
  },
  lng: 'en',
  env: 'production',
  user: { status: '' },
  loadSurveys: jest.fn(),
  loadSnapshots: jest.fn(),
  loadFamilies: jest.fn(),
  offline: { outbox: [] },
  drafts: [
    {
      draftId: 1
    },
    {
      draftId: 2
    }
  ],
  ...props
})

describe('Dashboard View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Dashboard {...props} />)
  })
  describe('rendering', () => {
    it('renders <ScrollView />', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders Button', () => {
      expect(wrapper.find(Button)).toHaveLength(1)
    })
    it('renders <RoundImage />', () => {
      expect(wrapper.find(RoundImage)).toHaveLength(1)
    })
    it('renders <FlatList />', () => {
      expect(wrapper.find(FlatList)).toHaveLength(1)
    })
  })
  describe('functionality', () => {
    it('passes the correct data to <FlatList /> and reverses the order of drafts', () => {
      expect(wrapper.find(FlatList).props().data).toEqual(
        wrapper.instance().props.drafts.reverse()
      )
    })
  })
})

describe('Dashboard already visited by user', () => {
  let wrapper
  beforeEach(async () => {
    const props = createTestProps()
    await storage.setItem('userVisitedDashboard', 'true')
    wrapper = shallow(<Dashboard {...props} />)
  })
  it('does not action loadSnapshots when user already has visited dashboard', () => {
    expect(wrapper.instance().props.loadSnapshots).toHaveBeenCalledTimes(0)
  })
  it('does not action loadSurveys when user already has visited dashboard', () => {
    expect(wrapper.instance().props.loadSurveys).toHaveBeenCalledTimes(0)
  })
  it('does not action loadFamilies when user already has visited dashboard', () => {
    expect(wrapper.instance().props.loadFamilies).toHaveBeenCalledTimes(0)
  })
})
