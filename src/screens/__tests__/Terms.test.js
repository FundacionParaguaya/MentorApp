import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import { Terms } from '../lifemap/Terms'
import RoundImage from '../../components/RoundImage'
import Button from '../../components/Button'

const createTestProps = props => ({
  navigation: {
    getParam: () => 'privacy',
    navigate: jest.fn(),
    goBack: jest.fn()
  },
  t: page => page,
  ...props
})

describe('Terms/Privacy view', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<Terms {...props} />)
  })
  it('renders base ScrollView element', () => {
    expect(wrapper.find(ScrollView)).toHaveLength(1)
  })
  it('renders proper RoundImage', () => {
    expect(wrapper.find(RoundImage)).toHaveLength(1)
    expect(wrapper.find(RoundImage)).toHaveProp('source', 'check')
  })
  it('get proper string from page param in navigation', () => {
    expect(wrapper.find('#content').props().children).toBe('views.privacy')
  })
  it('renders an agree and disagree button', () => {
    expect(wrapper.find(Button)).toHaveLength(2)
    expect(wrapper.find(Button).first()).toHaveProp('text', 'Disagree')
    expect(wrapper.find(Button).last()).toHaveProp('text', 'Agree')
  })
  it('agreeing navigates to next view', () => {
    wrapper
      .find(Button)
      .last()
      .props()
      .handleClick()

    expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledTimes(
      1
    )
  })
  it('disagreeing goes back', () => {
    wrapper
      .find(Button)
      .first()
      .props()
      .handleClick()

    expect(wrapper.instance().props.navigation.goBack).toHaveBeenCalledTimes(1)
  })
})
