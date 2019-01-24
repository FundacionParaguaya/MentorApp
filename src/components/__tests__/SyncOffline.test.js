import React from 'react'

import { shallow } from 'enzyme'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { SyncOffline } from '../sync/SyncOffline'

const createTestProps = props => ({ pendingDraftsLength: 3, ...props })

describe('SyncOffline Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SyncOffline {...props} />)
  })
  describe('rendering', () => {
    it('renders text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders Icon', () => {
      expect(wrapper.find(Icon)).toHaveLength(1)
    })
    it('renders correct text for number of updates', () => {
      expect(
        wrapper
          .find(Text)
          .last()
          .props().children
      ).toBe('3 updates pending')
    })
  })
})
