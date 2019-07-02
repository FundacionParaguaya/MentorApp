import React from 'react'
import { shallow } from 'enzyme'
import { FlatList } from 'react-native'
import { Families, mapStateToProps } from '../Families'
import SearchBar from '../../components/SearchBar'

const createTestProps = props => ({
  loadFamilies: jest.fn(),
  surveys: [{ id: 1 }],
  lng: 'en',
  env: 'development',
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    setParams: jest.fn()
  },
  families: [
    {
      familyId: 12,
      name: 'Adams Family',
      code: '123',
      draft: { surveyId: 1 }
    },
    {
      familyId: 21,
      name: 'The Flintstones',
      code: '234'
    },
    {
      familyId: 33,
      name: 'The Jetsons',
      code: '456'
    }
  ],
  drafts: [
    {
      familyData: {
        familyMembersList: [
          {
            firstName: 'Test',
            lastName: 'User'
          }
        ]
      },
      status: 'Draft'
    }
  ],
  user: { token: '' },
  offline: { online: true, outbox: [{ type: 'LOAD_FAMILIES' }] },
  ...props
})

describe('Families View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Families {...props} />)
  })

  describe('rendering', () => {
    it('maps proper state', () => {
      expect(mapStateToProps({ env: 'test' })).toEqual({ env: 'test' })
    })

    it('renders SearchBar', () => {
      expect(wrapper.find(SearchBar)).toHaveLength(1)
    })

    it('renders a list of families', () => {
      expect(wrapper.find(FlatList)).toHaveLength(1)

      const data = wrapper.find(FlatList).props().data

      const spy = jest.spyOn(wrapper.instance(), 'handleClickOnFamily')

      expect(
        wrapper
          .find(FlatList)
          .props()
          .keyExtractor(data[0], 0)
      ).toEqual('0')

      wrapper
        .find(FlatList)
        .props()
        .renderItem({ item: data[0] })
        .props.handleClick()

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  it('passes the correct number of synced and non synced families to FlatList', () => {
    expect(wrapper.find(FlatList).props().data).toHaveLength(4)
  })

  describe('functionality', () => {
    it('does not make a call to fetch families when user is online', () => {
      props = createTestProps({
        offline: { online: false, outbox: [] }
      })
      wrapper = shallow(<Families {...props} />)
      expect(wrapper.instance().props.loadFamilies).toHaveBeenCalledTimes(0)
    })
    it('changing search bar value changes search state', () => {
      wrapper
        .find(SearchBar)
        .props()
        .onChangeText('Adams')
      expect(wrapper.instance().state.search).toEqual('Adams')
    })
  })
  it('filters families list when search bar value changes, search is case insensitive', () => {
    wrapper
      .find(SearchBar)
      .props()
      .onChangeText('adams')
    expect(wrapper.find(FlatList).props().data).toHaveLength(1)
  })
})
