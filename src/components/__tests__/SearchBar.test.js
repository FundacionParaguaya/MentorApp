import React from 'react'
import { shallow } from 'enzyme'
import { TextInput, View } from 'react-native'
import SearchBar from '../SearchBar'

const createTestProps = props => ({
  ...props,
  style: { width: 50, height: 50 },
  onChangeText: jest.fn(),
  onSubmit: jest.fn(),
  placeholder: 'placeholder',
  value: ''
})

describe('Search bar', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<SearchBar {...props} />)
  })
  it('passes styles to containing View', () => {
    expect(wrapper.find(View).props().style).toEqual(
      expect.arrayContaining([{ width: 50, height: 50 }])
    )
  })
  it('renders a native TextInput', () => {
    expect(wrapper.find(TextInput)).toHaveLength(1)
  })

  it('displays placeholder', () => {
    expect(wrapper.find(TextInput).props().placeholder).toBe('placeholder')
  })
  it('calls onChangeText prop when editing the search bar', () => {
    wrapper
      .find('#search-bar')
      .props()
      .onChangeText('Paris')

    expect(wrapper.instance().props.onChangeText).toHaveBeenCalledTimes(1)
    expect(wrapper.instance().props.onChangeText).toHaveBeenCalledWith('Paris')
  })
  it('calls onSubmit prop when editing is done', () => {
    wrapper
      .find('#search-bar')
      .props()
      .onEndEditing('Paris')

    expect(wrapper.instance().props.onSubmit).toHaveBeenCalledTimes(1)
  })
})
