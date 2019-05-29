import React from 'react'
import { shallow } from 'enzyme'
import { SocioEconomicQuestion } from '../lifemap/SocioEconomicQuestion'
import Select from '../../components/Select'
import TextInput from '../../components/TextInput'
import data from '../__mocks__/fake-socio-economic-data.json'
import StickyFooter from '../../components/StickyFooter'

const draft = {
  draftId: 2,
  surveyId: 1,
  economicSurveyDataList: [
    { key: 'educationPersonMostStudied', value: 'SCHOOL-COMPLETE' }
  ],
  indicatorSurveyDataList: [],
  familyData: {
    countFamilyMembers: 2,
    familyMembersList: [
      {
        firstName: 'Juan',
        lastName: 'Perez',
        socioEconomicAnswers: [{ key: '1', value: 'MENTAL' }]
      },
      {
        firstName: 'Ana',
        gender: 'F',
        birthDate: 1515708000
      }
    ]
  },
  progress: { screen: 'Question', current: 3 }
}

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    push: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'survey') {
        return data
      } else if (param === 'draft') {
        return draft
      }
    }),
    setParams: jest.fn(),
    isFocused: jest.fn(() => true)
  },
  drafts: [draft],
  addSurveyData: jest.fn(),
  addDraftProgress: jest.fn(),
  addSurveyFamilyMemberData: jest.fn(),
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
      ).toHaveBeenCalledTimes(3)

      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledWith({ onPressBack: expect.any(Function) })
    })
  })

  describe('after data is set', () => {
    beforeEach(() => {
      props = createTestProps({
        navigation: {
          push: jest.fn(),
          navigate: jest.fn(),
          isFocused: jest.fn(() => true),
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
                      }
                    ],
                    forFamilyMember: []
                  }
                ]
              }
            }
            if (param === 'survey') {
              return data
            } else if (param === 'draft') {
              return draft
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
      expect(wrapper.find(Select)).toHaveLength(1)
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

    it('gets family member field value', () => {
      expect(
        wrapper.instance().getFieldValue(draft, 'educationPersonMostStudied')
      ).toEqual('SCHOOL-COMPLETE')

      expect(wrapper.instance().getFieldValue(draft, '3')).toEqual(undefined)
    })

    it('gets non family member field value', () => {
      expect(
        wrapper.instance().getFamilyMemberFieldValue(draft, '1', 0)
      ).toEqual('MENTAL')

      expect(
        wrapper.instance().getFamilyMemberFieldValue(draft, '3', 0)
      ).toEqual(undefined)
    })

    it('adds survey data on field change', () => {
      wrapper
        .find(Select)
        .first()
        .props()
        .onChange('PHYSICAL', 'health')

      expect(wrapper.instance().props.addSurveyData).toHaveBeenCalledWith(
        2,
        'economicSurveyDataList',
        { health: 'PHYSICAL' }
      )
    })

    it('displays errors on submit', () => {
      wrapper
        .find(Select)
        .first()
        .props()
        .detectError(true, 'field')

      wrapper.instance().submitForm()
      expect(wrapper).toHaveState({ showErrors: true })
    })

    it('removes fixed error messages', () => {
      wrapper
        .find(Select)
        .first()
        .props()
        .detectError(true, 'field')

      wrapper.instance().submitForm()

      wrapper
        .find(Select)
        .first()
        .props()
        .detectError(false, 'field')

      expect(wrapper.instance().errorsDetected).toEqual([])
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
                          'Is there any member with disabilities in your household? Please indicate the disability type',
                        answerType: 'select',
                        dimension: 'Family details',
                        required: false,
                        forFamilyMember: false,
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
                        questionText: 'Please state household income',
                        answerType: 'text',
                        dimension: 'Income',
                        required: false,
                        codeName: '4',
                        forFamilyMember: false,
                        options: []
                      }
                    ]
                  }
                ]
              }
            } else if (param === 'draft') {
              return draft
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
        required: false,
        placeholder: 'Please state household income'
      })
    })

    it('handles per family member questions value change', () => {
      const input = wrapper.find(TextInput).last()
      const select = wrapper.find(Select).first()

      expect(input).toHaveProp({
        required: true,
        placeholder:
          'Please estimate your gross monthly household income (i.e, before taxes National Insurance contributions or other deductions)'
      })

      expect(select).toHaveProp({
        required: false,
        placeholder:
          'Is there any member with disabilities in your household? Please indicate the disability type'
      })

      const spy = jest.spyOn(wrapper.instance(), 'addSurveyFamilyMemberData')

      input.props().onChangeText('test', 'familyIncome')

      expect(spy).toHaveBeenCalledWith('test', 'familyIncome', 1)

      select.props().onChange('PHYSICAL', 'health')

      expect(spy).toHaveBeenCalledWith('PHYSICAL', 'health', 0)
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
      nav: { ...props.nav, draftId: 5 }
    })
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      1
    )
  })

  it('does not update screen if not focused', () => {
    wrapper.setProps({
      test: true
    })
    props = createTestProps({
      navigation: { ...props.navigation, isFocused: jest.fn(() => false) }
    })
    wrapper = shallow(<SocioEconomicQuestion {...props} />)
    expect(props.test).toBeFalsy()
  })
})
