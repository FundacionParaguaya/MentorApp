import React from 'react'
import { shallow } from 'enzyme'
import { StatusBar } from 'react-native'
import { NavWrapper } from '../NavWrapper'
import { LoginStack, AppStack, LoadingStack } from '../navigation'

import colors from '../../theme.json'

const createTestProps = props => ({
  user: { token: '' },
  setSyncedState: jest.fn(),
  setDimensions: jest.fn(),
  sync: {
    synced: 'no'
  },
  ...props
})

describe('Navigation Wrapper', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<NavWrapper {...props} />)
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('before rehydration', () => {
    it('display status bar with contrasting colors', () => {
      expect(wrapper.find(StatusBar)).toHaveProp({
        backgroundColor: colors.palebeige,
        barStyle: 'dark-content'
      })
    })

    it('display a lodaing screen if not synced', () => {
      expect(wrapper.find(LoadingStack)).toHaveLength(1)
    })

    it('display the login screen if not logged in', () => {
      props = createTestProps({
        sync: {
          synced: 'login'
        }
      })
      wrapper = shallow(<NavWrapper {...props} />)
      expect(wrapper.find(LoginStack)).toHaveLength(1)
    })

    it('display the dashboard screen if logged in and fully synced', () => {
      props = createTestProps({
        sync: {
          synced: 'yes'
        }
      })
      wrapper = shallow(<NavWrapper {...props} />)
      expect(wrapper.find(AppStack)).toHaveLength(1)
    })
  })
})
