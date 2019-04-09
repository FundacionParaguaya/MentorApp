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
        latitude: 30,
        longitude: 30
      })
    })

    it("doesn't look for device location if there is one from draft", () => {
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

  it('country select has preselected default country', () => {
    expect(wrapper.find('#countrySelect')).toHaveProp({ value: 'BG' })
  })

  it('navigates to SocioEconomicQuestion with proper params', () => {
    wrapper
      .find(StickyFooter)
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
})
