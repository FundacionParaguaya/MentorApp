import React from 'react'

import { shallow } from 'enzyme'
import { TouchableOpacity, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SyncListItem from '../sync/SyncListItem'

const createTestProps = props => ({
  handleClick: jest.fn(),
  item: {
    countFamilyMembers: 2,
    familyMembersList: [
      {
        firstName: 'Juan',
        lastName: 'Perez'
      }
    ]
  },
  ...props
})

describe('SyncListItem Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SyncListItem {...props} />)
  })

  describe('rendering', () => {
    it('renders <View />', () => {
      expect(wrapper.find(View)).toHaveLength(2)
    })
    it('renders <Text />', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders <Icon />', () => {
      expect(wrapper.find(Icon)).toHaveLength(1)
    })
    it('renders the correct number of family members in first Text component', () => {
      expect(
        wrapper
          .find(Text)
          .first()
          .props().children
      ).toEqual('Juan Perez + 1')
    })
  })
})
