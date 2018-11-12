import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, View, TextInput } from 'react-native'
import { FamilyParticipant } from '../lifemap/FamilyParticipant'
import Button from '../../components/Button'

const createTestProps = props => ({
  createDraft: jest.fn(),
  addSurveyData: jest.fn(),
  navigation: {
    navigate: jest.fn(),
    getParam: param => (param === 'draft' ? null : 1)
  },
  drafts: [
    {
      draft_id: 4,
      survey_id: 2,
      personal_survey_data: {
        firstName: 'Jane',
        lastName: 'Doe',
        documentNumber: '5468568',
        email: 'jane@doe.com',
        phone: '40965035',
        gender: 'F'
      },
      economic_survey_data: {
        familyCar: 'Yes'
      },
      indicator_survey_data: {
        income: 'GREEN'
      }
    }
  ],
  surveys: [
    {
      id: 1,
      title: 'Dev Demo',
      survey_version_id: 2,
      survey_schema: {
        title: 'Stoplight survey example with defaults',
        description: 'A simple stoplight survey example with default values.',
        properties: {
          gender: {
            type: 'string',
            title: {
              es: 'Enter your gender'
            },
            default: 'F',
            enum: ['F', 'M', 'O'],
            enumNames: [
              'Female',
              'Male',
              'Another gender identity or Prefer not to disclose'
            ]
          },
          familyCar: {
            type: 'string',
            title: {
              es: 'Does your family have a car or truck?'
            },
            enum: ['Yes', 'No'],
            enumNames: ['Yes', 'No']
          },
          income: {
            type: 'array',
            title: {
              es: 'Income'
            },
            description: {
              es: 'We have enough income'
            },
            default: [
              {
                url:
                  'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/1.jpg',
                value: 'GREEN',
                description: 'My family’s income is above the poverty line.'
              }
            ],
            items: {
              type: 'object',
              enum: [
                {
                  url:
                    'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/1.jpg',
                  value: 'GREEN',
                  description: 'My family’s income is above the poverty line.'
                },
                {
                  url:
                    'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/2.jpg',
                  value: 'YELLOW',
                  description:
                    'My family’s income is below the total poverty line but above the extreme poverty line.'
                },
                {
                  url:
                    'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/3.jpg',
                  value: 'RED',
                  description:
                    'My family’s income is below the extreme poverty line.'
                },
                {
                  url: 'NONE',
                  value: 'NONE',
                  description: ''
                }
              ],
              properties: null
            }
          }
        },

        type: 'object',
        dependencies: null
      },
      survey_ui_schema: {
        properties: {},
        'ui:order': ['gender', 'income', 'familyCar'],
        'ui:group:personal': ['gender'],
        'ui:group:economics': ['familyCar'],
        'ui:group:indicators': ['income'],
        'ui:custom:fields': {}
      }
    },
    {
      id: 2,
      title: 'Other survey 2',
      survey_version_id: 2,
      survey_schema: {
        title: 'Stoplight survey example with defaults',
        description: 'A simple stoplight survey example with default values.',
        properties: {
          gender: {
            type: 'string',
            title: {
              es: 'Enter your gender'
            },
            default: 'F',
            enum: ['F', 'M', 'O'],
            enumNames: [
              'Female',
              'Male',
              'Another gender identity or Prefer not to disclose'
            ]
          },
          familyCar: {
            type: 'string',
            title: {
              es: 'Does your family have a car or truck?'
            },
            enum: ['Yes', 'No'],
            enumNames: ['Yes', 'No']
          },
          income: {
            type: 'array',
            title: {
              es: 'Income'
            },
            description: {
              es: 'We have enough income'
            },
            default: [
              {
                url:
                  'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/1.jpg',
                value: 'GREEN',
                description: 'My family’s income is above the poverty line.'
              }
            ],
            items: {
              type: 'object',
              enum: [
                {
                  url:
                    'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/1.jpg',
                  value: 'GREEN',
                  description: 'My family’s income is above the poverty line.'
                },
                {
                  url:
                    'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/2.jpg',
                  value: 'YELLOW',
                  description:
                    'My family’s income is below the total poverty line but above the extreme poverty line.'
                },
                {
                  url:
                    'https://s3.us-east-2.amazonaws.com/fp-psp-images/usa/california/1/3.jpg',
                  value: 'RED',
                  description:
                    'My family’s income is below the extreme poverty line.'
                },
                {
                  url: 'NONE',
                  value: 'NONE',
                  description: ''
                }
              ],
              properties: null
            }
          }
        },

        type: 'object',
        dependencies: null
      },
      survey_ui_schema: {
        properties: {},
        'ui:order': ['gender', 'income'],
        'ui:group:personal': ['gender'],
        'ui:group:economics': [],
        'ui:group:indicators': ['income'],
        'ui:custom:fields': {}
      }
    }
  ],
  env: 'development',
  user: {
    token: ''
  },
  ...props
})

