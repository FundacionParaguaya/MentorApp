import Button from '../Button'
import React from 'react'
import { ScrollView } from 'react-native'
import StickyFooter from '../StickyFooter'
import Tip from '../Tip'
import { shallow } from 'enzyme'

const createTestProps = props => ({
  children: [],
  visible: true,
  handleClick: jest.fn(),
  continueLabel: 'Continue',
  type: 'button',
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
  it('renders Tip with appropriate title and description', () => {
    props = createTestProps({
      type: 'tip',
      tipTitle: 'title',
      tipDescription: 'description'
    })
    wrapper = shallow(<StickyFooter {...props} />)
    expect(wrapper.find(Tip)).toHaveLength(1)
    expect(wrapper.find(Tip)).toHaveProp({
      title: 'title',
      description: 'description'
    })
  })
  it('does not render button or Tip when visible prop is false', () => {
    props = createTestProps({ visible: false })
    wrapper = shallow(<StickyFooter {...props} />)

    expect(wrapper.find(Button)).toHaveLength(0)
    expect(wrapper.find(Tip)).toHaveLength(0)
  })
  it('hides the continue button when the keyboard is up', () => {
    wrapper.setState({ continueVisible: false })
    expect(wrapper.find(Button)).toHaveLength(0)
  })
})
