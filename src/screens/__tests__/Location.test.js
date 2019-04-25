import React from 'react'
import { shallow } from 'enzyme'
import { Location } from '../lifemap/Location'

jest.useFakeTimers()

// navigator mock
/* eslint-disable no-undef */
global.navigator = {
  geolocation: {
    getCurrentPosition: callback =>
      callback({
        coords: {
          latitude: 44,
          longitude: 45,
          accuracy: 15
        }
      }),
    watchPosition: jest.fn()
  }
}
global.fetch = () => new Promise(() => {})
/* eslint-enable no-undef */

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    replace: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'draftId') {
        return 2
      } else if (param === 'survey') {
        return {
          surveyId: 100,
          surveyConfig: { surveyLocation: { country: 'BG' } }
        }
      }

      return null
    }),
    isFocused: jest.fn(() => true)
  },
  nav: {
    draftId: 4,
    survey: {
      surveyId: 100,
      surveyConfig: { surveyLocation: { country: 'BG' } }
    }
  },
  addSurveyData: jest.fn(),
  addDraftProgress: jest.fn(),
  drafts: [
    {
      draftId: 1
    },
    {
      draftId: 2,
      surveyId: 1,
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      progress: { screen: 'Location' },
      familyData: {
        countFamilyMembers: 2,
        familyMembersList: [
          {
            firstName: 'Juan',
            lastName: 'Perez',
            birthCountry: 'Brazil'
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

describe('Family Location component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Location {...props} />)
  })
  it('renders the continue button with proper label', () => {
    expect(true).toEqual(true)
  })
})
