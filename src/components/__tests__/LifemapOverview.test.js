import React from 'react'

import { shallow } from 'enzyme'
import { Text, View } from 'react-native'

import LifemapOverview from '../LifemapOverview'
import LifemapOverviewListItem from '../LifemapOverviewListItem'

const createTestProps = props => ({
  surveyData: [
    {
      codeName: 'FamilySavings',
      questionText: 'Family Savings',
      dimension: 'Health & Environment'
    },
    {
      codeName: 'FamilyIncome',
      questionText: 'Family Income',
      dimension: 'Income'
    },
    {
      codeName: 'FamilyHealth',
      questionText: 'Family Health',
      dimension: 'Health & Environment'
    },
    {
      codeName: 'Money',
      questionText: 'Family Money',
      dimension: 'Income'
    }
  ],
  draftData: {
    draftId: 1,
    priorities: [{ action: 'Some action', indicator: 'FamilyHealth' }],
    achievements: [{ action: 'Some action' }],
    indicatorSurveyDataList: [
      {
        key: 'FamilySavings',
        value: 2
      },
      {
        key: 'FamilyIncome',
        value: 3
      },
      {
        key: 'FamilyHealth',
        value: 2
      }
    ]
  },
  selectedFilter: false,
  navigateToScreen: jest.fn(),
  previousIndicators: [{key: "householdIncome", value: 3}],
  ...props
})

describe('LifemapOverview Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<LifemapOverview {...props} />)
  })

  describe('rendering', () => {
    it('renders View', () => {
      expect(wrapper.find(View)).toHaveLength(3)
    })
    it('renders Text', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders LifemapOverviewListItem', () => {
      expect(wrapper.find(LifemapOverviewListItem)).toHaveLength(3)
    })
  })
  describe('functionality', () => {
    it('passes the correct name to LifemapOverviewListItem', () => {
      expect(
        wrapper
          .find(LifemapOverviewListItem)
          .first()
          .props().name
      ).toEqual('Family Savings')
    })

    it('passes the correct color to LifemapOverviewListItem', () => {
      expect(
        wrapper
          .find(LifemapOverviewListItem)
          .first()
          .props().color
      ).toEqual(2)
    })
    it('passes the correct priority value when false', () => {
      expect(
        wrapper
          .find(LifemapOverviewListItem)
          .first()
          .props().priority
      ).toEqual(false)
    })
    it('passes the correct priority value when true', () => {
      props = createTestProps({
        draftData: {
          draftId: 1,
          priorities: [{ action: 'Some action', indicator: 'FamilySavings' }],
          achievements: [],
          indicatorSurveyDataList: [
            {
              key: 'FamilySavings',
              value: 2
            },
            {
              key: 'FamilyIncome',
              value: 3
            }
          ]
        }
      })
      wrapper = shallow(<LifemapOverview {...props} />)
      expect(
        wrapper
          .find(LifemapOverviewListItem)
          .first()
          .props().priority
      ).toEqual(true)
    })
    it('passes the correct achievement value when false', () => {
      expect(
        wrapper
          .find(LifemapOverviewListItem)
          .first()
          .props().achievement
      ).toEqual(false)
    })
    it('passes the correct achievement value when true', () => {
      props = createTestProps({
        draftData: {
          draftId: 1,
          priorities: [],
          achievements: [{ action: 'Some action', indicator: 'FamilySavings' }],
          indicatorSurveyDataList: [
            {
              key: 'FamilySavings',
              value: 2
            },
            {
              key: 'FamilyIncome',
              value: 3
            }
          ]
        }
      })
      wrapper = shallow(<LifemapOverview {...props} />)
      expect(
        wrapper
          .find(LifemapOverviewListItem)
          .first()
          .props().achievement
      ).toEqual(true)
    })

    it('calls navigateToScreen with the correct arg for priority', () => {
      wrapper
        .find(LifemapOverviewListItem)
        .first()
        .props()
        .handleClick()
      expect(wrapper.instance().props.navigateToScreen).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().props.navigateToScreen).toHaveBeenCalledWith(
        'AddPriority',
        'FamilySavings',
        'Family Savings'
      )
    })

    it('calls navigateToScreen with the correct arg for achievement', () => {
      wrapper
        .find(LifemapOverviewListItem)
        .last()
        .props()
        .handleClick()
      expect(wrapper.instance().props.navigateToScreen).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().props.navigateToScreen).toHaveBeenCalledWith(
        'AddAchievement',
        'FamilyIncome',
        'Family Income'
      )
    })
    it('filters color items by dimension', () => {
      props = createTestProps({
        selectedFilter: 2
      })
      wrapper = shallow(<LifemapOverview {...props} />)
      expect(
        wrapper.instance().filterByDimension('Health & Environment')
      ).toHaveLength(2)
    })
    it('filters skipped items by dimension', () => {
      props = createTestProps({
        selectedFilter: 0,
        draftData: {
          draftId: 1,
          priorities: [],
          achievements: [],
          indicatorSurveyDataList: [
            {
              key: 'FamilySavings',
              value: 2
            },
            {
              key: 'Money',
              value: 0
            }
          ]
        }
      })
      wrapper = shallow(<LifemapOverview {...props} />)
      expect(wrapper.instance().filterByDimension('Income')).toHaveLength(1)
    })
    it('filters items with achievements/priorities by dimension', () => {
      props = createTestProps({
        selectedFilter: 'priorities'
      })
      wrapper = shallow(<LifemapOverview {...props} />)
      expect(
        wrapper.instance().filterByDimension('Health & Environment')
      ).toHaveLength(1)
    })
  })
})
