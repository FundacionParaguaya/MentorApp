import React from 'react'
import { shallow } from 'enzyme'
import ProgressBar, { styles } from '../ProgressBar'
import { View } from 'react-native'

const createTestProps = props => ({
  progress: 0.73,
  currentScreen: 'Question',
  hideBorder: false,
  removePadding: false,
  ...props
})

let wrapper, props

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<ProgressBar {...props} />)
})

it('renders the progress bar', () => {
  expect(wrapper.find(View)).toHaveLength(4)
})

it('removes padding', () => {
  wrapper.setProps({ removePadding: true })
  expect(
    wrapper
      .find(View)
      .first()
      .prop('style')
  ).toEqual([styles.containerNoPadding, { borderBottomWidth: 0 }])

  expect(
    wrapper
      .find(View)
      .at(1)
      .prop('style')
  ).toEqual(styles.progressBarContainerNoPadding)
})

it('sets correct progress', () => {
  expect(
    wrapper
      .find(View)
      .at(3)
      .prop('style')
  ).toEqual([
    styles.progressBarIndicator,
    { width: props.progress * 100 + '%' }
  ])
})