describe('Family Participant View', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<FamilyParticipant {...props} />)
  })
  describe('lifecycle', () => {
    describe('no saved draft', () => {
      it('creates universally unique draft identifier if there is no draft_id', () => {
        const draft = {}
        expect(wrapper.instance().draft_id).toEqual(
          expect.stringMatching(/[a-z0-9_.-].*/)
        )
      })

      it('sets proper survey_id when there is no draft', () => {
        expect(wrapper.instance().survey_id).toBe(1)
      })

      it('sets survey with survey_schema and survey_ui_schema', () => {
        expect(wrapper.instance().survey.id).toBe(1)
        expect(wrapper.instance().survey.title).toBe('Dev Demo')
        expect(wrapper.instance().survey.survey_schema).toEqual(
          expect.any(Object)
        )
        expect(wrapper.instance().survey.survey_ui_schema).toEqual(
          expect.any(Object)
        )
      })

      it('creates a new draft on componentDidMount if such does not exist', () => {
        expect(wrapper.instance().props.createDraft).toHaveBeenCalledTimes(1)
      })
    })

    describe('created from a draft', () => {
      beforeEach(() => {
        const props = createTestProps({
          navigation: {
            navigate: jest.fn(),
            getParam: param => (param === 'draft' ? 4 : 1)
          },
          ...props
        })
        wrapper = shallow(<FamilyParticipant {...props} />)
      })

      it('sets draft_id', () => {
        expect(wrapper.instance().draft_id).toBe(4)
      })

      it('sets proper survey_id when there is a draft', () => {
        expect(wrapper.instance().survey_id).toBe(2)
      })

      it('does not create a new draft on componentDidMount if such exists', () => {
        expect(wrapper.instance().props.createDraft).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('rendering', () => {
    it('renders base ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })

    it('renders continue draft button', () => {
      expect(wrapper.find(Button)).toHaveLength(1)
    })

    // it('sets proper TextInput value from draft', () => {
    //   const props = createTestProps({
    //     navigation: {
    //       navigate: jest.fn(),
    //       getParam: param => (param === 'draft' ? 4 : 1)
    //     },
    //     ...props
    //   })
    //   wrapper = shallow(<Draft {...props} />)
    //
    //   expect(wrapper.find(TextInput).props().value).toBe('F')
    // })
  })

  describe('functionality', () => {
    // it('calls storeDraftItem onChange', () => {
    //   const spy = jest.spyOn(wrapper.instance(), 'storeDraftItem')
    //
    //   wrapper
    //     .find(TextInput)
    //     .first()
    //     .props()
    //     .onChangeText('M')
    //
    //   expect(spy).toHaveBeenCalledTimes(1)
    //
    //   wrapper
    //     .find(TextInput)
    //     .last()
    //     .props()
    //     .onChangeText('No')
    //
    //   expect(spy).toHaveBeenCalledTimes(2)
    //
    //   wrapper
    //     .find(Picker)
    //     .props()
    //     .onValueChange()
    //
    //   expect(spy).toHaveBeenCalledTimes(3)
    // })
    it('calls navigator function on pressing Continue button', () => {
      wrapper
        .find(Button)
        .props()
        .handleClick()
      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
    })
  })
})
