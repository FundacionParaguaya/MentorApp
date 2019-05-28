import React from 'react'
import { shallow } from 'enzyme'
import { Overview } from '../lifemap/Overview'
import StickyFooter from '../../components/StickyFooter'
import Button from '../../components/Button'
import LifemapVisual from '../../components/LifemapVisual'
import LifemapOverview from '../../components/LifemapOverview'
import BottomModal from '../../components/BottomModal'
import draftMock from '../__mocks__/draftMock'

const createTestProps = props => ({
  t: value => value,

  addDraftProgress: jest.fn(),
  navigation: {
    navigate: jest.fn(),
    isFocused: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'resumeDraft') {
        return false
      } else if (param === 'survey') {
        return {
          id: 2,
          title: 'Other survey',
          minimumPriorities: 5,
          surveyEconomicQuestions: [],
          surveyStoplightQuestions: [
            { phoneNumber: 'phoneNumber' },
            { education: 'education' },
            { c: 'c' }
          ]
        }
      } else if (param === 'draft') {
        return draftMock
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
    it('renders LifemapVisual', () => {
      expect(wrapper.find(LifemapVisual)).toHaveLength(1)
    })
    it('renders LifemapOverview', () => {
      expect(wrapper.find(LifemapOverview)).toHaveLength(1)
    })

    it('does not render button initially', () => {
      expect(wrapper.find(Button)).toHaveLength(0)
    })
    it('closing tip changes state', () => {
      wrapper
        .find(StickyFooter)
        .props()
        .onTipClose()

      expect(wrapper.instance().state.tipIsVisible).toBe(false)
    })

    it('StickyFooter is not visible when on resumeDraft screen', () => {
      const props = createTestProps({
        navigation: {
          navigate: jest.fn(),
          isFocused: jest.fn(),
          setParams: jest.fn(),
          getParam: jest.fn(param => {
            if (param === 'resumeDraft') {
              return true
            } else if (param === 'survey') {
              return {
                id: 2,
                title: 'Other survey',
                minimumPriorities: 5,
                surveyEconomicQuestions: [],
                surveyStoplightQuestions: [
                  { phoneNumber: 'phoneNumber' },
                  { education: 'education' },
                  { c: 'c' }
                ]
              }
            } else if (param === 'draft') {
              return draftMock
            }
          })
        }
      })
      wrapper = shallow(<Overview {...props} />)
      expect(wrapper.find(StickyFooter).props().visible).toBe(false)
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
      expect(wrapper.find(LifemapOverview).props().draftData).toEqual(draftMock)
    })

    it('resumes the draft when Resume is clicked', () => {
      props = createTestProps({
        navigation: {
          navigate: jest.fn(),
          isFocused: jest.fn(),
          setParams: jest.fn(),
          replace: jest.fn(),
          getParam: jest.fn(param => {
            if (param === 'resumeDraft') {
              return true
            } else if (param === 'survey') {
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
            } else if (param === 'draft') {
              return draftMock
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
      expect(props.navigation.replace).toHaveBeenCalledWith(
        'Overview',
        expect.any(Object)
      )
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

  it('navigates back to skipped screen if there are skipped questions', () => {
    wrapper.instance().onPressBack()

    expect(props.navigation.navigate).toHaveBeenCalledWith(
      'Skipped',
      expect.any(Object)
    )
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

    expect(props.navigation.navigate).toHaveBeenCalledWith(
      'Skipped',
      expect.any(Object)
    )
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
