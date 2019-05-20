import React from 'react'
import { shallow } from 'enzyme'
import { FlatList } from 'react-native'
import { Dashboard, mapStateToProps } from '../Dashboard'
import RoundImage from '../../components/RoundImage'
import mockDraft from '../__mocks__/draftMock.json'

const createTestProps = props => ({
  t: value => value,
  navigation: {
    navigate: jest.fn(),
    setParams: jest.fn()
  },
  lng: 'en',
  env: 'production',
  user: { status: '' },
  loadSurveys: jest.fn(),
  loadSnapshots: jest.fn(),
  updateNav: jest.fn(),
  loadFamilies: jest.fn(),
  offline: { outbox: [] },
  drafts: [
    {
      draftId: 1
    },
    {
      draftId: 2
    }
  ],
  surveys: [{ id: 1 }],
  families: [],
  ...props
})

describe('Dashboard View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Dashboard {...props} />)
  })

  it('maps proper state', () => {
    expect(mapStateToProps({ env: 'test' })).toEqual({ env: 'test' })
  })

  it('renders <RoundImage />', () => {
    expect(wrapper.find(RoundImage)).toHaveLength(1)
  })

  it('passes the correct data to <FlatList /> and reverses the order of drafts', () => {
    expect(wrapper.find(FlatList).props().data).toEqual(
      wrapper.instance().props.drafts.reverse()
    )

    const data = wrapper.find(FlatList).props().data

    const navigateToDraft = jest.spyOn(wrapper.instance(), 'navigateToDraft')
    const navigateToPendingSync = jest.spyOn(
      wrapper.instance(),
      'navigateToPendingSync'
    )

    expect(
      wrapper
        .find(FlatList)
        .props()
        .keyExtractor(data[0], 0)
    ).toEqual('0')

    wrapper
      .find(FlatList)
      .props()
      .renderItem({ item: { status: 'Draft', progress: {} } })
      .props.handleClick()

    expect(navigateToDraft).toHaveBeenCalledTimes(1)

    wrapper
      .find(FlatList)
      .props()
      .renderItem({
        item: {
          status: 'Pending sync',
          progress: {},
          familyData: { familyMembersList: [{ firstName: 'Test' }] }
        }
      })
      .props.handleClick()

    expect(navigateToPendingSync).toHaveBeenCalledTimes(1)
  })

  it('navigates to correct screen based on draft status', () => {
    let spy = jest.spyOn(wrapper.instance(), 'navigateToPendingSync')

    wrapper
      .instance()
      .handleClickOnListItem({ ...mockDraft, ...{ status: 'Pending sync' } })

    expect(spy).toHaveBeenCalledTimes(1)

    spy = jest.spyOn(wrapper.instance(), 'navigateToDraft')

    wrapper
      .instance()
      .handleClickOnListItem({ ...mockDraft, ...{ status: 'Draft' } })

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('continues draft based on its progress', () => {
    wrapper.instance().navigateToDraft({
      ...mockDraft,
      ...{ progress: { screen: 'Participant', step: 2 } }
    })
  })

  it('does not show latest drafts title if there are no drafts', () => {
    props = createTestProps({ drafts: [] })
    wrapper = shallow(<Dashboard {...props} />)

    expect(wrapper.find('#latest-drafts')).toHaveLength(0)
  })

  it('allows user to create new lifemap', () => {
    wrapper
      .find('#create-lifemap')
      .props()
      .handleClick()

    expect(props.navigation.navigate).toHaveBeenCalledWith('Surveys')
  })
})
