import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, Text, FlatList } from 'react-native'
import { Sync } from '../Sync'
import SyncUpToDate from '../../components/sync/SyncUpToDate'
import SyncOffline from '../../components/sync/SyncOffline'
import SyncInProgress from '../../components/sync/SyncInProgress'

const createTestProps = props => ({
  t: value => value,
  drafts: [{ syncedAt: 1 }, { syncedAt: 2 }],
  offline: { outbox: [], online: true },
  ...props
})

describe('Sync Lifemap View when no questions are skipped', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Sync {...props} />)
  })
  describe('rendering', () => {
    it('renders ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders SyncUpToDate when user is online and outbox is empty', () => {
      expect(wrapper.find(SyncUpToDate)).toHaveLength(1)
    })
    it('passess the correct date to SyncUpToDate', () => {
      expect(wrapper.find(SyncUpToDate).props().date).toBe(2)
    })
    it('renders syncOffline component when offline', () => {
      props = createTestProps({ offline: { outbox: [], online: false } })
      wrapper = shallow(<Sync {...props} />)
      expect(wrapper.find(SyncOffline)).toHaveLength(1)
    })
    it('renders syncInProgress component when online and outbox is not empty', () => {
      props = createTestProps({
        offline: { outbox: [{ type: 'SUBMIT_DRAFT' }], online: true }
      })
      wrapper = shallow(<Sync {...props} />)
      expect(wrapper.find(SyncInProgress)).toHaveLength(1)
    })
    it('renders does not render FlatList when outbox is empty', () => {
      expect(wrapper.find(FlatList)).toHaveLength(0)
    })
    it('renders FlatList when outbox is not empty', () => {
      props = createTestProps({
        offline: { outbox: [{ type: 'SUBMIT_DRAFT' }], online: false }
      })
      wrapper = shallow(<Sync {...props} />)
      expect(wrapper.find(FlatList)).toHaveLength(1)
    })
  })
})
