import React from 'react'
import { shallow } from 'enzyme'
import { Text } from 'react-native'
import { CheckBox } from 'react-native-elements'
import Checkboxes from '../Checkboxes'

const createTestProps = props => ({
  updateAnswers: jest.fn(),
  title: 'Some checkbox text',
  multipleValue: [],
  question: {
    questionText: 'not bad',
    options: [{ text: 'wow', value: 'dog' }]
  },
  readonly: false,
  ...props
})

describe('Checkbox Component', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Checkboxes {...props} />)
  })

  describe('rendering', () => {
    it('renders correct checkbox main title ', () => {
      expect(
        wrapper
          .find(Text)
          .first()
          .render()
          .text()
      ).toBe('not bad')
    })

    it('renders CheckBox', () => {
      expect(wrapper.find(CheckBox)).toHaveLength(1)
    })

    it('renders error message when there is an error', () => {
      wrapper.setState({ error: true, errorMsg: 'error' })

      expect(
        wrapper
          .find(Text)
          .at(1)
          .render()
          .text()
      ).toBe('error')
    })
  })

  describe('functionality', () => {
    it('has the correct label', () => {
      expect(wrapper.find(CheckBox).props().title).toBe('wow')
    })

    it('calls onPress when icon is pressed', () => {
      wrapper
        .find(CheckBox)
        .props()
        .onPress()

      expect(props.updateAnswers).toHaveBeenCalledTimes(1)
    })

    it('check if checkbox checks and unchecks', () => {
      wrapper
        .find(CheckBox)
        .props()
        .onPress()

      expect(wrapper.find(CheckBox)).toHaveProp({ checked: true })

      wrapper
        .find(CheckBox)
        .props()
        .onPress()

      expect(wrapper.find(CheckBox)).toHaveProp({ checked: false })
    })
  })
})
