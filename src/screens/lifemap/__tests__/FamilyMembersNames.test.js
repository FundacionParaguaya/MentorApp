import DateInput from '../../../components/form/DateInput'
import { FamilyMembersNames } from '../FamilyMembersNames'
import React from 'react'
import Select from '../../../components/form/Select'
import StickyFooter from '../../../components/StickyFooter'
import TextInput from '../../../components/form/TextInput'
import { shallow } from 'enzyme'

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

const navigation = {
  isFocused: jest.fn(() => true),
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
}

const createTestProps = props => ({
  t: value => value,
  navigation,
  drafts: [draft, { draftId: 2 }],
  updateDraft: jest.fn(),
  ...props
})

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
  expect(props.navigation.navigate).toHaveBeenCalledWith('FamilyParticipant', {
    survey,
    draftId
  })
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

it('sets autoFocus to first textInput', () => {
  expect(wrapper.find(TextInput).first()).toHaveProp({ autoFocus: true })
  expect(wrapper.find(TextInput).last()).toHaveProp({ autoFocus: false })
})

it('does not update draft on wrong field format', () => {
  wrapper.instance().updateMember('m')
  expect(props.updateDraft).toHaveBeenCalledTimes(1)
})

it('sets up custom required fields', () => {
  props = createTestProps({
    navigation: {
      ...navigation,
      getParam: jest.fn(param => {
        if (param === 'family') {
          return null
        } else if (param === 'survey') {
          return {
            ...survey,
            surveyConfig: { requiredFields: { primaryParticipant: [] } }
          }
        } else if (param === 'draftId') {
          return draftId
        }
      })
    }
  })
  wrapper = shallow(<FamilyMembersNames {...props} />)
})

describe('from resumed draft', () => {
  const resumeDraft = {
    ...draft,
    progress: {
      ...draft.progress,
      screen: 'FamilyMembersNames'
    },
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

  it('updates the draft on each field change ', () => {
    wrapper
      .find(TextInput)
      .first()
      .props()
      .onChangeText('Test', '1.firstName')

    wrapper
      .find(Select)
      .first()
      .props()
      .onChange('Test', '1.gender')

    wrapper
      .find(DateInput)
      .first()
      .props()
      .onValidDate('Test', '1.date')

    expect(props.updateDraft).toHaveBeenCalledTimes(3)
  })

  it('sets errors on each field change', () => {
    const spy = jest.spyOn(wrapper.instance(), 'setError')
    wrapper
      .find(TextInput)
      .first()
      .props()
      .setError(true)

    expect(spy).toHaveBeenCalledWith(true, '1.firstName')

    wrapper
      .find(Select)
      .first()
      .props()
      .setError(true)

    expect(wrapper).toHaveState({ errors: ['1.firstName', '1.gender'] })

    wrapper
      .find(Select)
      .first()
      .props()
      .setError(false)

    expect(wrapper).toHaveState({ errors: ['1.firstName'] })

    wrapper
      .find(DateInput)
      .first()
      .props()
      .setError(true)

    wrapper.instance().setError(false, 'field', 1)

    expect(wrapper).toHaveState({ errors: ['1.firstName', '1.birthDate'] })
  })

  it('validates form on pressing continue', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onContinue')

    wrapper
      .find(StickyFooter)
      .props()
      .onContinue()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('prevents continue on form errors', () => {
    wrapper.setState({ errors: ['field'] })
    wrapper
      .find(StickyFooter)
      .props()
      .onContinue()

    expect(wrapper).toHaveState({ showErrors: true })
  })
})

describe('readonly mode', () => {
  beforeEach(() => {
    props = createTestProps({
      drafts: [
        {
          ...draft,
          familyData: { ...draft.familyData, countFamilyMembers: null }
        }
      ],
      navigation: {
        ...navigation,
        getParam: jest.fn(param => {
          if (param === 'family') {
            return null
          } else if (param === 'survey') {
            return survey
          } else if (param === 'draftId') {
            return 1
          } else if (param === 'readOnly') {
            return true
          } else {
            return 1
          }
        })
      }
    })
    wrapper = shallow(<FamilyMembersNames {...props} />)
  })
})
