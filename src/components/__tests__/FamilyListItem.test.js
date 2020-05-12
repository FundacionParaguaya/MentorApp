import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import FamilyListItem from '../FamilyListItem'
import ListItem from '../ListItem'
import Icon from 'react-native-vector-icons/MaterialIcons'

const createTestProps = props => ({
  handleClick: jest.fn(),
  text: 'Socio Economic title',
  icon: true,
  ...props
})

describe('FamilyListItem Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyListItem {...props} />)
  })

  describe('rendering', () => {
    it('renders <ListItem />', () => {
      expect(wrapper.find(ListItem)).toHaveLength(1)
    })
    it('renders the face icon <Icon />', () => {
      expect(wrapper.find(Icon)).toHaveLength(2)
    })

    it('renders the correct name in Text component', () => {
      expect(
        wrapper
          .find(Text)
          .first()
          .props().children
      ).toEqual('Socio Economic title')
    })
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
