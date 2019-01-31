import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import Button from '../Button'
import StickyFooter from '../StickyFooter'

const createTestProps = props => ({
  children: [],
  handleClick: jest.fn(),
  continueLabel: 'Continue',
  ...props
})

describe('Sticky Footer', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<StickyFooter {...props} />)
  })
  it('renders the page content in a ScrollView', () => {
    expect(wrapper.find(ScrollView)).toHaveLength(1)
  })
  it('renders the continue/save button with the proper label', () => {
    expect(wrapper.find(Button)).toHaveLength(1)
    expect(wrapper.find(Button)).toHaveProp({ text: 'Continue' })
  })
  it('pressing continue/save fires the handleClick function', () => {
    wrapper
      .find(Button)
      .props()
      .handleClick()
    expect(props.handleClick).toHaveBeenCalledTimes(1)
  })
  it('does not render button when hidden prop is true', () => {
    props = createTestProps({ hidden: true })
    wrapper = shallow(<StickyFooter {...props} />)

    expect(wrapper.find(Button)).toHaveLength(0)
  })
})
