import React from 'react'
import * as store from '../../redux/store'
import { shallow } from 'enzyme'
import { Text, ActivityIndicator } from 'react-native'
import { Loading } from '../Loading'

jest.useFakeTimers()

const createTestProps = props => ({
  loadFamilies: jest.fn(),
  loadSurveys: jest.fn(),
  loadSnapshots: jest.fn(),
  setSyncedState: jest.fn(),
  env: 'testing',
  user: { token: '' },
  sync: {
    synced: false,
    images: {
      total: 0,
      synced: 0
    }
  },
  surveys: [],
  families: [],
  offline: {},
  ...props
})

describe('Loading Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Loading {...props} />)
  })

  it('renders <Text />', () => {
    expect(wrapper.find(Text)).toHaveLength(3)
  })
  it('renders <ActivityIndicator />', () => {
    expect(wrapper.find(ActivityIndicator)).toHaveLength(1)
  })
  it('checks for store hydration on mount', () => {
    const spy = jest.spyOn(wrapper.instance(), 'checkHydration')
    wrapper.instance().componentDidMount()
    expect(spy).toHaveBeenCalledTimes(1)
  })
  describe('after rehydration', () => {
    beforeEach(() => {
      /* eslint-disable import/namespace */
      store.getHydrationState = () => true
      /* eslint-enable import/namespace */
      props = createTestProps()
      wrapper = shallow(<Loading {...props} />)
    })

    it('clears timers', () => {
      const spy = jest.spyOn(wrapper.instance(), 'clearTimers')
      wrapper.instance().checkHydration()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('hides immediately if no API token is detected', () => {
      expect(wrapper.instance().props.setSyncedState).toHaveBeenCalledWith(
        'login'
      )
    })
  })
})
