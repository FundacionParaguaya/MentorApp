import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, Text } from 'react-native'
import { FamilyMembersGender } from '../lifemap/FamilyMembersGender'

import Button from '../../components/Button'
import Select from '../../components/Select'

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
            gender: 'F'
          }
        ]
      }
    }
  ],
  addSurveyFamilyMemberData: jest.fn(),
  addDraftProgress: jest.fn(),
  ...props
})

describe('FamilyMembersGender View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<FamilyMembersGender {...props} />)
  })
  describe('rendering', () => {
    it('renders ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })

    it('renders Button', () => {
      expect(wrapper.find(Button)).toHaveLength(1)
    })
    it('renders Select', () => {
      expect(wrapper.find(Select)).toHaveLength(1)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(1)
    })
  })

  describe('functionality', () => {
    it('calls navigate function when button is pressed', () => {
      wrapper
        .find(Button)
        .props()
        .handleClick()

      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
    })
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

  it('enables Button by default', () => {
    expect(
      wrapper
        .find(Button)
        .last()
        .props().disabled
    ).toBe(false)
  })

  it('disables Button when an error occurs', () => {
    wrapper.instance().errorsDetected = ['error']
    wrapper.setState({ errorsDetected: ['error'] })

    expect(
      wrapper
        .find(Button)
        .last()
        .props().disabled
    ).toBe(true)
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
    wrapper = shallow(<FamilyMembersGender {...props} />)
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
    wrapper = shallow(<FamilyMembersGender {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
})
