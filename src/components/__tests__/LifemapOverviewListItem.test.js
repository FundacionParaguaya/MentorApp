import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import colors from '../../theme.json'
import ListItem from '../ListItem'
import LifemapOverviewListItem from '../LifemapOverviewListItem'

const createTestProps = props => ({
  name: 'Family Savings',
  color: 2,
  achievement: false,
  priority: true,
  handleClick: jest.fn(),
  draftOverview: true,
  ...props
})

describe('LifemapOverviewListItem Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<LifemapOverviewListItem {...props} />)
  })

  describe('rendering', () => {
    it('renders <ListItem />', () => {
      expect(wrapper.find(ListItem)).toHaveLength(1)
    })

    it('renders <Text />', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
    it('renders Icon', () => {
      expect(wrapper.find(Icon)).toHaveLength(2)
    })
    it('renders priority Icon when priority is true', () => {
      expect(wrapper.find(Icon2)).toHaveLength(1)
    })
    it('does not render priority Icon when priority if false', () => {
      props = createTestProps({ priority: false })
      wrapper = shallow(<LifemapOverviewListItem {...props} />)
      expect(wrapper.find(Icon2)).toHaveLength(0)
    })
    it('renders achievement Icon when achievement is true', () => {
      props = createTestProps({ achievement: true, color: 3 })
      wrapper = shallow(<LifemapOverviewListItem {...props} />)
      expect(wrapper.find(Icon)).toHaveLength(3)
    })
  })
  describe('functionality', () => {
    it('passes the correct name to Text', () => {
      expect(wrapper.find(Text).props().children).toEqual('Family Savings')
    })

    it('renders icon in correct color', () => {
      expect(
        wrapper
          .find(Icon)
          .first()
          .props().color
      ).toEqual(colors.gold)
    })
    it('disables button when indicator is grey', () => {
      props = createTestProps({ color: 0 })
      wrapper = shallow(<LifemapOverviewListItem {...props} />)
      expect(wrapper.find(ListItem).props().disabled).toBe(true)
    })
    it('disables button when indicator is not grey but there is no priority or achievement and it is not a draft overview', () => {
      props = createTestProps({ draftOverview: false, priority: false })
      wrapper = shallow(<LifemapOverviewListItem {...props} />)
      expect(wrapper.find(ListItem).props().disabled).toBe(true)
    })
  })
})
