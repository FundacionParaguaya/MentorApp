import React from 'react'
import { shallow } from 'enzyme'
import { Loading, mapStateToProps } from '../Loading'

jest.useFakeTimers()

const createTestProps = props => ({
  loadFamilies: jest.fn(),
  loadSurveys: jest.fn(),
  loadSnapshots: jest.fn(),
  setSyncedState: jest.fn(),
  hydration: false,
  navigation: {
    setParams: jest.fn(),
    navigate: jest.fn()
  },
  env: 'testing',
  user: { token: '' },
  sync: {
    synced: 'no',
    images: {
      total: 0,
      synced: 0
    }
  },
  surveys: [],
  families: [],
  offline: { outbox: [] },
  ...props
})

describe('Loading Component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Loading {...props} />)
  })

  it('maps proper state', () => {
    expect(mapStateToProps({ sync: [] })).toEqual({ sync: [] })
  })
})
