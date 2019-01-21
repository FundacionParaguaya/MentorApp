import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import MapView from 'react-native-maps'
import { Location } from '../lifemap/Location'
import SearchBar from '../../components/SearchBar'

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
    getParam: param =>
      param === 'draftId'
        ? 2
        : {
            surveyId: 100,
            surveyConfig: { surveyLocation: { country: 'BG' } }
          },
    isFocused: jest.fn(() => true)
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
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<Location {...props} />)
  })
  describe('offline', () => {
    it('renders base ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })

    it('edits draft in field change', () => {
      wrapper
        .find('#postCode')
        .props()
        .onChangeText('123', 'postCode')

      wrapper
        .find('#address')
        .props()
        .onChangeText('Foo', 'address')

      expect(wrapper.instance().props.addSurveyData).toHaveBeenCalledTimes(5)
    })
  })

  describe('online', () => {
    beforeEach(() => {
      const props = createTestProps()
      wrapper = shallow(<Location {...props} />)
      wrapper.setState({ showMap: true })
    })
    it('gets device location', () => {
      expect(wrapper).toHaveState({
        latitude: 44,
        longitude: 45
      })
    })

    it('renders MapView', () => {
      expect(wrapper.find(MapView)).toHaveLength(1)
    })

    it('updates Marker state after draging has finished', () => {
      // initial map load
      wrapper
        .find(MapView)
        .first()
        .props()
        .onRegionChangeComplete()

      // actual drag
      wrapper
        .find(MapView)
        .first()
        .props()
        .onRegionChangeComplete({
          latitude: 50,
          longitude: 50
        })

      expect(wrapper).toHaveState({
        latitude: 50,
        longitude: 50
      })
    })

    it('shows GPS accuracy range', () => {
      expect(wrapper.find('#accuracy')).toHaveHTML(
        '<react-native-mock>views.family.gpsAccurate</react-native-mock>'
      )
      expect(wrapper).toHaveState({
        accuracy: 15
      })
    })

    it('can search for address', () => {
      const spy = jest.spyOn(wrapper.instance(), 'searcForAddress')

      wrapper
        .find(SearchBar)
        .props()
        .onChangeText('Sofia')

      expect(wrapper).toHaveState({
        searchAddress: 'Sofia'
      })

      wrapper
        .find(SearchBar)
        .props()
        .onSubmit()

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('centers the map on device location', () => {
      wrapper
        .find('#centerMap')
        .props()
        .onPress()

      expect(wrapper).toHaveState({
        latitude: 44,
        longitude: 45
      })
    })
  })

  it('navigates to SocioEconomicQuestion with proper params', () => {
    wrapper
      .find('#continue')
      .props()
      .handleClick()

    expect(wrapper.instance().props.navigation.replace).toHaveBeenCalledWith(
      'SocioEconomicQuestion',
      {
        draftId: 2,
        survey: {
          surveyId: 100,
          surveyConfig: { surveyLocation: { country: 'BG' } }
        }
      }
    )
  })
  it('detects errors', () => {
    wrapper
      .find('#countrySelect')
      .props()
      .detectError(true, 'select')

    expect(wrapper).toHaveState({
      errorsDetected: ['select']
    })

    wrapper
      .find('#countrySelect')
      .props()
      .detectError(false, 'select')

    expect(wrapper).toHaveState({
      errorsDetected: []
    })
  })

  describe('with saved location', () => {
    beforeEach(() => {
      const props = createTestProps({
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
              latitude: 30,
              longitude: 30,
              countFamilyMembers: 2,
              familyMembersList: [{}]
            }
          }
        ]
      })
      wrapper = shallow(<Location {...props} />)
    })

    it('sets proper state', () => {
      expect(wrapper).toHaveState({
        latitude: 30,
        longitude: 30
      })
    })

    it('doesn\'t look for device location if there is one from draft', () => {
      const spy = jest.spyOn(wrapper.instance(), 'getDeviceLocation')

      expect(spy).toHaveBeenCalledTimes(0)
    })
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
    wrapper = shallow(<Location {...props} />)
  })
  it('checks if screen is focused before updating', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      6
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
    wrapper = shallow(<Location {...props} />)
    expect(wrapper.instance().props.drafts[2]).toBeFalsy()
  })
})
