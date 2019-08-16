import 'jest-enzyme'

import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'

Enzyme.configure({ adapter: new Adapter() })

// mock react native
jest.mock('react-native', () => require('react-native-mock-render'), {
  virtual: true,
  timers: 'fake'
})

jest.mock('bugsnag-react-native', () => ({
  Configuration: jest.fn(),
  Client: jest.fn(() => ({ leaveBreadcrumb: jest.fn() }))
}))
