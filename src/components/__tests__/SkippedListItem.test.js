import React from 'react'

import { shallow } from 'enzyme'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SkippedListItem from '../SkippedListItem'
import ListItem from '../ListItem'

const createTestProps = props => ({
  handleClick: jest.fn(),
  lng: {},
  item: { questionText: 'Indicator name' },
  ...props
})

describe('SkippedListItem Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SkippedListItem {...props} />)
  })

  describe('rendering', () => {
    it('renders ListItem', () => {
      expect(wrapper.find(ListItem)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
    it('renders Icon', () => {
      expect(wrapper.find(Icon)).toHaveLength(1)
    })

    describe('functionality', () => {
      it('should call handleClick onPress', () => {
        wrapper
          .find(ListItem)
          .props()
          .onPress()
        expect(wrapper.instance().props.handleClick).toHaveBeenCalledTimes(1)
      })
    })
  })
})
