import React from 'react'

import { shallow } from 'enzyme'
import { Text, ProgressBarAndroid } from 'react-native'
import { SyncInProgress } from '../sync/SyncInProgress'

const createTestProps = props => ({ pendingDraftsLength: 3, ...props })

describe('SyncInProgress Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SyncInProgress {...props} />)
  })
  describe('rendering', () => {
    it('renders text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders ProgressBarAndroid', () => {
      expect(wrapper.find(ProgressBarAndroid)).toHaveLength(1)
    })
    it('renders correct text for number of updates', () => {
      expect(
        wrapper
          .find(Text)
          .last()
          .props().children
      ).toBe('0 of 3 updates')
    })
    it('renders correct text for number of updates on prop change', () => {
      wrapper.setProps({ pendingDraftsLength: 1 })
      expect(
        wrapper
          .find(Text)
          .last()
          .props().children
      ).toBe('2 of 3 updates')
    })
  })
})
