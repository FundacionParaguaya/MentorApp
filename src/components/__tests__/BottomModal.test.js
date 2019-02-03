import React from 'react'
import { shallow } from 'enzyme'
import BottomModal from '../BottomModal'

const createTestProps = props => ({
  isOpen: true,
  onRequestClose: jest.fn(),
  onEmptyClose: jest.fn(),
  children: [],
  ...props
})

describe('BottomModal Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<BottomModal {...props} />)
  })

  it('calls onRequestClose when modal is closed', () => {
    wrapper
      .find('#content')
      .props()
      .onRequestClose()

    expect(props.onRequestClose).toHaveBeenCalledTimes(1)
  })

  it('calls onEmptyClose when overlay is tapped', () => {
    wrapper
      .find('#overlay')
      .props()
      .onPress()

    expect(props.onEmptyClose).toHaveBeenCalledTimes(1)
  })
})
