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
            termsConditions: {
              text: 'some terms',
              title: 'terms and conditions'
            },
            privacyPolicy: { text: 'some policy', title: 'privacy policy' }
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
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Terms {...props} />)
  })

  it('receives proper survey from navigation', () => {})

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

    expect(props.navigation.navigate).toHaveBeenCalledTimes(1)

    expect(props.navigation.navigate).toHaveBeenCalledWith(
      'FamilyParticipant',
      {
        page: undefined,
        survey: props.navigation.getParam('survey')
      }
    )
  })
  it('disagreeing opens exit draft modal', () => {
    wrapper
      .find(Button)
      .first()
      .props()
      .handleClick()

    expect(props.navigation.navigate).toHaveBeenCalledTimes(1)
    expect(props.navigation.navigate).toHaveBeenCalledWith('ExitDraftModal')
  })
  it('shows proper contents based on page', () => {
    expect(wrapper.find('#title')).toHaveHTML(
      '<react-native-mock>privacy policy</react-native-mock>'
    )
    expect(wrapper.find('#content')).toHaveHTML(
      '<react-native-mock>some policy</react-native-mock>'
    )

    props = createTestProps({
      navigation: {
        getParam: param =>
          param === 'survey'
            ? {
                id: 1,
                termsConditions: {
                  text: 'some terms',
                  title: 'terms and conditions'
                },
                privacyPolicy: { text: 'some policy', title: 'privacy policy' }
              }
            : 'terms',
        navigate: jest.fn(),
        setParams: jest.fn()
      }
    })

    wrapper = shallow(<Terms {...props} />)

    expect(wrapper.find('#title')).toHaveHTML(
      '<react-native-mock>terms and conditions</react-native-mock>'
    )
    expect(wrapper.find('#content')).toHaveHTML(
      '<react-native-mock>some terms</react-native-mock>'
    )
  })
})
