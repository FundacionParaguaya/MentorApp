import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, View, Button } from 'react-native'
import { Families } from '../Families'

const createTestProps = props => ({
  loadFamilies: jest.fn(),
  env: 'development',
  navigation: {
    navigate: jest.fn()
  },
  families: [],
  user: { token: '' },
  offline: { online: true, outbox: [{ type: 'LOAD_FAMILIES' }] },
  ...props
})

describe('Families View', () => {
  let wrapper
  const props = createTestProps({
    families: [
      {
        familyId: 12,
        name: 'Adams Family'
      },
      {
        familyId: 21,
        name: 'The Flintstones'
      },
      {
        familyId: 33,
        name: 'The Jetsons'
      }
    ]
  })
  wrapper = shallow(<Families {...props} />)

  describe('rendering', () => {
    it('renders base ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })

    it('renders a list of Views for each family', () => {
      expect(wrapper.find(View)).toHaveLength(3)
    })
  })
  describe('functionality', () => {
    it('can navigate to a family page', () => {
      wrapper
        .find(Button)
        .first()
        .props()
        .onPress()

      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)

      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledWith(
        'Family',
        { family: 12 }
      )
    })
  })
})
