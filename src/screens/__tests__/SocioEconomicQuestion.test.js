import React from 'react'
import { shallow } from 'enzyme'
import { SocioEconomicQuestion } from '../lifemap/SocioEconomicQuestion'
import Select from '../../components/Select'
import TextInput from '../../components/TextInput'
import data from '../__mocks__/fake-socio-economic-data.json'
import StickyFooter from '../../components/StickyFooter'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    push: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'survey') {
        return data
      } else {
        return null
      }
    }),
    setParams: jest.fn(),
    isFocused: jest.fn(() => true)
  },
  addSurveyData: jest.fn(),
  addDraftProgress: jest.fn(),
  addSurveyFamilyMemberData: jest.fn(),
  drafts: [
    {
      draftId: 1
    },
    {
      draftId: 2,
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
  ...props
})

describe('SocioEconomicQuestion screens', () => {
  let wrapper
  let props
  describe('initial screen', () => {
    beforeEach(() => {
      props = createTestProps()
      wrapper = shallow(<SocioEconomicQuestion {...props} />)
    })

    it('sets navigation socioEconomics param', () => {
      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledTimes(2)

      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledWith({ socioEconomics: expect.any(Object) })
    })
  })

  describe('after data is set', () => {
    beforeEach(() => {
      props = createTestProps({
        navigation: {
          push: jest.fn(),
          navigate: jest.fn(),
          getParam: jest.fn(param => {
            if (param === 'socioEconomics') {
              return {
                currentScreen: 1,
                totalScreens: 3,
                questionsPerScreen: [
                  {
                    forFamily: [
                      {
                        questionText:
                          'Is there any member with disabilities in your household? Please indicate the disability type',
                        answerType: 'select',
                        required: true,
                        codeName: '1',
                        options: [
                          { value: 'PHYSICAL', text: 'Phisical' },
                          { value: 'MENTAL', text: 'Mental' },
                          { value: 'LEARNING', text: 'Learning' },
                          {
                            value: 'NO-MEMBER-DISABILITIES',
                            text: 'No member with disabilities'
                          }
                        ]
                      },
                      {
                        questionText:
                          'What is the property title situation of your household?',
                        answerType: 'select',
                        codeName: '2'
                      }
                    ],
                    forFamilyMember: []
                  }
                ]
              }
            } else {
              return null
            }
          }),
          setParams: jest.fn()
        }
      })
      wrapper = shallow(<SocioEconomicQuestion {...props} />)
    })

    it('renders the continue button with proper label', () => {
      expect(wrapper.find(StickyFooter)).toHaveProp({
        continueLabel: 'general.continue'
      })
    })

    it('navigates to next socio-economics screen on pressing continue', () => {
      wrapper
        .find(StickyFooter)
        .last()
        .props()
        .handleClick()

      expect(wrapper.instance().props.navigation.push).toHaveBeenCalledTimes(1)

      expect(wrapper.instance().props.navigation.push).toHaveBeenCalledWith(
        'SocioEconomicQuestion',
        expect.any(Object)
      )
    })

    it('renders Select elements for each select question', () => {
      expect(wrapper.find(Select)).toHaveLength(2)
    })

    it('shows a select with all props', () => {
      expect(wrapper.find(Select).first()).toHaveProp({
        required: true,
        label:
          'Is there any member with disabilities in your household? Please indicate the disability type',
        options: [
          { value: 'PHYSICAL', text: 'Phisical' },
          { value: 'MENTAL', text: 'Mental' },
          { value: 'LEARNING', text: 'Learning' },
          {
            value: 'NO-MEMBER-DISABILITIES',
            text: 'No member with disabilities'
          }
        ]
      })
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

  describe('non-initial screen', () => {
    beforeEach(() => {
      props = createTestProps({
        navigation: {
          navigate: jest.fn(),
          getParam: jest.fn(param => {
            if (param === 'survey') {
              return data
            } else if (param === 'socioEconomics') {
              return {
                currentScreen: 3,
                totalScreens: 3,
                questionsPerScreen: [
                  {},
                  {},
                  {
                    forFamilyMember: [
                      {
                        questionText:
                          'Please estimate your gross monthly household income (i.e, before taxes National Insurance contributions or other deductions)',
                        answerType: 'text',
                        dimension: 'Income',
                        required: true,
                        codeName: '3',
                        forFamilyMember: true,
                        options: []
                      }
                    ],
                    forFamily: [
                      {
                        questionText:
                          'Please estimate your gross monthly household income (i.e, before taxes National Insurance contributions or other deductions)',
                        answerType: 'text',
                        dimension: 'Income',
                        required: true,
                        codeName: '3',
                        forFamilyMember: false,
                        options: []
                      }
                    ]
                  }
                ]
              }
            } else if (param === 'draftId') {
              return 2
            }

            return null
          }),

          setParams: jest.fn()
        }
      })
      wrapper = shallow(<SocioEconomicQuestion {...props} />)
    })

    it('renders a TextInput for each text question for each family member', () => {
      expect(wrapper.find(TextInput)).toHaveLength(3)
    })

    it('sets the correct TextInput props', () => {
      expect(wrapper.find(TextInput).first()).toHaveProp({
        required: true,
        placeholder:
          'Please estimate your gross monthly household income (i.e, before taxes National Insurance contributions or other deductions)'
      })
    })

    it('navigates to next non-socio-economic screen after done with all questions', () => {
      wrapper
        .find(StickyFooter)
        .last()
        .props()
        .handleClick()

      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)

      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledWith(
        'BeginLifemap',
        expect.any(Object)
      )
    })
  })
})

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SocioEconomicQuestion {...props} />)
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
    expect(wrapper.instance().props.drafts[2]).toEqual({ draftId: 5 })
  })
  it('does not update screen if not focused', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    props = createTestProps({
      navigation: { ...props.navigation, isFocused: jest.fn(() => false) }
    })
    wrapper = shallow(<SocioEconomicQuestion {...props} />)
    expect(wrapper.instance().props.drafts[2]).toBeFalsy()
  })
})
