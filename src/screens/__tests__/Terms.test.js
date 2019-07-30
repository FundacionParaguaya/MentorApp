import React from 'react'
import { shallow } from 'enzyme'
import { Terms } from '../lifemap/Terms'
import Button from '../../components/Button'

const createTestProps = props => ({
  navigation: {
    getParam: param =>
      param === 'survey'
        ? {
            id: 1,
            termsConditions: { text: 'text', title: 'title' },
            privacyPolicy: { text: 'text', title: 'title' }
          }
        : 'privacy',
    navigate: jest.fn(),
    setParams: jest.fn()
  },
  t: jest.fn(page => page),
  ...props
})

describe('Terms/Privacy view', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<Terms {...props} />)
  })

  it('gets proper survey from redux', () => {})

  it('renders translated agree and disagree buttons', () => {
    expect(wrapper.find(Button)).toHaveLength(2)
    expect(wrapper.find(Button).first()).toHaveProp('text', 'general.disagree')
    expect(wrapper.find(Button).last()).toHaveProp('text', 'general.agree')
  })

  it('agreeing navigates to the correct screen', () => {
    wrapper
      .find(Button)
      .last()
      .props()
      .handleClick()

    expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledTimes(
      1
    )

    expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledWith(
      'FamilyParticipant',
      {
        page: undefined,
        survey: {
          id: 1,
          privacyPolicy: { text: 'text', title: 'title' },
          termsConditions: { text: 'text', title: 'title' }
        }
      }
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
