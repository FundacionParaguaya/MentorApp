import React from 'react'

import { shallow } from 'enzyme'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FamiliesListItem from '../FamiliesListItem'
import ListItem from '../ListItem'

const createTestProps = props => ({
  handleClick: jest.fn(),
  lng: 'en',
  family: {
    name: 'Juan Perez',
    snapshotList: [
      {
        familyData: {
          familyMembersList: [
            {
              firstName: 'Juan',
              lastName: 'Perez',
              birthDate: 1538352000,
              firstParticipant: true
            }
          ]
        }
      }
    ]
  },

  ...props
})

describe('FamiliesListItem Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamiliesListItem {...props} />)
  })

  describe('rendering', () => {
    it('renders <ListItem />', () => {
      expect(wrapper.find(ListItem)).toHaveLength(1)
    })
    it('renders <Text />', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders <Icon />', () => {
      expect(wrapper.find(Icon)).toHaveLength(1)
    })
    it('renders the correct date in second Text component', () => {
      expect(
        wrapper
          .find(Text)
          .last()
          .props().children
      ).toEqual('D.O.B: Oct 01, 2018')
    })
    it('renders the correct name in last Text component', () => {
      expect(
        wrapper
          .find(Text)
          .first()
          .props().children
      ).toEqual('Juan Perez')
    })
    it('renders a not sunced family', () => {
      props = createTestProps({
        family: {
          name: 'San Migel',
          snapshotList: []
        }
      })
      wrapper = shallow(<FamiliesListItem {...props} />)

      expect(
        wrapper
          .find(Text)
          .first()
          .props().children
      ).toEqual('San Migel')
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
    it('ListItem is disabled if there is no snapshot list in family', () => {
      props = createTestProps({
        family: {
          name: 'Juan Perez',
          snapshotList: []
        }
      })
      wrapper = shallow(<FamiliesListItem {...props} />)
      expect(wrapper.find(ListItem).props().disabled).toBe(true)
    })
  })
})
