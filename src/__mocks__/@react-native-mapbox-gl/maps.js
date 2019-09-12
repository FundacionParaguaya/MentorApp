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

export default class Mapbox extends React.Component {
  static MapView = props =>
    React.createElement('MapView', props, props.children)
  static UserLocation = props =>
    React.createElement('UserLocation', props, props.children)
  static Camera = props => React.createElement('Camera', props, props.children)

  static PointAnnotation = props =>
    React.createElement('PointAnnotation', props, props.children)
  /* eslint-disable react/prop-types */

  render() {
    return React.createElement('MapView', this.props, this.props.children)
  }

  static requestAndroidLocationPermissions = () => jest.fn()

  static setAccessToken = () => jest.fn()

  static offlineManager = {
    deletePack: jest.fn(),
    getPack: jest.fn().mockImplementation(() => Promise.resolve(true)),
    getPacks: jest.fn().mockImplementation(() => Promise.resolve(true)),
    offlineManager: jest.fn()
  }
}
