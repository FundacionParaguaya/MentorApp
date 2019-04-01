import React from 'react'
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
})
