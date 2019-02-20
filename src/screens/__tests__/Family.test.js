import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, View } from 'react-native'
import { Family } from '../Family'

const createTestProps = props => ({
  ...props
})

describe('Single Family View', () => {
  let wrapper
  const props = createTestProps()
  wrapper = shallow(<Family {...props} />)
  describe('rendering', () => {
    it('renders base ScrollView element', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
  })
})
