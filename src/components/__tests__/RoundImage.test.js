import React from 'react'

import { shallow } from 'enzyme'
import { Image } from 'react-native'
import RoundImage from '../RoundImage'

const createTestProps = props => ({
  source: 'family',
  ...props
})

describe('RoundImage Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<RoundImage {...props} />)
  })
  describe('rendering', () => {
    it('renders <Image />', () => {
      expect(wrapper.find(Image)).toHaveLength(1)
    })
  })
})
