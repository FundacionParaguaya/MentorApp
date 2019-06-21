import React from 'react'
import { shallow } from 'enzyme'
import { Slider } from '../Slider'
import { ScrollView } from 'react-native'
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

describe('Slider Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Slider {...props} />)
  })
  describe('rendering', () => {
    it('renders ScrollView', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })

    it('renders SliderItem', () => {
      expect(wrapper.find(SliderItem)).toHaveLength(3)
    })
  })
})
