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

  it('renders list of drafts', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleClickOnListItem')

    expect(
      wrapper
        .find(FlatList)
        .props()
        .keyExtractor({ id: 1 }, 0)
    ).toEqual('0')

    wrapper
      .find(FlatList)
      .props()
      .renderItem({ item: { id: 1, surveyId: 4, progress: { screen: '' } } })
      .props.handleClick()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('passes the correct data to <FlatList /> and reverses the order of drafts', () => {
    expect(wrapper.find(FlatList).props().data).toEqual(
      wrapper.instance().props.drafts.reverse()
    )
  })

  it('calls sets the screen title on mount', () => {
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      1
    )
  })

  it('updates screen title when lng prop changes', () => {
    wrapper.setProps({ lng: 'es' })
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledTimes(
      2
    )
    expect(wrapper.instance().props.navigation.setParams).toHaveBeenCalledWith({
      title: 'views.dashboard'
    })
  })

  it('can navigate to lifemap creation', () => {
    wrapper
      .find('#create-lifemap')
      .props()
      .handleClick()

    expect(props.navigation.navigate).toHaveBeenCalledWith('Surveys')
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

    expect(props.navigation.navigate).toHaveBeenCalledWith('Participant', {
      draftId: 4,
      socioEconomics: undefined,
      step: 2,
      survey: { id: 1 }
    })

    wrapper.instance().navigateToDraft({
      ...mockDraft,
      ...{ progress: { screen: 'Question', step: 2 } }
    })

    expect(props.navigation.navigate).toHaveBeenCalledWith('Overview', {
      draftId: 4,
      resumeDraft: true,
      survey: { id: 1 }
    })
  })

  it('does not show latest drafts title if there are no drafts', () => {
    props = createTestProps({ drafts: [] })
    wrapper = shallow(<Dashboard {...props} />)

    expect(wrapper.find('#latest-drafts')).toHaveLength(0)
  })
})
