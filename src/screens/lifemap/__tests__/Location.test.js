import { ActivityIndicator, Text, TouchableHighlight } from 'react-native'

import Geolocation from '../../../__mocks__/@react-native-community/geolocation.js'
/* eslint-disable import/named */
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
/* eslint-enable import/named */
import { Location } from '../Location'
import MapboxGL from '@react-native-mapbox-gl/maps'
import React from 'react'
import { shallow } from 'enzyme'

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

it('navigates to first socio economic screen on continue', () => {
  const updatedSurvey = {
    ...survey,
    surveyEconomicQuestions: [
      {
        questionText: 'Ingrese la zona en que vive',
        codeName: 'areaOfResidence'
      }
    ]
  }

  props = createTestProps({
    navigation: {
      ...navigation,
      getParam: jest.fn(param => {
        if (param === 'draftId') {
          return draftId
        } else if (param === 'survey') {
          return updatedSurvey
        }

        return null
      })
    }
  })

  wrapper = shallow(<Location {...props} />)
  wrapper.instance().onContinue()

  expect(props.navigation.navigate).toHaveBeenCalledWith(
    'SocioEconomicQuestion',
    {
      survey: updatedSurvey,
      draftId
    }
  )
})

it('navigates to lifemap if no socio economic screens on continue', () => {
  wrapper.instance().onContinue()
  expect(props.navigation.navigate).toHaveBeenCalledWith('BeginLifemap', {
    survey,
    draftId
  })
})

it('requests user location permision on mount', () => {
  const spy = jest.spyOn(wrapper.instance(), 'requestLocationPermission')

  wrapper.instance().componentDidMount()
  expect(spy).toHaveBeenCalledTimes(1)
})

describe('loading...', () => {
  it('shows only ActivityIndicator', () => {
    expect(wrapper.find(ActivityIndicator)).toHaveLength(1)
    expect(wrapper.find(MapboxGL.MapView)).toHaveLength(0)
  })

  it('show getting location message only when actually getting location', () => {
    expect(wrapper.find(Text)).toHaveHTML(
      '<react-native-mock>views.family.gettingYourLocation</react-native-mock>'
    )

    wrapper.setProps({})

    expect(wrapper.find(Text)).toHaveLength(1)
  })
})

describe('user is online', () => {
  beforeEach(() => {
    wrapper.instance().determineScreenState(true)
  })

  it('shows map with user location if device location is available', () => {
    expect(wrapper.find(MapboxGL.MapView)).toHaveLength(1)
    expect(wrapper.find(MapboxGL.Camera)).toHaveLength(1)
  })

  it('updates draft with device location', () => {
    expect(props.updateDraft).toHaveBeenCalledWith({
      ...draft,
      familyData: {
        ...draft.familyData,
        latitude: 44,
        longitude: 45,
        accuracy: 15
      }
    })
  })

  it('shows list of available cached maps if one is available and locations is not', () => {
    Geolocation.getCurrentPosition.mockImplementationOnce((callback, error) =>
      error()
    )
  })

  it('set user location to survey default if both location and cached maps are unavailable', () => {
    Geolocation.getCurrentPosition.mockImplementationOnce((callback, error) =>
      error()
    )

    expect(props.updateDraft).toHaveBeenCalledWith({
      ...draft,
      familyData: {
        ...draft.familyData,
        latitude: 10,
        longitude: 11,
        accuracy: 0
      }
    })
  })

  it('allows user to serch for location', () => {
    const searchBar = wrapper.find(GooglePlacesAutocomplete)

    expect(searchBar).toHaveLength(1)

    searchBar
      .props()
      .onPress({}, { geometry: { location: { lat: 4, lng: -1 } } })

    wrapper
      .instance()
      .goToSearch({}, { geometry: { location: { lat: 4, lng: -1 } } })

    expect(props.updateDraft).toHaveBeenCalledWith({
      ...draft,
      familyData: {
        ...draft.familyData,
        latitude: 4,
        longitude: -1
      }
    })
  })
})

describe('user is offline', () => {
  beforeEach(() => {
    const surveyWithMaps = {
      ...survey,
      surveyConfig: {
        ...survey.surveyConfig,
        offlineMaps: [
          { name: 'Test Location', from: [1, 1], to: [3, 3], center: [2, 2] },
          { name: 'Test Place', from: [4, 1], to: [6, 6], center: [5, 5] }
        ]
      }
    }

    props = createTestProps({
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'draftId') {
            return draftId
          } else if (param === 'survey') {
            return surveyWithMaps
          }

          return null
        })
      }
    })
    wrapper = shallow(<Location {...props} />)

    wrapper.instance().determineScreenState(false)
  })
  it('shows list of available cached maps', () => {
    const buttons = wrapper.find(TouchableHighlight)

    expect(wrapper).toHaveState({ showOfflineMapsList: true })
    expect(buttons).toHaveLength(3)

    expect(buttons.first().find(Text)).toHaveHTML(
      '<react-native-mock>Test Location</react-native-mock>'
    )
  })

  it('give option to user for location not listed', () => {
    const spy = jest.spyOn(wrapper.instance(), 'getCoordinatesOffline')

    wrapper
      .find(TouchableHighlight)
      .last()
      .props()
      .onPress()

    expect(wrapper).toHaveState({
      hasShownList: true,
      showSearch: false
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('shows a cached map if user has selected one', () => {
    wrapper
      .find(TouchableHighlight)
      .first()
      .props()
      .onPress()

    expect(wrapper).toHaveState({
      hasShownList: true,
      loading: false,
      centeringMap: false,
      showForm: false,
      showSearch: false,
      showOfflineMapsList: false
    })

    expect(props.updateDraft).toHaveBeenCalledWith({
      ...draft,
      familyData: {
        ...draft.familyData,
        latitude: 2,
        longitude: 2
      }
    })
  })
})

describe('user offline with no cached maps', () => {
  beforeEach(() => {
    wrapper.instance().determineScreenState(false)
  })

  it('shows form if not cached maps available', () => {})

  it('informs user if app has located them or not', () => {})

  it('allows user to edit each field on offline form', () => {})
})

describe('resuming a draft', () => {
  beforeEach(() => {
    props = createTestProps({
      drafts: [
        {
          ...draft,
          familyData: { ...draft.familyData, latitude: -5, longitude: 70 }
        }
      ]
    })
    wrapper = shallow(<Location {...props} />)

    wrapper.instance().determineScreenState(true)
  })
  it('sets draft to saved location', () => {
    expect(wrapper.find(MapboxGL.Camera)).toHaveProp({
      centerCoordinate: [70, -5]
    })
  })
})

describe('readonly mode', () => {})
