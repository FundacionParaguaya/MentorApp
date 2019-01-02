import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import { Terms } from '../lifemap/Terms'
import RoundImage from '../../components/RoundImage'
import Button from '../../components/Button'

const createTestProps = props => ({
  navigation: {
    getParam: param => (param === 'survey' ? 1 : 'privacy'),
    navigate: jest.fn(),
    setParams: jest.fn()
  },
  t: jest.fn(page => page),
  surveys: [
    {
      id: 1,
      termsConditions: { text: 'text', title: 'title' },
      privacyPolicy: { text: 'text', title: 'title' }
    }
  ],
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
  it('get proper string from survey privacy policy', () => {
    expect(wrapper.find('#content').props().children).toBe(
      wrapper.instance().props.surveys[0].privacyPolicy.text
    )
  })
  it('renders an agree and disagree button', () => {
    expect(wrapper.find(Button)).toHaveLength(2)
    expect(wrapper.find(Button).first()).toHaveProp('text', 'general.disagree')
    expect(wrapper.find(Button).last()).toHaveProp('text', 'general.agree')
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
  it('disagreeing opens modal', () => {
    wrapper
      .find(Button)
      .first()
      .props()
      .handleClick()

    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      1
    )
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledWith({
      modalOpen: true
    })
  })
})
