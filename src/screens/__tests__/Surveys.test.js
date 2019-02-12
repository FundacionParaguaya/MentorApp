import React from 'react'
import { shallow } from 'enzyme'
import { ScrollView, FlatList } from 'react-native'
import { Surveys } from '../Surveys'
import RoundImage from '../../components/RoundImage'

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
  beforeEach(() => {
    const props = createTestProps()
    wrapper = shallow(<Surveys {...props} />)
  })
  describe('rendering', () => {
    it('renders base View', () => {
      expect(wrapper.find(ScrollView)).toHaveLength(1)
    })
    it('renders <RoundImage />', () => {
      expect(wrapper.find(RoundImage)).toHaveLength(1)
    })
    it('renders FlatList', () => {
      expect(wrapper.find(FlatList)).toHaveLength(1)
    })
  })
  describe('functionality', () => {
    describe('functionality', () => {
      it('passes the correct data to <FlatList />', () => {
        expect(wrapper.find(FlatList).props().data).toEqual(
          wrapper.instance().props.surveys
        )
      })
    })
    it('calls sets the screen title on mount', () => {
      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledTimes(1)
    })
    it('updates screen title when lng prop changes', () => {
      wrapper.setProps({ lng: 'es' })
      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledTimes(2)
      expect(
        wrapper.instance().props.navigation.setParams
      ).toHaveBeenCalledWith({ title: 'views.createLifemap' })
    })
  })
})
