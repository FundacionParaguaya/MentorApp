import React from 'react'
import { shallow } from 'enzyme'
import Decoration from '../decoration/Decoration'
import Orb from '../decoration/Orb'

describe('Decoration Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    wrapper = shallow(<Decoration {...props} />)
  })
  it('renders all orb components', () => {
    expect(wrapper.find(Orb)).toHaveLength(6)
  })
})
