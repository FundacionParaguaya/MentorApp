import React from 'react'
import { shallow } from 'enzyme'
import { Location } from '../lifemap/Location'
import SearchBar from '../../components/SearchBar'
import StickyFooter from '../../components/StickyFooter'

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
  nav: {
    draftId: 4,
    survey: {
      surveyId: 100,
      surveyConfig: { surveyLocation: { country: 'BG' } }
    }
  },
  navigation: {
    navigate: jest.fn(),
    replace: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'draftId') {
        return 2
      } else if (param === 'survey') {
        return
      }

      return null
    }),
    isFocused: jest.fn(() => true)
  },
  addSurveyData: jest.fn(),
  addDraftProgress: jest.fn(),
  ...props
})

describe('Family Location component', () => {
  let wrapper
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<Location {...props} />)
  })
  it('renders the continue button with proper label', () => {
    expect(wrapper.find(StickyFooter)).toHaveProp({
      continueLabel: 'general.continue'
    })
  })
  describe('offline', () => {
    it('edits draft in field change', () => {
      wrapper
        .find('#postCode')
        .props()
        .onChangeText('123', 'postCode')

      wrapper
        .find('#address')
        .props()
        .onChangeText('Foo', 'address')

      expect(wrapper.instance().props.addSurveyData).toHaveBeenCalledTimes(2)
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
        longitude: -25.8976,
        latitude: -22.2521
      })
    })

    it('shows GPS accuracy range', () => {
      expect(wrapper.find('#accuracy')).toHaveHTML(
        '<react-native-mock>views.family.gpsAccurate</react-native-mock>'
      )
      expect(wrapper).toHaveState({
        accuracy: 100
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
            progress: {
              current: 2,
              total: 40
            },
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
        longitude: -25.8976,
        latitude: -22.2521
      })
    })

    it('doesn not look for device location if there is one from draft', () => {
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
