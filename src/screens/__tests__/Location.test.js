import React from 'react'
import { shallow } from 'enzyme'
import { ActivityIndicator, Text } from 'react-native'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
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
    readonly: false,
    draftId: 4,
    survey: {
      surveyEconomicQuestions: [],
      surveyStoplightQuestions: [],
      title: 'Chile - Geco',
      surveyId: 100,
      surveyConfig: {
        surveyLocation: { country: 'BG', latitude: 10, longitude: 11 }
      }
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
  describe('loading state', () => {
    it('shows ActivityIndicator', () => {
      expect(wrapper.find(ActivityIndicator)).toHaveLength(1)
    })

    it('show getting location message only when actually getting location', () => {
      expect(wrapper.find(Text)).toHaveHTML(
        '<react-native-mock>views.family.gettingYourLocation</react-native-mock>'
      )

      wrapper.setProps({ nav: { readonly: true } })

      expect(wrapper.find(Text)).toHaveLength(0)
    })
  })
  describe('showing the map', () => {
    beforeEach(() => {
      wrapper.instance().getDeviceCoordinates(true)
    })

    it('shows form when out of boundries for offline map', () => {
      wrapper.instance().getDeviceCoordinates(false)
      expect(wrapper.find(MapboxGL.MapView)).toHaveLength(0)
    })
  })
  describe('showing the form instead of the map', () => {
    beforeEach(() => {
      props = createTestProps({
        nav: {
          readonly: false,
          draftId: 4,
          survey: {
            surveyEconomicQuestions: [],
            surveyStoplightQuestions: [],
            surveyId: 100,
            surveyConfig: {
              surveyLocation: { country: 'BG', latitude: 10, longitude: 11 }
            }
          }
        }
      })
      wrapper = shallow(<Location {...props} />)
      wrapper.instance().getDeviceCoordinates(false)
      wrapper.setState({ showForm: true })
    })
  })
  describe('reviewing family location', () => {
    beforeEach(() => {
      props = createTestProps({
        nav: {
          readonly: true,
          draftId: 4,
          survey: {
            title: 'Chile - Geco',
            surveyId: 100,
            surveyConfig: {
              surveyLocation: { country: 'BG', latitude: 10, longitude: 11 }
            }
          }
        }
      })
      wrapper = shallow(<Location {...props} />)
    })
  })
})
