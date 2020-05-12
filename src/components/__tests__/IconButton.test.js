import React from 'react'
import { shallow } from 'enzyme'
import { TouchableHighlight, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { IconButtonComponent } from '../IconButton'

const createTestProps = props => ({
  icon: 'menu',
  size: 35,
  onPress: jest.fn(),
  text: 'Press',
  drafts: [],
  offline: { outbox: [] },
  ...props
})

describe('IconButton', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<IconButtonComponent {...props} />)
  })

  it('is not pressed by default', () => {
    expect(wrapper).toHaveState({ pressed: false })
  })

  it('fires onPress when pressed', () => {
    wrapper
      .find(TouchableHighlight)
      .props()
      .onPress()

    expect(wrapper.instance().props.onPress).toHaveBeenCalledTimes(1)
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

  it('displays icon', () => {
    expect(wrapper.find(Icon)).toHaveLength(1)
    expect(wrapper.find(Icon)).toHaveProp({ name: 'menu' })
  })

  it('displays community icon', () => {
    props = createTestProps({ communityIcon: 'account' })
    wrapper = shallow(<IconButtonComponent {...props} />)
    expect(wrapper.find(CommunityIcon)).toHaveLength(1)
    expect(wrapper.find(CommunityIcon)).toHaveProp({ name: 'account' })
  })

  it('displays text', () => {
    expect(wrapper.find(Text)).toHaveLength(1)
    expect(wrapper.find(Text)).toHaveHTML(
      '<react-native-mock>Press</react-native-mock>'
    )
  })

  it('displays image', () => {
    props = createTestProps({ imageSource: 2 })
    wrapper = shallow(<IconButtonComponent {...props} />)
    expect(wrapper.find(Image)).toHaveLength(1)
    expect(wrapper.find(Image)).toHaveProp({ source: 2 })
  })
})
