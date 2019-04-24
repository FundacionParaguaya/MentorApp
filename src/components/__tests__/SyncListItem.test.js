import React from 'react'

import { shallow } from 'enzyme'
import { Text } from 'react-native'
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
