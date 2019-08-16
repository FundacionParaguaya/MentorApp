import { FlatList } from 'react-native'
import React from 'react'
import { Surveys } from '../Surveys'
import { shallow } from 'enzyme'

jest.useFakeTimers()

const createTestProps = props => ({
  loadSurveys: jest.fn(),
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    setParams: jest.fn()
  },
  lng: 'en',
  surveys: [
    {
      id: 1,
      title: 'Test survey 1'
    },
    {
      id: 2,
      title: 'Other survey 2'
    }
  ],
  ...props
})

describe('Surveys View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Surveys {...props} />)
  })

  it('renders a list of surveys', () => {
    expect(wrapper.find(FlatList).props().data).toEqual(props.surveys)

    expect(
      wrapper
        .find(FlatList)
        .props()
        .keyExtractor(props.surveys[0], 0)
    ).toEqual('0')
  })

  it('handles clicking on a survey', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleClickOnSurvey')

    wrapper
      .find(FlatList)
      .props()
      .renderItem({ item: props.surveys[0] })
      .props.handleClick()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ id: 1, title: 'Test survey 1' })

    expect(props.navigation.navigate).toHaveBeenCalledWith('Terms', {
      page: 'terms',
      survey: { id: 1, title: 'Test survey 1' }
    })
  })
})
