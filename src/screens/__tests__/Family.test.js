import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import { Family } from '../Family'
import { Overview } from '../lifemap/Overview'
import FamilyTab from '../../components/FamilyTab'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    setParams: jest.fn(),
    getParam: jest.fn(param => ({ createdAt: 1 }))
  },
  surveys: [],
  ...props
})

describe('Single Family View', () => {
  let wrapper
  const props = createTestProps()
  wrapper = shallow(<Family {...props} />)
  describe('rendering', () => {
    it('renders base ScrollView element', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders familyTab', () => {
      expect(wrapper.find(FamilyTab)).toHaveLength(2)
    })
    it('renders details', () => {
      expect(wrapper.find('#details')).toHaveLength(1)
    })
    it('does not render life map', () => {
      expect(wrapper.find('#lifemap')).toHaveLength(0)
    })
  })
  describe('functionality', () => {
    it('has the correct initial state', () => {
      expect(wrapper.instance().state.activeTab).toBe('Details')
    })
    it('changes active tab when other tab is clicked', () => {
      wrapper
        .find(FamilyTab)
        .at(1)
        .props()
        .onPress()
      expect(wrapper.instance().state.activeTab).toBe('LifeMap')
    })
    it('changing the active tab changes the view', () => {
      wrapper.setState({ activeTab: 'LifeMap' })
      expect(wrapper.find('#lifemap')).toHaveLength(1)

      expect(wrapper.find('#details')).toHaveLength(0)
    })
  })
})
