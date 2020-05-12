import React from 'react'
import { shallow } from 'enzyme'
import { DrawerContent } from '../DrawerContent'

const createTestProps = props => ({
  navigation: {
    getParam: () => true, // logoutModalOpen
    setParams: jest.fn(),
    closeDrawer: jest.fn(),
    state: { index: 0, routes: [{ index: 0, routes: [{ routeName: 'Test' }] }] }
  },
  lng: 'en',
  switchLanguage: jest.fn(),
  logout: jest.fn(),
  setSyncedState: jest.fn(),
  user: { username: 'Test' },
  drafts: [{ id: 1 }],
  dimensions: {},
  sync: { appVersion: '1.7.4' },
  ...props
})

describe('Drawer Content', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<DrawerContent {...props} />)
  })

  it('shows proper user name', () => {
    expect(wrapper.find('#username')).toHaveHTML(
      '<react-native-mock>Test</react-native-mock>'
    )
  })

  it('switches language', () => {
    const spy = jest.spyOn(wrapper.instance(), 'changeLanguage')

    wrapper
      .find('#es')
      .props()
      .onPress()

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
