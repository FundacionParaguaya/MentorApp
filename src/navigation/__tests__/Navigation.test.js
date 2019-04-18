import React from 'react'
import { shallow } from 'enzyme'
import { Image } from 'react-native'
import { DrawerNavigation } from '../stacks'
import { DrawerContent } from '../DrawerContent'

const createTestProps = props => ({
  navigation: {
    toggleDrawer: jest.fn(),
    getParam: () => false,
    navigate: jest.fn(),
    setParams: jest.fn(),
    state: { index: 0, routes: [{ index: 0, routes: [{ routeName: 'Test' }] }] }
  },
  switchLanguage: jest.fn(),
  user: { username: 'test' },
  drafts: [],
  ...props
})

describe('Navigation', () => {
  describe('Drawer', () => {
    const wrapper = shallow(<DrawerNavigation />)
    it('contains all links', () => {
      expect(wrapper.instance().state.nav.routes[0].routes).toHaveLength(4)
    })
    it('can navigate to all views', () => {
      expect(wrapper.instance()._navigation.navigate('Families')).toBe(true)
      expect(wrapper.instance()._navigation.navigate('Surveys')).toBe(true)
      expect(wrapper.instance()._navigation.navigate('Dashboard')).toBe(true)
      expect(wrapper.instance()._navigation.navigate('Sync')).toBe(true)
      // expect(wrapper.instance()._navigation.navigate('Family')).toBe(true)
      expect(wrapper.instance()._navigation.navigate('Question')).toBe(true)
    })
  })

  describe('DrawerContent', () => {
    let wrapper
    let props
    beforeEach(() => {
      props = createTestProps()
      wrapper = shallow(<DrawerContent {...props} />)
    })
    it('renders nav image', () => {
      expect(wrapper.find(Image)).toHaveLength(1)
    })
    it('shows proper username', () => {
      expect(wrapper.find('#username')).toHaveHTML(
        '<react-native-mock>test</react-native-mock>'
      )
    })
    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({
        activeTab: 'Dashboard',
        checkboxesVisible: false,
        ckeckedBoxes: 0,
        showErrors: false
      })
    })
    it('renders dashboard item', () => {
      expect(wrapper.find('#dashboard')).toHaveLength(1)
    })
    it('navigates to dashboard and sets appropriate state', () => {
      wrapper
        .find('#dashboard')
        .props()
        .onPress()
      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledWith(
        'Dashboard'
      )
      expect(wrapper.instance().state.activeTab).toBe('Dashboard')
    })
    it('navigates to surveys and sets appropriate state', () => {
      wrapper
        .find('#surveys')
        .props()
        .onPress()
      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledWith(
        'Surveys'
      )
      expect(wrapper.instance().state.activeTab).toBe('Surveys')
    })
    it('navigates to sync and sets appropriate state', () => {
      wrapper
        .find('#sync')
        .props()
        .onPress()
      expect(
        wrapper.instance().props.navigation.navigate
      ).toHaveBeenCalledTimes(1)
      expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalledWith(
        'Sync'
      )
      expect(wrapper.instance().state.activeTab).toBe('Sync')
    })
    it('renders surveys item', () => {
      expect(wrapper.find('#surveys')).toHaveLength(1)
    })
    it('renders sync item', () => {
      expect(wrapper.find('#sync')).toHaveLength(1)
    })
    it('allows user to change language', () => {
      const spy = jest.spyOn(wrapper.instance(), 'changeLanguage')
      wrapper
        .find('#en')
        .props()
        .onPress()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('en')
    })
  })
})
