import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import { FamilyGendersBirthdates } from '../lifemap/FamilyGendersBirthdates'
import Select from '../../components/Select'
import StickyFooter from '../../components/StickyFooter'
import DateInputComponent from '../../components/DateInput'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    setParams: jest.fn(),
    getParam: jest.fn(param =>
      param === 'draftId'
        ? 4
        : {
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
    ),
    navigate: jest.fn(),
    isFocused: jest.fn(() => true)
  },
  drafts: [
    {
      draftId: 4,
      surveyId: 1,
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      familyData: {
        countFamilyMembers: 2,
        familyMembersList: [
          {
            firstName: 'Juan',
            lastName: 'Perez'
          },
          {
            firstName: 'Ana',
            gender: 'F',
            birthDate: 1515708000
          }
        ]
      },
      progress: { "screen": "FamilyGendersBirthDates" }
    }
  ],
  addSurveyFamilyMemberData: jest.fn(),
  addDraftProgress: jest.fn(),
  ...props
})

describe('FamilyGendersBirthdates View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<FamilyGendersBirthdates {...props} />)
  })
  describe('rendering', () => {
    it('renders the continue button with proper label', () => {
      expect(wrapper.find(StickyFooter)).toHaveProp({
        continueLabel: 'general.continue'
      })
    })
    it('renders Select', () => {
      expect(wrapper.find(Select)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
    it('renders DateInput', () => {
      expect(wrapper.find(DateInputComponent)).toHaveLength(1)
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
      expect(wrapper.find(DateInputComponent).props().value).toBe(1515708000)
    })
    it('calls addFamilyMemberBirthdate on valid date', () => {
      const spy = jest.spyOn(wrapper.instance(), 'addFamilyMemberBirthdate')

      wrapper
        .find(DateInputComponent)
        .last()
        .props()
        .onValidDate()
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Render optimization', () => {
    let wrapper
    let props
    beforeEach(() => {
      props = createTestProps()
      wrapper = shallow(<FamilyGendersBirthdates {...props} />)
    })
    it('checks if screen is focused before updating', () => {
      wrapper.setProps({
        drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
      })
      expect(
        wrapper.instance().props.navigation.isFocused
      ).toHaveBeenCalledTimes(1)
    })
    it('updates screen if focused', () => {
      wrapper.setProps({
        drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
      })
      expect(wrapper.instance().props.drafts[1]).toEqual({ draftId: 5 })
    })
    it('does not update screen if not focused', () => {
      wrapper.setProps({
        drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
      })
      props = createTestProps({
        navigation: { ...props.navigation, isFocused: jest.fn(() => false) }
      })
      wrapper = shallow(<FamilyGendersBirthdates {...props} />)
      expect(wrapper.instance().props.drafts[1]).toBeFalsy()
    })
  })
})
