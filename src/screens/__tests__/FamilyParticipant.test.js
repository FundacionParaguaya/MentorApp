import React from 'react'
import { shallow } from 'enzyme'
import { FamilyParticipant } from '../lifemap/FamilyParticipant'
import Select from '../../components/Select'
import DateInput from '../../components/DateInput'
import TextInput from '../../components/TextInput'
import draft from '../__mocks__/draftMock.json'
import StickyFooter from '../../components/StickyFooter'

const survey = {
  id: 1,
  title: 'Dev Demo',
  survey_version_id: 2,
  surveyStoplightQuestions: [],
  surveyEconomicQuestions: [],
  surveyConfig: {
    surveyLocation: { country: 'BG' },
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
        value: 'O',
        otherOption: true
      }
    ],
    documentType: [
      {
        text: 'National Insurance Number',
        value: 'NATIONALINSURANCE',
        otherOption: false
      },
      {
        text: 'Organisation Reference Number',
        value: 'ORGANISATIONALREFERENCENUMBER',
        otherOption: false
      },
      {
        text: 'Other identification',
        value: 'OTHER',
        otherOption: true
      }
    ]
  }
}

const createTestProps = props => ({
  t: value => value,
  createDraft: jest.fn(),
  updateDraft: jest.fn(),
  deleteDraft: jest.fn(),
  addSurveyData: jest.fn(),
  navigation: {
    navigate: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'family') {
        return null
      } else if (param === 'survey') {
        return survey
      } else if (param === 'draft') {
        return draft
      } else if (param === 'readOnly') {
        return false
      } else {
        return 1
      }
    }),
    setParams: jest.fn(),
    reset: jest.fn(),
    isFocused: jest.fn()
  },
  drafts: [draft],
  env: 'development',
  user: {
    token: ''
  },
  ...props
})

describe('Family Participant View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyParticipant {...props} />)
    wrapper.instance().forceUpdate()
    wrapper.update()
  })

  describe('lifecycle', () => {
    describe('created from a draft', () => {
      beforeEach(() => {
        const props = createTestProps({
          navigation: {
            navigate: jest.fn(),
            getParam: jest.fn(param => {
              if (param === 'draft') {
                return draft
              } else if (param === 'survey') {
                return survey
              } else if (param === 'readOnly') {
                return false
              } else {
                return null
              }
            }),
            setParams: jest.fn(),
            reset: jest.fn(),
            isFocused: jest.fn()
          },
          ...props
        })
        wrapper = shallow(<FamilyParticipant {...props} />)
      })

      it('does not create a new draft on componentDidMount if such exists', () => {
        expect(wrapper.instance().props.createDraft).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('rendering', () => {
    it('renders the continue button with proper label', () => {
      console.log(wrapper.instance().state)
      expect(wrapper.find(StickyFooter)).toHaveProp({
        continueLabel: 'general.continue'
      })
    })
    it('renders TextInput', () => {
      expect(wrapper.find(TextInput)).toHaveLength(5)
    })
    it('renders Select', () => {
      expect(wrapper.find(Select)).toHaveLength(4)
    })
    it('renders DateInput', () => {
      expect(wrapper.find(DateInput)).toHaveLength(1)
    })

    it('country select has preselected default country', () => {
      expect(wrapper.find('#country')).toHaveProp({ value: 'Paraguay' })
    })

    it('sets proper TextInput value from draft', () => {
      const props = createTestProps({
        navigation: {
          isFocused: jest.fn(),
          navigate: jest.fn(),
          push: jest.fn(),
          getParam: jest.fn(param => {
            if (param === 'family') {
              return null
            } else if (param === 'survey') {
              return survey
            } else if (param === 'draft') {
              return draft
            } else if (param === 'readOnly') {
              return false
            } else {
              return 1
            }
          }),
          setParams: jest.fn(),
          reset: jest.fn()
        },
        ...props
      })
      wrapper = shallow(<FamilyParticipant {...props} />)
      wrapper.instance().forceUpdate()
      wrapper.update()

      expect(
        wrapper
          .find(TextInput)
          .first()
          .props().value
      ).toBe('Juan')
    })
  })

  describe('changing fields', () => {
    let props
    beforeEach(() => {
      props = createTestProps({
        navigation: {
          navigate: jest.fn(),
          push: jest.fn(),
          getParam: jest.fn(param => {
            if (param === 'family') {
              return null
            } else if (param === 'draft') {
              return draft
            } else {
              return 1
            }
          }),
          setParams: jest.fn(),
          reset: jest.fn(),
          isFocused: jest.fn()
        }
      })
      wrapper = shallow(<FamilyParticipant {...props} />)
    })
  })

  describe('functionality', () => {
    it('detects an error', () => {
      wrapper.instance().detectError(true, 'phoneNumber')
      expect(wrapper.instance().errorsDetected).toEqual(['phoneNumber'])
    })

    it('detects when the error is corrected', () => {
      wrapper.setState({ errorsDetected: ['phoneNumber'] })
      wrapper.instance().detectError(false, 'phoneNumber')
      expect(wrapper.instance().errorsDetected).toEqual([])
    })

    it('shows errors if detected', () => {
      wrapper.instance().errorsDetected = ['field']

      wrapper.instance().handleClick()

      expect(wrapper).toHaveState({ showErrors: true })
    })
  })
})

describe('participant adding/removing data', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps({
      navigation: {
        navigate: jest.fn(),
        push: jest.fn(),
        getParam: jest.fn(param => {
          if (param === 'draft') {
            return draft
          } else if (param === 'survey') {
            return survey
          } else {
            return null
          }
        }),
        setParams: jest.fn(),
        reset: jest.fn(),
        isFocused: jest.fn()
      },
      drafts: [
        {
          draftId: 4,
          surveyId: 1,
          progress: {
            current: 2,
            total: 40
          },
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
                lastName: 'Perez',
                gender: 'O',
                documentType: 'OTHER'
              },
              {
                firstName: 'Ana'
              }
            ]
          }
        }
      ]
    })
    wrapper = shallow(<FamilyParticipant {...props} />)
    wrapper.instance().forceUpdate()
    wrapper.update()
  })
  it('gives Select the proper value', () => {
    expect(wrapper.find('#familyMembersCount').props().value).toBe(2)
  })
})

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyParticipant {...props} />)
  })
  it('checks if screen is focused before updating', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      2
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
    wrapper = shallow(<FamilyParticipant {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
})
