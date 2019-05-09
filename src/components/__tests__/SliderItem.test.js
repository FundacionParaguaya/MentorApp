import React from 'react'
import { shallow } from 'enzyme'
import { Text, TouchableHighlight } from 'react-native'
import Image from '../CachedImage'
import SliderItem from '../SliderItem'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../../theme.json'

const createTestProps = props => ({
  slide: {
    description: 'Our household income is always above 60% of the UK average.',
    url: 'https://some-url-1.jpg',
    value: 1
  },
  onPress: jest.fn(),
  ...props
})

describe('SliderItem Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SliderItem {...props} />)
  })

  it('renders Image', () => {
    expect(wrapper.find(Image)).toHaveLength(1)
  })
  it('renders Text', () => {
    expect(wrapper.find(Text)).toHaveLength(1)
  })
  it('renders Icon', () => {
    expect(wrapper.find(Icon)).toHaveLength(1)
  })

  // it('renders icon in correct color when value is 1', () => {
  //   expect(wrapper.find('#icon-view').props().style.backgroundColor).toBe(
  //     colors.red
  //   )
  // })
  it('renders icon in correct color when value is 2', () => {
    props = createTestProps({
      slide: {
        description: '',
        url: '',
        value: 2
      }
    })
    // wrapper = shallow(<SliderItem {...props} />)
    // expect(wrapper.find('#icon-view').props().style.backgroundColor).toBe(
    //   colors.gold
    // )
  })
  it('renders icon in correct color when value is 3', () => {
    props = createTestProps({
      slide: {
        description: '',
        url: '',
        value: 3
      }
    })
    // wrapper = shallow(<SliderItem {...props} />)
    // expect(wrapper.find('#icon-view').props().style.backgroundColor).toBe(
    //   colors.palegreen
    // )
  })
  it('toggles between pressed states', () => {
    wrapper
      .find(TouchableHighlight)
      .props()
      .onShowUnderlay()
    expect(wrapper).toHaveState({ pressed: true })
    wrapper
      .find(TouchableHighlight)
      .props()
      .onHideUnderlay()
    expect(wrapper).toHaveState({ pressed: false })
  })
})
