import React from 'react'
import { shallow } from 'enzyme'
import { Loading } from '../Loading'
import { url } from '../../config'

jest.useFakeTimers()

const createTestProps = props => ({
  loadFamilies: jest.fn(),
  loadSurveys: jest.fn(),
  loadSnapshots: jest.fn(),
  setSyncedState: jest.fn(),
  logout: jest.fn(),
  env: 'demo',
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
  hydration: false,
  ...props
})

describe('Loading Component', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Loading {...props} />)
  })

  it('show login if user has no token', () => {
    wrapper.instance().setSyncedState()

    expect(props.setSyncedState).toHaveBeenCalledWith('login')
  })

  it('sets synced state upon hydration', () => {
    const spy = jest.spyOn(wrapper.instance(), 'setSyncedState')

    wrapper.setProps({ hydration: true })

    expect(spy).toHaveBeenCalledTimes(1)
  })

  describe('Syncing data', () => {
    beforeEach(() => {
      props = createTestProps({ user: { token: '15' } })
      wrapper = shallow(<Loading {...props} />)
    })

    it('begins sync if user is logged in, but no data is synced', () => {
      const spy = jest.spyOn(wrapper.instance(), 'loadData')

      wrapper.instance().setSyncedState()

      expect(props.setSyncedState).toHaveBeenCalledWith('no')
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('initiates fetching surveys and families', () => {
      wrapper.instance().loadData()

      expect(wrapper).toHaveState({ loadingData: true })
      expect(props.loadFamilies).toHaveBeenCalledWith(url[props.env], '15')
      expect(props.loadSurveys).toHaveBeenCalledWith(url[props.env], '15')
    })

    it('initiates image caching', () => {
      wrapper.instance().handleImageCaching()

      expect(wrapper).toHaveState({ cachingImages: true })
    })

    it('initiates offlime map pack download', () => {
      wrapper.instance().downloadMapData()

      expect(wrapper).toHaveState({
        dataCached: true,
        downloadingMap: true
      })
    })

    it('updates map download progress', () => {
      wrapper.instance().onMapDownloadProgress({}, {})

      expect(wrapper).toHaveState({ offlineRegionStatus: { percentage: 0 } })

      wrapper.instance().onMapDownloadProgress({}, { percentage: 1 })

      expect(wrapper).toHaveState({ offlineRegionStatus: { percentage: 1 } })
    })

    it('shows map download error', () => {
      wrapper.instance().onMapDownloadError({}, 'some error')

      expect(wrapper).toHaveState({ mapDownloadError: 'some error' })
    })
  })

  describe('All data synced', () => {
    beforeEach(() => {
      props = createTestProps({ user: { token: '15' }, surveys: [{ id: 1 }] })
      wrapper = shallow(<Loading {...props} />)
    })

    it('enter app if user logged in and everything is synced', () => {
      wrapper.instance().setSyncedState()

      expect(props.setSyncedState).toHaveBeenCalledWith('yes')
    })
  })
})
