import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import { DrawerContent } from '../navigation/DrawerContent'

const createTestProps = props => ({
  navigation: {
    getParam: () => true, // logoutModalOpen
    setParams: jest.fn(),
    toggleDrawer: jest.fn()
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

  it('hilights proper language', () => {
    expect(wrapper.find('#en').find(Text)).toHaveProp({
      style: [
        {
          fontFamily: 'Poppins',
          fontWeight: '500',
          fontSize: 16,
          lineHeight: 20
        },
        { color: '#FFFFFF' }
      ]
    })
  })

  it('switches language', () => {
    const spy = jest.spyOn(wrapper.instance(), 'changeLanguage')

    wrapper
      .find('#es')
      .props()
      .onPress()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('checks for user confirmation before loging out', () => {
    wrapper.instance().logUserOut()
    expect(wrapper).toHaveState({ showErrors: true })
  })
  it('logs out if user has confirmed', () => {
    wrapper.setState({ ckeckedBoxes: 4 })
    wrapper.instance().logUserOut()
    expect(props.logout).toHaveBeenCalledTimes(1)
  })
})
