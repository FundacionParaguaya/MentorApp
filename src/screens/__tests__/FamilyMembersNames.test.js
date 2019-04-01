import React from 'react'
import { shallow } from 'enzyme'
import { FamilyMembersNames } from '../lifemap/FamilyMembersNames'
import TextInput from '../../components/TextInput'
import StickyFooter from '../../components/StickyFooter'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    setParams: jest.fn(),
    getParam: jest.fn(param => (param === 'draftId' ? 4 : null)),
    navigate: jest.fn(),
    isFocused: jest.fn(() => true)
  },
  drafts: [
    {
      draftId: 4,
      surveyId: 1,
      progress: { "screen": "FamilyMembersNames" },
      economicSurveyDataList: [
        { key: 'educationPersonMostStudied', value: 'SCHOOL-COMPLETE' },
        { key: 'receiveStateIncome', value: 'NO' },
        { key: 'currency', value: 'GBP/Pound Sterling' },
        { key: 'areaOfResidence', value: 'URBAN' }
      ],

      indicatorSurveyDataList: [
        { key: 'insurance', value: 1 },
        { key: 'entertainmentAndRecreation', value: 3 },
        { key: 'stableHousing', value: 2 }
      ],
      familyData: {
        countFamilyMembers: 2,
        familyMembersList: [
          {
            firstName: 'Juan',
            lastName: 'Perez'
          },
          {
            firstName: 'Ana'
          }
        ]
      }
    }
  ],
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
    it('renders TextInput', () => {
      expect(wrapper.find(TextInput)).toHaveLength(2)
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
  })

  it('makes first TextInput is readonly', () => {
    expect(
      wrapper
        .find(TextInput)
        .first()
        .props().readonly
    ).toBe(true)
  })
  it('gets first Input value from draft', () => {
    expect(
      wrapper
        .find(TextInput)
        .first()
        .props().value
    ).toBe('Juan')
  })
  it('gets second Input value from draft', () => {
    expect(
      wrapper
        .find(TextInput)
        .last()
        .props().value
    ).toBe('Ana')
  })

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
    wrapper = shallow(<FamilyMembersNames {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
})
