import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, Text } from 'react-native'
import { Sync } from '../Sync'

const createTestProps = props => ({
  t: value => value,
  drafts: [],
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
  })
})
