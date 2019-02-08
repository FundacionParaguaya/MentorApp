import React from 'react'

import { shallow } from 'enzyme'
import { Text, Modal } from 'react-native'
import Button from '../Button'
import Tip from '../Tip'

const createTestProps = props => ({
  title: 'Title',
  description: 'Description',
  ...props
})

describe('Tip Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Tip {...props} />)
  })
  describe('rendering', () => {
    it('renders Modal', () => {
      expect(wrapper.find(Modal)).toHaveLength(1)
    })
    it('renders title and description', () => {
      expect(wrapper.find(Text)).toHaveLength(2)
    })
    it('renders Button', () => {
      expect(wrapper.find(Button)).toHaveLength(1)
    })
  })

  describe('functionality', () => {
    it('has correct initial state', () => {
      expect(wrapper.instance().state).toEqual({ tipVisible: true })
    })
    it('clicking Button changes visible state to false and fires onTipClose', () => {
      wrapper
        .find(Button)
        .props()
        .handleClick()
      expect(wrapper.instance().state).toEqual({ tipVisible: false })
    })
    it('clicking Button fires onTipClose if providex', () => {
      props = createTestProps({ onTipClose: jest.fn() })
      wrapper = shallow(<Tip {...props} />)

      wrapper
        .find(Button)
        .props()
        .handleClick()

      expect(props.onTipClose).toHaveBeenCalledTimes(1)
    })
    it('shows correct title', () => {
      expect(
        wrapper
          .find(Text)
          .first()
          .props().children
      ).toBe('Title')
    })
    it('shows correct description', () => {
      expect(
        wrapper
          .find(Text)
          .last()
          .props().children
      ).toBe('Description')
    })
  })
})
