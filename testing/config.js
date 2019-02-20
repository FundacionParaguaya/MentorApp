import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-enzyme'

Enzyme.configure({ adapter: new Adapter() })

jest.mock('react-native', () => require('react-native-mock-render'), {
  virtual: true,
  timers: 'fake'
})
