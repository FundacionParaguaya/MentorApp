import React from 'react'
import { shallow } from 'enzyme'
import { FamilyMembersNames } from '../lifemap/FamilyMembersNames'
import Select from '../../components/form/Select'
import DateInput from '../../components/form/DateInput'
import TextInput from '../../components/form/TextInput'

const survey = {
  surveyStoplightQuestions: [],
  surveyEconomicQuestions: [],
  surveyConfig: {
    gender: [
      {
        text: 'Female',
        value: 'F'
      },
      {
        text: 'Male',
        value: 'M'
      },
      {
        text: 'Prefer not to disclose',
        value: 'O'
      }
    ]
  }
}

const draftId = 1

const draft = {
  draftId,
  progress: { screen: 'FamilyParticipant', total: 5 },
  familyData: {
    countFamilyMembers: 3,
    familyMembersList: [
      {
        firstName: 'Juan',
        lastName: 'Perez',
        documentNumber: '123456',
        documentType: '0',
        email: 'juan@gmail.com',
        birthCountry: 'PY',
        gender: 'M',
        birthDate: 12345,
        firstParticipant: true,
        socioEconomicAnswers: [
          { key: 'educationPersonMostStudied', value: 'SCHOOL-COMPLETE' },
          { key: 'receiveStateIncome', value: 'NO' }
        ]
      },
      { firstParticipant: false },
      { firstParticipant: false }
    ]
  }
}

const createTestProps = props => ({
  t: value => value,
  navigation: {
    isFocused: () => true,
    navigate: jest.fn(),
    push: jest.fn(),
    setParams: jest.fn(),
    getParam: jest.fn(param => {
      if (param === 'family') {
        return null
      } else if (param === 'survey') {
        return survey
      } else if (param === 'draftId') {
        return draftId
      }
    })
  },
  drafts: [draft, { draftId: 2 }],
  updateDraft: jest.fn(),
  ...props
})

describe('FamilyMembersNames View', () => {
  let wrapper
  let props
  beforeEach(() => {
    props = createTestProps()
    wrapper = shallow(<FamilyMembersNames {...props} />)
  })

  it('receives proper survey from navigation', () => {
    expect(wrapper.instance().survey).toBe(survey)
  })

  it('receives proper draftId from navigation', () => {
    expect(wrapper.instance().draftId).toBe(draftId)
  })

  it('gets proper draft from draftId', () => {
    expect(wrapper.instance().getDraft()).toBe(draft)
  })

  it('renders all inputs for each family member', () => {
    expect(wrapper.find(TextInput)).toHaveLength(2)
    expect(wrapper.find(Select)).toHaveLength(2)
    expect(wrapper.find(DateInput)).toHaveLength(2)
  })

  it('navigates to location on continue ', () => {
    wrapper.instance().onContinue()
    expect(props.navigation.navigate).toHaveBeenCalledWith('Location', {
      survey,
      draftId
    })
  })

  it('updates only when focused', () => {
    expect(wrapper.instance().shouldComponentUpdate()).toEqual(true)
  })

  it('navigates back to proper screen', () => {
    wrapper.instance().onPressBack()
    expect(props.navigation.navigate).toHaveBeenCalledWith(
      'FamilyParticipant',
      {
        survey,
        draftId
      }
    )
  })

  it('sets draft navigation when navigation from a different page', () => {
    expect(props.updateDraft).toHaveBeenCalledWith({
      ...draft,
      progress: {
        ...draft.progress,
        screen: 'FamilyMembersNames'
      }
    })
  })

  describe('from resume draft', () => {
    const resumeDraft = {
      ...draft,
      familyData: {
        ...draft.familyData,
        familyMembersList: [
          draft.familyData.familyMembersList[0],
          { firstParticipant: false, firstName: 'Ana' },
          { firstParticipant: false, firstName: 'Pesho', gender: 'M' }
        ]
      }
    }
    beforeEach(() => {
      props = createTestProps({
        drafts: [resumeDraft]
      })
      wrapper = shallow(<FamilyMembersNames {...props} />)
    })
    it('sets correct value from draft to each field', () => {
      expect(wrapper.find(TextInput).first()).toHaveProp({
        initialValue: 'Ana'
      })
      expect(wrapper.find(TextInput).last()).toHaveProp({
        initialValue: 'Pesho'
      })
      expect(wrapper.find(Select).last()).toHaveProp({ initialValue: 'M' })
    })

    it('updates the draft with correct data', () => {
      wrapper.instance().updateMember('F', '1.gender')
      expect(props.updateDraft).toHaveBeenCalledWith({
        ...resumeDraft,
        familyData: {
          ...resumeDraft.familyData,
          familyMembersList: Object.assign(
            [],
            resumeDraft.familyData.familyMembersList,
            {
              [1]: {
                ...resumeDraft.familyData.familyMembersList[1],
                firstParticipant: false,
                gender: 'F'
              }
            }
          )
        }
      })
    })

    it('updates the draft on each field change ', () => {})
  })
})
