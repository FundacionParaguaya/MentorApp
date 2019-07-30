import React from 'react'
import { shallow } from 'enzyme'
import { FamilyMembersNames } from '../lifemap/FamilyMembersNames'
import draft from '../__mocks__/draftMock.json'
import StickyFooter from '../../components/StickyFooter'
import Select from '../../components/Select'
import DateInput from '../../components/DateInput'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    isFocused: jest.fn(),
    navigate: jest.fn(),
    push: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'family') {
        return null
      } else if (param === 'survey') {
        return {
          surveyStoplightQuestions: [],
          surveyEconomicQuestions: [],
          surveyConfig: {
            gender: [
              {
                text: 'Female',
                value: 'F'
              },
              {
                text: 'Male',
                value: 'M'
              },
              {
                text: 'Prefer not to disclose',
                value: 'O'
              }
            ]
          }
        }
      } else if (param === 'draft') {
        return draft
      }
    })
  },
  addSurveyData: jest.fn(),
  ...props
})

describe('FamilyMembersNames View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<FamilyMembersNames {...props} />)
  })

  it('renders the continue button with proper label', () => {
    expect(wrapper.find(StickyFooter)).toHaveProp({
      continueLabel: 'general.continue'
    })
  })

  it('renders DateInput', () => {
    expect(wrapper.find(DateInput)).toHaveLength(1)
  })

  it('calls navigate function when button is pressed', () => {
    wrapper
      .find(StickyFooter)
      .props()
      .handleClick()

    expect(wrapper.instance().props.navigation.push).toHaveBeenCalledTimes(1)
  })
  it('calls setParam on mount', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      2
    )
  })

  it('calls onPressBack', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onPressBack')

    wrapper.instance().onPressBack()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('gives DateInput the proper value', () => {
    expect(wrapper.find(DateInput).props().value).toBe(12345)
  })

  it('gives Select the proper value', () => {
    expect(wrapper.find(Select).props().value).toBe('F')
  })

  it('shows and hides errors', () => {
    wrapper.instance().detectError(true, 'test')

    expect(wrapper).toHaveState({ errorsDetected: ['test'] })

    wrapper.instance().detectError(true, 'anotherError')

    expect(wrapper).toHaveState({ errorsDetected: ['test', 'anotherError'] })

    wrapper.instance().detectError(false, 'test')

    expect(wrapper).toHaveState({ errorsDetected: ['anotherError'] })
  })
})
