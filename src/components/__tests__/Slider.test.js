import React from 'react'
import { shallow } from 'enzyme'
import { Slider } from '../Slider'

import SliderItem from '../SliderItem'

const createTestProps = props => ({
  slides: [
    {
      description:
        'Our household income is always above 60% of the UK average.',
      url: 'https://some-url-1.jpg',
      value: 3
    },
    {
      description:
        'Our household income, this year, is above 60% of the UK average.',
      url: 'https://some-url-2.jpg',
      value: 2
    },
    {
      description:
        'Our household income is always below 60% of the UK average.',
      url: 'https://some-url-3.jpg',
      value: 1
    }
  ],
  dimensions: { height: 731, width: 411, scale: 2.6 },
  value: 1,
  selectAnswer: jest.fn(),
  text: 'Some button text',
  ...props
})

let wrapper, props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<Slider {...props} />)
})

it('renders SliderItem', () => {
  expect(wrapper.find(SliderItem)).toHaveLength(3)
})

it('selects an answer', () => {
  const slideItem = wrapper.find(SliderItem).first()
  slideItem.props().onPress()
  expect(props.selectAnswer).toHaveBeenCalledWith(props.slides[0].value)
})
