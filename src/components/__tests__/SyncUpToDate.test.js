import React from 'react'

import { shallow } from 'enzyme'
import { Text, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { SyncUpToDate } from '../SyncUpToDate'

const createTestProps = props => ({
  date: 12345,
  description: 'Description',
  ...props
})

describe('SyncUpToDate Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SyncUpToDate {...props} />)
  })
  describe('rendering', () => {
    it('renders title and description', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders Icon', () => {
      expect(wrapper.find(Icon)).toHaveLength(1)
    })
    it('renders correct date', () => {
      expect(
        wrapper
          .find(Text)
          .last()
          .props().children
      ).toBe('Last sync: Jan, 01 1970')
    })
  })
})
