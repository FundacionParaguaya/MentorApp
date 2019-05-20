import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-enzyme'

Enzyme.configure({ adapter: new Adapter() })

// mock device info
jest.mock('react-native-device-info', () => {
  return {
    getModel: jest.fn()
  }
})

// mock react native
jest.mock('react-native', () => require('react-native-mock-render'), {
  virtual: true,
  timers: 'fake'
})

// mock mapbox
jest.mock('@mapbox/react-native-mapbox-gl', () => {
  const React = require('React')
  const NativeModules = require('react-native')

  function keyMirror(keys) {
    const obj = {}
    keys.forEach(key => (obj[key] = key))
    return obj
  }

  // Mock of what the native code puts on the JS object
  NativeModules.MGLModule = {
    // constants
    UserTrackingModes: {
      None: 0,
      Follow: 1,
      FollowWithCourse: 2,
      FollowWithHeading: 3
    },
    StyleURL: keyMirror([
      'Street',
      'Dark',
      'Light',
      'Outdoors',
      'Satellite',
      'SatelliteStreet',
      'TrafficDay',
      'TrafficNight'
    ]),
    EventTypes: keyMirror([
      'MapClick',
      'MapLongClick',
      'RegionWillChange',
      'RegionIsChanging',
      'RegionDidChange',
      'WillStartLoadingMap',
      'DidFinishLoadingMap',
      'DidFailLoadingMap',
      'WillStartRenderingFrame',
      'DidFinishRenderingFrame',
      'DidFinishRenderingFrameFully',
      'DidFinishLoadingStyle',
      'SetCameraComplete'
    ]),
    CameraModes: keyMirror(['Flight', 'Ease', 'None']),
    StyleSource: keyMirror(['DefaultSourceID']),
    InterpolationMode: keyMirror([
      'Exponential',
      'Categorical',
      'Interval',
      'Identity'
    ]),
    LineJoin: keyMirror(['Bevel', 'Round', 'Miter']),
    LineCap: keyMirror(['Butt', 'Round', 'Square']),
    LineTranslateAnchor: keyMirror(['Map', 'Viewport']),
    CirclePitchScale: keyMirror(['Map', 'Viewport']),
    CircleTranslateAnchor: keyMirror(['Map', 'Viewport']),
    FillExtrusionTranslateAnchor: keyMirror(['Map', 'Viewport']),
    FillTranslateAnchor: keyMirror(['Map', 'Viewport']),
    IconRotationAlignment: keyMirror(['Auto', 'Map', 'Viewport']),
    IconTextFit: keyMirror(['None', 'Width', 'Height', 'Both']),
    IconTranslateAnchor: keyMirror(['Map', 'Viewport']),
    SymbolPlacement: keyMirror(['Line', 'Point']),
    TextAnchor: keyMirror([
      'Center',
      'Left',
      'Right',
      'Top',
      'Bottom',
      'TopLeft',
      'TopRight',
      'BottomLeft',
      'BottomRight'
    ]),
    TextJustify: keyMirror(['Center', 'Left', 'Right']),
    TextPitchAlignment: keyMirror(['Auto', 'Map', 'Viewport']),
    TextRotationAlignment: keyMirror(['Auto', 'Map', 'Viewport']),
    TextTransform: keyMirror(['None', 'Lowercase', 'Uppercase']),
    TextTranslateAnchor: keyMirror(['Map', 'Viewport']),
    LightAnchor: keyMirror(['Map', 'Viewport']),
    OfflinePackDownloadState: keyMirror(['Inactive', 'Active', 'Complete']),
    OfflineCallbackName: keyMirror(['Progress', 'Error']),

    // methods
    setAccessToken: jest.fn(),
    getAccessToken: () => Promise.resolve('test-token'),
    setTelemetryEnabled: jest.fn(),
    isTelemetryEnabled: () => Promise.resolve(true)
  }

  NativeModules.MGLOfflineModule = {
    createPack: packOptions => {
      return Promise.resolve({
        bounds: packOptions.bounds,
        metadata: JSON.stringify({ name: packOptions.name })
      })
    },
    offlineManager: {
      deletePack: jest.fn(),
      offlineManager: jest.fn()
    },
    getPacks: () => Promise.resolve([]),
    deletePack: () => Promise.resolve(),
    getPackStatus: () => Promise.resolve({}),
    pausePackDownload: () => Promise.resolve(),
    resumePackDownload: () => Promise.resolve(),
    setPackObserver: () => Promise.resolve(),
    setTileCountLimit: jest.fn(),
    setProgressEventThrottle: jest.fn()
  }

  NativeModules.MGLSnapshotModule = {
    takeSnap: () => {
      return Promise.resolve('file://test.png')
    }
  }

  return class Mapbox extends React.Component {
    static MapView = props =>
      React.createElement('MapView', props, props.children)

    static PointAnnotation = props =>
      React.createElement('PointAnnotation', props, props.children)

    render() {
      return React.createElement('MapView', this.props, this.props.children)
    }

    static setAccessToken = () => jest.fn()

    static offlineManager = {
      deletePack: jest.fn(),
      getPack: jest.fn().mockImplementation(() => Promise.resolve(true)),
      getPacks: jest.fn().mockImplementation(() => Promise.resolve(true)),
      offlineManager: jest.fn()
    }
  }
})
