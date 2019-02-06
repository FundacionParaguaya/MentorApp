import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import { Overview } from '../lifemap/Overview'
import Button from '../../components/Button'
import Tip from '../../components/Tip'
import LifemapVisual from '../../components/LifemapVisual'
import LifemapOverview from '../../components/LifemapOverview'
import BottomModal from '../../components/BottomModal'

const createTestProps = props => ({
  t: value => value,
  addDraftProgress: jest.fn(),
  navigation: {
    navigate: jest.fn(),
    isFocused: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'draftId') {
        return 1
      }
      if (param === 'survey') {
        return {
          id: 2,
          title: 'Other survey',
          minimumPriorities: 5,
          surveyStoplightQuestions: [
            { phoneNumber: 'phoneNumber' },
            { education: 'education' },
            { c: 'c' }
          ]
        }
      }
    })
  },
  drafts: [
    {
      draftId: 1,
      priorities: [{ action: 'Some action' }],
      achievements: [],
      progress: { screen: 'Location' },
      indicatorSurveyDataList: [
        { key: 'phoneNumber', value: 3 },
        { key: 'education', value: 1 },
        { key: 'ind', value: 1 },
        { key: 'Other ind', value: 2 },
        { key: 'Skipped', value: 0 }
      ]
    }
  ],

  ...props
})

describe('Overview', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Overview {...props} />)
  })
  describe('rendering', () => {
    it('renders ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders LifemapVisual', () => {
      expect(wrapper.find(LifemapVisual)).toHaveLength(1)
    })
    it('renders LifemapOverview', () => {
      expect(wrapper.find(LifemapOverview)).toHaveLength(1)
    })
    it('renders Tip', () => {
      expect(wrapper.find(Tip)).toHaveLength(1)
    })
    it('does not render Tip when no priorities can be added (all indicators are green)', () => {
      const props = createTestProps({
        drafts: [
          {
            draftId: 1,
            priorities: [{ action: 'Some action' }],
            achievements: [],
            indicatorSurveyDataList: [{ key: 'phoneNumber', value: 3 }],
            progress: { screen: 'Location' }
          }
        ]
      })
      wrapper = shallow(<Overview {...props} />)
      expect(wrapper.find(Tip)).toHaveLength(0)
    })
  })

  describe('functionality', () => {
    it('passes the correct survey data to lifemap overview', () => {
      expect(wrapper.find(LifemapOverview).props().surveyData).toEqual([
        { phoneNumber: 'phoneNumber' },
        { education: 'education' },
        { c: 'c' }
      ])
    })
    it('passes the correct draft data to lifemap overview', () => {
      expect(wrapper.find(LifemapOverview).props().draftData).toEqual({
        draftId: 1,
        priorities: [{ action: 'Some action' }],
        achievements: [],
        progress: { screen: 'Location' },
        indicatorSurveyDataList: [
          { key: 'phoneNumber', value: 3 },
          { key: 'education', value: 1 },
          { key: 'ind', value: 1 },
          { key: 'Other ind', value: 2 },
          { key: 'Skipped', value: 0 }
        ]
      })
    })

    it('resumes the draft when Resume is clicked', () => {
      props = createTestProps({
        navigation: {
          navigate: jest.fn(),
          isFocused: jest.fn(),
          setParams: jest.fn(),
          replace: jest.fn(),
          getParam: jest.fn(param => {
            if (param === 'draftId') {
              return 1
            }
            if (param === 'survey') {
              return {
                id: 2,
                title: 'Other survey',
                minimumPriorities: 5,
                surveyStoplightQuestions: [
                  { phoneNumber: 'phoneNumber' },
                  { education: 'education' },
                  { c: 'c' }
                ]
              }
            }
            if (param === 'resumeDraft') {
              return true
            }
          })
        }
      })
      wrapper = shallow(<Overview {...props} />)

      wrapper
        .find('#resume-draft')
        .props()
        .handleClick()
      expect(props.navigation.replace).toHaveBeenCalledTimes(1)
      expect(props.navigation.replace).toHaveBeenCalledWith('Location', {
        draftId: 1,
        socioEconomics: undefined,
        step: undefined,
        survey: {
          id: 2,
          minimumPriorities: 5,
          surveyStoplightQuestions: [
            { phoneNumber: 'phoneNumber' },
            { education: 'education' },
            { c: 'c' }
          ],
          title: 'Other survey'
        }
      })
    })
  })
})

