import React from 'react'

import { shallow } from 'enzyme'
import { ScrollView } from 'react-native'
import SliderItem from '../SliderItem'
import { Slider } from '../Slider'
import colors from '../../theme.json'
import Carousel from 'react-native-snap-carousel'


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
      expect(wrapper.find(Carousel)).toHaveLength(1)
    })
    // it('renders SliderItem', () => {
    //   expect(wrapper.find(SliderItem)).toHaveLength(3)
    // })
  })

  // describe('functionality', () => {
  //   it('has correct initial state', () => {
  //     expect(wrapper.instance().state.selectedColor).toEqual(colors.green)
  //   })
  //   it('does not change state when user clicks on green slide', () => {
  //     wrapper
  //       .find(SliderItem)
  //       .at(0)
  //       .props()
  //       .onPress()
  //     expect(wrapper.instance().state.selectedColor).toEqual(colors.green)
  //   })
  //   it('does changes state to yellow when user clicks on yellow slide', () => {
  //     wrapper
  //       .find(SliderItem)
  //       .at(1)
  //       .props()
  //       .onPress()
  //     expect(wrapper.instance().state.selectedColor).toEqual(colors.gold)
  //   })
  // })
  // it('does changes state to red when user clicks on red slide', () => {
  //   wrapper
  //     .find(SliderItem)
  //     .at(2)
  //     .props()
  //     .onPress()
  //   expect(wrapper.instance().state.selectedColor).toEqual(colors.red)
  // })
  // it('calls selectAnswer function with the correct argument for green', () => {
  //   wrapper
  //     .find(SliderItem)
  //     .at(0)
  //     .props()
  //     .onPress()
  //   expect(wrapper.instance().props.selectAnswer).toHaveBeenCalledTimes(1)
  //   expect(wrapper.instance().props.selectAnswer).toHaveBeenCalledWith(3)
  // })
  // it('calls selectAnswer function with the correct argument for yellow', () => {
  //   wrapper
  //     .find(SliderItem)
  //     .at(1)
  //     .props()
  //     .onPress()
  //   expect(wrapper.instance().props.selectAnswer).toHaveBeenCalledTimes(1)
  //   expect(wrapper.instance().props.selectAnswer).toHaveBeenCalledWith(2)
  // })
  // it('calls selectAnswer function with the correct argument for red', () => {
  //   wrapper
  //     .find(SliderItem)
  //     .at(2)
  //     .props()
  //     .onPress()
  //   expect(wrapper.instance().props.selectAnswer).toHaveBeenCalledTimes(1)
  //   expect(wrapper.instance().props.selectAnswer).toHaveBeenCalledWith(1)
  // })
})
