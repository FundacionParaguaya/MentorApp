import React from 'react'
import { shallow } from 'enzyme'
import { Animated } from 'react-native'
import Orb from '../decoration/Orb'
import colors from '../../theme.json'

const createTestProps = props => ({
  style: {},
  position: { x: 10, y: 10 },
  size: 25,
  color: colors.yellow,
  ...props
})

describe('Navigation Wrapper', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Orb {...props} />)
  })
  it('triggers animation cycle on mount', () => {
    const spy = jest.spyOn(wrapper.instance(), 'cycleAnimation')
    wrapper.instance().componentDidMount()
    expect(spy).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
  it('has proper initial color', () => {
    expect(wrapper.find(Animated.View).props().style).toContainEqual({
      backgroundColor: colors.yellow
    })
  })
})
