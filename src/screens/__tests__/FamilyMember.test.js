import React from 'react'
import { shallow } from 'enzyme'
import { FamilyMember } from '../lifemap/FamilyMember'
import TextInput from '../../components/form/TextInput'
import Select from '../../components/form/Select'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    setParams: jest.fn(),
    getParam: jest.fn(() => ({
      firstName: 'Neil',
      gender: 'M',
      birthDate: 1551791821053
    }))
  },
  ...props
})

describe('FamilyMemvers View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyMember {...props} />)
  })
  it('sets nav header to first name', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledWith({
      title: 'Neil'
    })
  })
  it('does not allow interaction with form elements', () => {
    expect(
      wrapper
        .find(TextInput)
        .props()
        .onChangeText()
    ).toBe(undefined)

    expect(
      wrapper
        .find(Select)
        .props()
        .onChange()
    ).toBe(undefined)
  })
})
