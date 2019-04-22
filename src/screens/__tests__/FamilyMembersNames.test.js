import React from 'react'
import { shallow } from 'enzyme'
import { FamilyMembersNames } from '../lifemap/FamilyMembersNames'
import TextInput from '../../components/TextInput'
import StickyFooter from '../../components/StickyFooter'
import Select from '../../components/Select'
import DateInput from '../../components/DateInput'

const createTestProps = props => ({
  t: value => value,
  nav: {
    survey: {
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
    },
    draftId: 4
  },
  navigation: {
    isFocused: jest.fn(),
    navigate: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn()
  },
  addSurveyData: jest.fn(),
  removeFamilyMembers: jest.fn(),
  addSurveyFamilyMemberData: jest.fn(),
  addDraftProgress: jest.fn(),
  ...props
})

describe('FamilyMembersNames View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<FamilyMembersNames {...props} />)
  })
  describe('rendering', () => {
    it('renders the continue button with proper label', () => {
      expect(wrapper.find(StickyFooter)).toHaveProp({
        continueLabel: 'general.continue'
      })
    })

    it('renders DateInput', () => {
      expect(wrapper.find(DateInput)).toHaveLength(1)
    })
  })

  describe('functionality', () => {
    it('calls navigate function when button is pressed', () => {
      wrapper
        .find(StickyFooter)
        .props()
        .handleClick()

      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
    })
    it('calls setParam on mount', () => {
      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledTimes(1)
    })
    it('calls addDraftProgress on mount', () => {
      expect(wrapper.instance().props.addDraftProgress).toHaveBeenCalledTimes(1)
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

    it('calls addFamilyMemberGender on change', () => {
      const spy = jest.spyOn(wrapper.instance(), 'addFamilyMemberGender')

      wrapper
        .find(Select)
        .last()
        .props()
        .onChange()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('calls addFamilyMemberBirthdate on valid date', () => {
      const spy = jest.spyOn(wrapper.instance(), 'addFamilyMemberBirthdate')

      wrapper
        .find(DateInput)
        .last()
        .props()
        .onValidDate()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  // it("gets first Input value from draft", () => {
  //   expect(
  //     wrapper
  //       .find(TextInput)
  //       .first()
  //       .props().value
  //   ).toBe("Juan")
  // })
  // it("gets second Input value from draft", () => {
  //   expect(
  //     wrapper
  //       .find(TextInput)
  //       .last()
  //       .props().value
  //   ).toBe("Ana")
  // })

  it('calls addFamilyMemberName on input change', () => {
    const spy = jest.spyOn(wrapper.instance(), 'addFamilyMemberName')

    wrapper
      .find(TextInput)
      .last()
      .props()
      .onChangeText('hi')
    expect(spy).toHaveBeenCalledTimes(1)
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

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyMembersNames {...props} />)
  })
  it('checks if screen is focused before updating', () => {
    wrapper.setProps({
      nav: { draftId: 5 }
    })
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      1
    )
  })
  it('updates screen if focused', () => {
    wrapper.setProps({
      nav: { draftId: 5 }
    })
    expect(wrapper.instance().props.nav).toEqual({ draftId: 5 })
  })
})
