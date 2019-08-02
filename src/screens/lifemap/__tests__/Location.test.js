import { ActivityIndicator, Text } from 'react-native'

import { Location } from '../Location'
import MapboxGL from '@react-native-mapbox-gl/maps'
import React from 'react'
import { shallow } from 'enzyme'

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

const survey = {
  surveyEconomicQuestions: [],
  surveyStoplightQuestions: [],
  title: 'Chile - Geco',
  surveyId: 100,
  surveyConfig: {
    surveyLocation: { country: 'BG', latitude: 10, longitude: 11 }
  }
}

const draftId = 1

const draft = {
  draftId,
  progress: { screen: 'FamilyParticipant', total: 5 },
  familyData: {
    countFamilyMembers: 1,
    country: 'BG',
    familyMembersList: [
      {
        firstName: 'Juan',
        lastName: 'Perez',
        documentNumber: '123456',
        documentType: '0',
        email: 'juan@gmail.com',
        birthCountry: 'PY',
        gender: 'M',
        birthDate: 12345,
        firstParticipant: true,
        socioEconomicAnswers: [
          { key: 'educationPersonMostStudied', value: 'SCHOOL-COMPLETE' },
          { key: 'receiveStateIncome', value: 'NO' }
        ]
      }
    ]
  }
}

const navigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  setParams: jest.fn(),
  getParam: jest.fn(param => {
    if (param === 'draftId') {
      return draftId
    } else if (param === 'survey') {
      return survey
    }

    return null
  }),
  isFocused: jest.fn(() => true)
}

const createTestProps = props => ({
  drafts: [draft, { draftId: 2 }],
  t: value => value,
  navigation,
  updateDraft: jest.fn(),
  ...props
})

let wrapper
let props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<Location {...props} />)
})

it('receives proper survey from navigation', () => {
  expect(wrapper.instance().survey).toBe(survey)
})

it('receives proper draftId from navigation', () => {
  expect(wrapper.instance().draftId).toBe(draftId)
})

it('gets proper draft from draftId', () => {
  expect(wrapper.instance().getDraft()).toBe(draft)
})

it('updates only when focused', () => {
  expect(wrapper.instance().shouldComponentUpdate()).toEqual(true)
})

it('navigates back to participant screen if only 1 family member in draft', () => {
  wrapper.instance().onPressBack()
  expect(props.navigation.navigate).toHaveBeenCalledWith('FamilyParticipant', {
    survey,
    draftId
  })
})

it('navigates back to family members screen if multiple family members in draft', () => {
  props = createTestProps({
    drafts: [
      { ...draft, familyData: { ...draft.familyData, countFamilyMembers: 2 } }
    ]
  })
  wrapper = shallow(<Location {...props} />)
  wrapper.instance().onPressBack()
  expect(props.navigation.navigate).toHaveBeenCalledWith('FamilyMembersNames', {
    survey,
    draftId
  })
})

it('sets draft navigation when navigation from a different page', () => {
  expect(props.updateDraft).toHaveBeenCalledWith({
    ...draft,
    progress: {
      ...draft.progress,
      screen: 'Location'
    }
  })
})

describe('loading...', () => {
  it('shows ActivityIndicator', () => {
    expect(wrapper.find(ActivityIndicator)).toHaveLength(1)
  })

  it('show getting location message only when actually getting location', () => {
    expect(wrapper.find(Text)).toHaveHTML(
      '<react-native-mock>views.family.gettingYourLocation</react-native-mock>'
    )

    wrapper.setProps({})

    expect(wrapper.find(Text)).toHaveLength(1)
  })
})
describe('showing the map', () => {
  beforeEach(() => {
    wrapper.instance().getDeviceCoordinates(true)
  })

  it('shows form when out of boundries for offline map', () => {
    wrapper.instance().getDeviceCoordinates(false)
    expect(wrapper.find(MapboxGL.MapView)).toHaveLength(1)
  })
})
describe('showing the form instead of the map', () => {
  beforeEach(() => {
    props = createTestProps({})
    wrapper = shallow(<Location {...props} />)
    wrapper.instance().getDeviceCoordinates(false)
    wrapper.setState({ showForm: true })
  })
})
describe('readonly mode', () => {})
