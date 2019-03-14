import React from 'react'
import { shallow } from 'enzyme'
import { DrawerContent } from '../navigation/DrawerContent'

const createTestProps = props => ({
  navigation: {
    getParam: () => true, // logoutModalOpen
    setParams: jest.fn(),
    toggleDrawer: jest.fn(),
    state: {index: 0, routes: [{index:0, routes: [{routeName: 'Test'}]}]}
  },
  lng: 'en',
  switchLanguage: jest.fn(),
  logout: jest.fn(),
  user: { username: 'Test' },
  drafts: [{ id: 1 }],
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
  it('check for errror on log out', () => {
    wrapper.setState({ checkboxesVisible: true })
    wrapper.instance().logUserOut()
    expect(wrapper).toHaveState({ showErrors: true })
  })
  it('resets error state on loging out', () => {
    wrapper.instance().logUserOut()
    expect(wrapper).toHaveState({ showErrors: false })
  })
  it('logs out if user has confirmed', () => {
    wrapper.setState({ ckeckedBoxes: 4 })
    wrapper.instance().logUserOut()
    expect(props.logout).toHaveBeenCalledTimes(1)
  })
})
