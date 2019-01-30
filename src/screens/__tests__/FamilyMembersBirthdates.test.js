import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import { FamilyMembersBirthdates } from '../lifemap/FamilyMembersBirthdates'
import DateInputComponent from '../../components/DateInput'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    getParam: jest.fn(param => (param === 'draftId' ? 4 : null)),
    setParams: jest.fn(),
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
      }
    }
  ],
  addSurveyFamilyMemberData: jest.fn(),
  addDraftProgress: jest.fn(),
  ...props
})

describe('FamilyMembersBirthDates View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<FamilyMembersBirthdates {...props} />)
  })
  describe('rendering', () => {
    it('renders DateInput', () => {
      expect(wrapper.find(DateInputComponent)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
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

  it('calls setParam on mount', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      1
    )
  })
  it('calls addDraftProgress on mount', () => {
    expect(wrapper.instance().props.addDraftProgress).toHaveBeenCalledTimes(1)
  })
  it('calls onPressBack', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onPressBack')

    wrapper.instance().onPressBack()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyMembersBirthdates {...props} />)
  })
  it('checks if screen is focused before updating', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      1
    )
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

    wrapper = shallow(<FamilyMembersBirthdates {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
})
