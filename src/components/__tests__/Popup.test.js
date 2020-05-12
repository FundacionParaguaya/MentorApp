import React from 'react'
import { shallow } from 'enzyme'
import { Text, Modal } from 'react-native'
import Popup from '../Popup'

const createTestProps = props => ({
  isOpen: false,
  children: <Text>Modal</Text>,
  onClose: jest.fn(),
  ...props
})

describe('Popup', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Popup {...props} />)
  })
  it('desn\'t render if not invoked', () => {
    expect(wrapper.find(Modal)).toHaveProp('visible', false)
  })
  describe('is visible', () => {
    beforeEach(() => {
      props = createTestProps({
        isOpen: true
      })
      wrapper = shallow(<Popup {...props} />)
    })
    it('renders children', () => {
      expect(wrapper.find('#modal')).toContainReact(<Text>Modal</Text>)
    })
    it('can be closed when clocking overlay', () => {
      wrapper
        .find('#overlay')
        .props()
        .onPress()

      expect(wrapper.instance().props.onClose).toHaveBeenCalledTimes(1)
    })
  })
})
