import React from 'react'
import { shallow } from 'enzyme'
import { Family } from '../Family'
import FamilyTab from '../../components/FamilyTab'
import data from '../__mocks__/fake-socio-economic-data.json'
import RoundImage from '../../components/RoundImage'
import Button from '../../components/Button'
const createTestProps = props => ({
  t: value => value,
  updateNav: jest.fn(),
  navigation: {
    setParams: jest.fn(),
    replace: jest.fn(),
    getParam: param => {
      switch (param) {
        case 'survey':
          return data

        case 'activeTab':
          return 'Details'

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
  })
})
