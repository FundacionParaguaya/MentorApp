import React from 'react'
import { FlatList } from 'react-native'
import { shallow } from 'enzyme'
import { Family } from '../Family'
import FamilyTab from '../../components/FamilyTab'
import data from '../__mocks__/fake-socio-economic-data.json'
import RoundImage from '../../components/RoundImage'
import Button from '../../components/Button'
import FamilyListItem from '../../components/FamilyListItem'

const createTestProps = props => ({
  t: value => value,
  updateNav: jest.fn(),
  navigation: {
    setParams: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn(),
    getParam: param => {
      switch (param) {
        case 'survey':
          return data

        case 'activeTab':
          return 'Details'

        case 'isDraft':
          return true

        case 'familyName':
          return 'Test Family'

        default:
          return {
            draftId: 1,
            surveyId: 1,
            progress: { screen: 'FamilyMembersNames' },
            createdAt: 1,
            status: 'Draft',
            familyData: {
              familyMembersList: [
                {
                  firstName: 'Juan',
                  lastName: 'Perez'
                }
              ]
            }
          }
      }
    }
  },
  surveys: [{ id: 1 }],
  ...props
})

describe('Single Family View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<Family {...props} />)
  })

  describe('rendering', () => {
    it('renders familyTab', () => {
      expect(wrapper.find(FamilyTab)).toHaveLength(2)
    })
    it('does not render life map', () => {
      expect(wrapper.find('#lifemap')).toHaveLength(0)
    })
  })
  describe('functionality', () => {
    it('has the correct initial state', () => {
      props = createTestProps({
        navigation: {
          setParams: jest.fn(),
          replace: jest.fn(),
          getParam: param => {
            switch (param) {
              case 'survey':
                return data

              case 'activeTab':
                return 'LifeMap'

              default:
                return {
                  draftId: 1,
                  surveyId: 1,
                  progress: { screen: 'FamilyMembersNames' },
                  createdAt: 1,
                  status: 'Draft',
                  familyData: {
                    familyMembersList: [
                      {
                        firstName: 'Juan',
                        lastName: 'Perez'
                      }
                    ]
                  }
                }
            }
          }
        }
      })
      wrapper = shallow(<Family {...props} />)
      expect(wrapper).toHaveState({ activeTab: 'LifeMap' })
    })
    it('changes active tab when other tab is clicked', () => {
      wrapper
        .find(FamilyTab)
        .at(1)
        .props()
        .onPress()
      expect(wrapper.instance().state.activeTab).toBe('LifeMap')

      wrapper
        .find(FamilyTab)
        .at(0)
        .props()
        .onPress()
      expect(wrapper.instance().state.activeTab).toBe('Details')
    })
    it('changing the active tab changes the view', () => {
      wrapper.setState({ activeTab: 'LifeMap' })
      expect(wrapper.find('#lifemap')).toHaveLength(1)
      expect(wrapper.find('#details')).toHaveLength(0)
    })
    it('renders round image and button when the family is a draft', () => {
      wrapper.setState({ activeTab: 'LifeMap' })
      expect(wrapper.find(RoundImage)).toHaveLength(1)
      expect(wrapper.find(Button)).toHaveLength(1)
    })
    it('navigates to correct screen when clicking on the resume draft button', () => {
      wrapper.setState({ activeTab: 'LifeMap' })
      wrapper
        .find(Button)
        .props()
        .handleClick()
      expect(wrapper.instance().props.navigation.replace).toHaveBeenCalledTimes(
        1
      )
      expect(wrapper.instance().props.navigation.replace).toHaveBeenCalledWith(
        'FamilyMembersNames',
        {
          draftId: 1,
          socioEconomics: undefined,
          step: undefined,
          survey: { id: 1 }
        }
      )
    })

    it('navigates to family location', () => {
      wrapper
        .find(FamilyListItem)
        .first()
        .props()
        .handleClick()

      expect(props.navigation.navigate).toHaveBeenCalledWith('Location', {
        family: expect.any(Object)
      })
    })

    it('renders a list of family members and handles navigation to those members pages', () => {
      const data = wrapper.find(FlatList).props().data

      expect(
        wrapper
          .find(FlatList)
          .props()
          .keyExtractor(data[0], 0)
      ).toEqual('0')

      wrapper
        .find(FlatList)
        .props()
        .renderItem({ item: { name: 'Juan' }, index: 0 })
        .props.handleClick()

      expect(props.navigation.navigate).toHaveBeenCalledWith(
        'FamilyParticipant',
        {
          family: expect.any(Object)
        }
      )

      wrapper
        .find(FlatList)
        .props()
        .renderItem({ item: { name: 'Ana' }, index: 1 })
        .props.handleClick()

      expect(props.navigation.navigate).toHaveBeenCalledWith('FamilyMember', {
        member: expect.any(Object)
      })
    })

    it('navigates to socio economic category review', () => {
      props = createTestProps({
        navigation: {
          setParams: jest.fn(),
          replace: jest.fn(),
          navigate: jest.fn(),
          getParam: param => {
            switch (param) {
              case 'survey':
                return data

              case 'activeTab':
                return 'Details'

              case 'familyName':
                return 'Test Family'

              case 'isDraft':
                return false

              default:
                return {
                  draftId: 1,
                  surveyId: 1,
                  progress: { screen: 'FamilyMembersNames' },
                  createdAt: 1,
                  status: 'Draft',
                  familyData: {
                    familyMembersList: [
                      {
                        firstName: 'Juan',
                        lastName: 'Perez'
                      }
                    ]
                  }
                }
            }
          }
        }
      })

      wrapper = shallow(<Family {...props} />)

      wrapper
        .find(FamilyListItem)
        .last()
        .props()
        .handleClick()

      expect(props.navigation.navigate).toHaveBeenCalledWith(
        'SocioEconomicQuestion',
        {
          family: expect.any(Object),
          page: 2
        }
      )
    })
  })
})