describe('Render optimization', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Overview {...props} />)
  })
  it('checks if screen is focused before updating', () => {
    wrapper.setProps({
      drafts: [...wrapper.instance().props.drafts, { draftId: 5 }]
    })
    expect(wrapper.instance().props.navigation.isFocused).toHaveBeenCalledTimes(
      1
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
    wrapper = shallow(<Overview {...props} />)
    expect(wrapper.instance().props.drafts[1]).toBeFalsy()
  })
  it('calls setParam on mount', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      1
    )
  })
  it('calls addDraftProgress on mount', () => {
    expect(wrapper.instance().props.addDraftProgress).toHaveBeenCalledTimes(1)
  })

  it('navigates back to skipped screen if there are skipped questions', () => {
    wrapper.instance().onPressBack()

    expect(props.navigation.navigate).toHaveBeenCalledWith('Skipped', {
      draftId: 1,
      survey: {
        id: 2,
        minimumPriorities: 5,
        surveyStoplightQuestions: [
          { phoneNumber: 'phoneNumber' },
          { education: 'education' },
          { c: 'c' }
        ],
        title: 'Other survey'
      }
    })
  })

  it('navigates to Question screen when there are no skipped questions', () => {
    props = createTestProps({
      drafts: [
        {
          draftId: 1,
          priorities: [{ action: 'Some action' }],
          achievements: [],
          progress: { screen: 'Location' },
          indicatorSurveyDataList: [
            { key: 'phoneNumber', value: 3 },
            { key: 'education', value: 1 },
            { key: 'ind', value: 1 },
            { key: 'Other ind', value: 2 }
          ]
        }
      ]
    })

    wrapper = shallow(<Overview {...props} />)
    wrapper.instance().onPressBack()

    expect(props.navigation.navigate).toHaveBeenCalledWith('Question', {
      draftId: 1,
      step: 2,
      survey: {
        id: 2,
        minimumPriorities: 5,
        surveyStoplightQuestions: [
          { phoneNumber: 'phoneNumber' },
          { education: 'education' },
          { c: 'c' }
        ],
        title: 'Other survey'
      }
    })
  })

  it('can filter by colors', () => {
    wrapper
      .find('#green')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ selectedFilter: 3 })

    wrapper
      .find('#yellow')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ filterLabel: 'views.lifemap.yellow' })

    const spy = jest.spyOn(wrapper.instance(), 'selectFilter')

    wrapper
      .find('#red')
      .props()
      .onPress()

    expect(spy).toHaveBeenCalledWith(1, 'views.lifemap.red')

    expect(wrapper).toHaveState({
      filterLabel: 'views.lifemap.red',
      selectedFilter: 1
    })
  })

  it('can filter skipped questions', () => {
    const spy = jest.spyOn(wrapper.instance(), 'selectFilter')

    wrapper
      .find('#skipped')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ selectedFilter: 0 })
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('can filter questions by priorities/achievements', () => {
    const spy = jest.spyOn(wrapper.instance(), 'selectFilter')

    wrapper
      .find('#priorities')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ selectedFilter: 'priorities' })
    expect(spy).toHaveBeenCalledWith(
      'priorities',
      'views.lifemap.priorities & views.lifemap.achievements'
    )
  })

  it('will revert to all indicators when selected or when closing the modal', () => {
    const spy = jest.spyOn(wrapper.instance(), 'selectFilter')

    wrapper
      .find('#all')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ selectedFilter: false })
    expect(spy).toHaveBeenCalledTimes(1)

    wrapper
      .find(BottomModal)
      .props()
      .onEmptyClose()

    expect(wrapper).toHaveState({ selectedFilter: false })
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('will toggle modal', () => {
    wrapper
      .find('#filters')
      .props()
      .onPress()

    expect(wrapper).toHaveState({ filterModalIsOpen: true })

    wrapper
      .find(BottomModal)
      .props()
      .onRequestClose()

    expect(wrapper).toHaveState({ filterModalIsOpen: false })
  })
})
