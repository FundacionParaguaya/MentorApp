import React from 'react'
import { shallow } from 'enzyme'
import LifemapOverview from '../LifemapOverview'
import AddPriorityAndAchievementModal from '../../screens/modals/AddPriorityAndAchievementModal'

const surveyStoplightQuestions = [
  {
    questionText: 'Ahorros familiares',
    codeName: 'familySavings',
    definition: null,
    dimension: 'Ingreso y Empleo',
    id: 677,
    stoplightColors: [
      {
        url:
          'https://penguin-imgproxy.herokuapp.com/psdi7cykgZAXbEvCbXM7PehiP5rk3quXbfT3EmdMXi0/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL3BhcmFndWF5L2Z1bmRhY2lvbnBhcmFndWF5YS8yLzMuanBn.jpg',
        value: 3,
        description:
          'Uno o más miembros de mi familia tienen ahorros hace al menos seis meses y tiene una cuenta de ahorro a su nombre.'
      },
      {
        url:
          'https://penguin-imgproxy.herokuapp.com/-4aZ7YQSWd4j9F3Dzk9GCIr-yQgoYDqgn96vtRUQg5c/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL3BhcmFndWF5L2Z1bmRhY2lvbnBhcmFndWF5YS8yLzIuanBn.jpg',
        value: 2,
        description:
          'Uno o más miembros de mi familia tienen ahorros de manera informal (mantienen el dinero en casa o en la propiedad, grupos informales de ahorro, etc.). O tienen una cuenta de ahorro hace menos de seis meses.'
      },
      {
        url:
          'https://penguin-imgproxy.herokuapp.com/VX4ecHs8l_GoMYL8pNeQZm6EwhunrwyUtbAamY35PHA/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL3BhcmFndWF5L2Z1bmRhY2lvbnBhcmFndWF5YS8yLzEuanBn.jpg',
        value: 1,
        description: 'Ningún miembro de mi familia tiene ahorros.'
      }
    ],
    required: false
  },
  {
    questionText: 'Disposición de basura',
    codeName: 'garbageDisposal',
    definition: null,
    dimension: 'Salud y Medio Ambiente',
    id: 678,
    stoplightColors: [
      {
        url:
          'https://penguin-imgproxy.herokuapp.com/bQnNVZ341SKcZ1wuYbgeQg-sPbvVZwKYsVJv-UTUaP4/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL3BhcmFndWF5L2Z1bmRhY2lvbnBhcmFndWF5YS83LzMuanBn.jpg',
        value: 3,
        description:
          'Los miembros de mi familia depositan sus residuos en un basurero hasta su recolección o entierran los desechos orgánicos en un hoyo distanciado al menos unos veinte metros de la vivienda, fuentes de agua y campo de cultivo y recicla los desechos inorgánicos.'
      },
      {
        url:
          'https://penguin-imgproxy.herokuapp.com/v25B4lOG76E5Pe9K37lgYC1Lfuy3h_8gugdG_m1o8zc/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL3BhcmFndWF5L2Z1bmRhY2lvbnBhcmFndWF5YS83LzIuanBn.jpg',
        value: 2,
        description:
          'Los miembros de mi familia entierran sus residuos en un hoyo tapado dentro de su terreno, pero está distanciado a menos de veinte metros de la vivienda, fuentes de agua y campo de cultivo.'
      },
      {
        url:
          'https://penguin-imgproxy.herokuapp.com/4ZiV-qUtCfHzZfvuDbGDoA7fkkvOS3nr1P7FFWmbWzE/fill/400/400/ce/0/aHR0cHM6Ly9zMy51cy1lYXN0LTIuYW1hem9uYXdzLmNvbS9mcC1wc3AtaW1hZ2VzL3BhcmFndWF5L2Z1bmRhY2lvbnBhcmFndWF5YS83LzEuanBn.jpg',
        value: 1,
        description:
          'Los miembros de mi familia queman sus basuras o las tiran a cielo abierto en su terreno o cerca de la vivienda, fuentes de agua o campos de cultivo.'
      }
    ],
    required: false
  }
]

const draft = {
  draftId: '1',
  created: 1568891692588,
  status: 'Draft',
  surveyId: 15,
  economicSurveyDataList: [],
  indicatorSurveyDataList: [
    { key: 'familySavings', value: 3 },
    { key: 'garbageDisposal', value: 1 }
  ],
  priorities: [
    {
      reason: 'priority',
      action: '',
      estimatedDate: 4,
      indicator: 'familySavings'
    }
  ],
  achievements: [
    { action: 'achievement', roadmap: '', indicator: 'garbageDisposal' }
  ],
  progress: { screen: 'Overview', total: 16, step: 9 },
  familyData: {
    familyMembersList: [
      {
        firstParticipant: true,
        socioEconomicAnswers: [],
        birthCountry: 'PY',
        firstName: 'Lorenzo',
        lastName: 'Gomez',
        gender: 'M',
        birthDate: 1546300800,
        documentType: 'LICENCIA_DE_CONDUCIR',
        documentNumber: 'aaa'
      }
    ],
    countFamilyMembers: 1,
    country: 'PY',
    latitude: 0,
    longitude: 0,
    accuracy: 0
  }
}

const createTestProps = props => ({
  surveyData: surveyStoplightQuestions,
  draftData: draft,
  draftOverview: true,
  selectedFilter: false,
  ...props
})

let props, wrapper

beforeEach(() => {
  props = createTestProps()
  wrapper = shallow(<LifemapOverview {...props} />)
})

it('has correct initial state', () => {
  expect(wrapper.instance().state).toEqual({
    AddAchievementOrPriority: false,
    indicator: '',
    color: 0,
    indicatorText: ''
  })
})

it('loads properly modal for adding priorities and achievements', () => {
  wrapper.setState({ AddAchievementOrPriority: true })
  expect(wrapper.find(AddPriorityAndAchievementModal)).toHaveLength(1)
})

it('closes modal on click outside', () => {
  wrapper.setState({ AddAchievementOrPriority: true })
  wrapper.instance().onClose()
  expect(wrapper.state().AddAchievementOrPriority).toBe(false)
})

it('filters', () => {
  const DIMENSION = 'Ingreso y Empleo'
  wrapper.setProps({ selectedFilter: 'priorities' })
  expect(wrapper.instance().filterByDimension(DIMENSION)).toEqual([
    surveyStoplightQuestions[0]
  ])
})
