import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, Text } from 'react-native'
import { Sync } from '../Sync'
import SyncUpToDate from '../../components/SyncUpToDate'

const createTestProps = props => ({
  t: value => value,
  drafts: [{ syncedAt: 1 }, { syncedAt: 2 }],
  offline: { outbox: [], online: true },
  ...props
})

describe('Sync Lifemap View when no questions are skipped', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
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
  })
})
