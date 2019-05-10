import configureStore from 'redux-mock-store' //ES6 modules
import fetchMock from 'fetch-mock'
import thunk from 'redux-thunk'

import * as action from '../actions'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

jest.useFakeTimers()

describe('environment actions', () => {
  it('should create an action to set env', () => {
    const env = 'production'
    const expectedAction = {
      type: action.SET_ENV,
      env
    }
    expect(action.setEnv(env)).toEqual(expectedAction)
  })
})

describe('dimensions actions', () => {
  it('should create an action to set dimensions', () => {
    const dimensions = { width: 10, height: 10 }
    const expectedAction = {
      type: action.SET_DIMENSIONS,
      dimensions
    }
    expect(action.setDimensions(dimensions)).toEqual(expectedAction)
  })
})

describe('login/logout actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('should create action LOGIN_SUCCESS when login is successful', () => {
    const store = mockStore({ token: { token: '' } })
    const env = 'https://mock/env'
    const user = 'user'
    const pass = 'pass'
    fetchMock.postOnce(
      `${env}/oauth/token?username=${user}&password=${pass}&grant_type=password`,
      {
        body: { access_token: 'token', user: { username: 'username' } }
      }
    )
    const expectedAction = [
      {
        type: action.SET_LOGIN_STATE,
        token: 'token',
        status: 200,
        username: 'username'
      }
    ]

    return store.dispatch(action.login(user, pass, env)).then(() => {
      expect(store.getActions()).toEqual(expectedAction)
    })
  })

  it('should create action LOGIN_ERROR when login is not successful', () => {
    const store = mockStore({})
    const env = 'https://mock/env'
    const user = 'user'
    const pass = 'pass'
    fetchMock.postOnce(
      `${env}/oauth/token?username=${user}&password=${pass}&grant_type=password`,
      401
    )
    const expectedAction = [
      {
        type: action.SET_LOGIN_STATE,
        token: null,
        status: 401,
        username: null
      }
    ]

    return store.dispatch(action.login(user, pass, env)).then(() => {
      expect(store.getActions()).toEqual(expectedAction)
    })
  })

  it('should create an action to log the user out of the app', () => {
    const expectedAction = {
      type: action.USER_LOGOUT
    }
    expect(action.logout()).toEqual(expectedAction)
  })
})

describe('families actions', () => {
  it('should create an action to load the list of families', () => {
    const env = 'https://mock/env'
    const token = 'token'
    const expectedAction = {
      env: 'https://mock/env',
      meta: {
        offline: {
          commit: { type: 'LOAD_FAMILIES_COMMIT' },
          effect: {
            body:
              '{"query":"query { familiesNewStructure {familyId name code snapshotList { surveyId createdAt familyData { familyMembersList { birthCountry birthDate documentNumber documentType email familyId firstName firstParticipant gender id lastName memberIdentifier phoneNumber socioEconomicAnswers { key value}  }  countFamilyMembers latitude longitude country accuracy } economicSurveyDataList { key value } indicatorSurveyDataList { key value } achievements { action indicator roadmap } priorities { action estimatedDate indicator reason } } } }"}',
            headers: { Authorization: 'Bearer token' },
            method: 'POST',
            url: 'https://mock/env/graphql'
          }
        }
      },
      token: 'token',
      type: 'LOAD_FAMILIES'
    }

    expect(action.loadFamilies(env, token)).toEqual(expectedAction)
  })
})

describe('surveys actions', () => {
  it('should create an action to load the list of surveys', () => {
    const env = 'https://mock/env'
    const token = 'token'
    const expectedAction = {
      env: 'https://mock/env',
      meta: {
        offline: {
          commit: { type: 'LOAD_SURVEYS_COMMIT' },
          effect: {
            body:
              '{"query":"query { surveysByUser { title id minimumPriorities privacyPolicy { title  text } termsConditions{ title text } surveyConfig { documentType {text value} gender { text value} surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic required forFamilyMember options {text value} conditions{ codeName type value operator} } surveyStoplightQuestions { questionText codeName dimension id stoplightColors { url value description } required } } }"}',
            headers: { Authorization: 'Bearer token' },
            method: 'POST',
            url: 'https://mock/env/graphql'
          }
        }
      },
      token: 'token',
      type: 'LOAD_SURVEYS'
    }
    expect(action.loadSurveys(env, token)).toEqual(expectedAction)
  })
})

describe('drafts actions', () => {
  it('should create an action to create a draft', () => {
    const payload = { draftId: 1, draftContent: 'content' }
    const expectedAction = {
      type: action.CREATE_DRAFT,
      payload
    }
    expect(action.createDraft(payload)).toEqual(expectedAction)
  })
  it('should create an action to add draft progress', () => {
    const id = 1
    const progress = { screen: 'FamilyMembersNames' }
    const expectedAction = {
      type: action.ADD_DRAFT_PROGRESS,
      id,
      progress
    }
    expect(action.addDraftProgress(id, progress)).toEqual(expectedAction)
  })
  it('should create an action to delete a draft', () => {
    const id = 1
    const expectedAction = {
      type: action.DELETE_DRAFT,
      id
    }
    expect(action.deleteDraft(id)).toEqual(expectedAction)
  })
  it('should create an action to remove family memvers from draft', () => {
    const id = 1
    const afterIndex = 2

    const expectedAction = {
      type: action.REMOVE_FAMILY_MEMBERS,
      id,
      afterIndex
    }
    expect(action.removeFamilyMembers(id, afterIndex)).toEqual(expectedAction)
  })
  it('should create an action to add survey data to draft', () => {
    const id = 1
    const category = 'category'
    const payload = { question: 'answer' }
    const expectedAction = {
      type: action.ADD_SURVEY_DATA,
      id,
      category,
      payload
    }
    expect(action.addSurveyData(id, category, payload)).toEqual(expectedAction)
  })

  it('should create an action to add priority or achievement to draft', () => {
    const id = 1
    const category = 'priority'
    const payload = {
      reason: 'reason',
      action: 'action',
      indicator: 'indicator'
    }
    const expectedAction = {
      type: action.ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA,
      id,
      category,
      payload
    }
    expect(
      action.addSurveyPriorityAcheivementData({ id, category, payload })
    ).toEqual(expectedAction)
  })

  it('should create an action to delete priority or achievement to draft', () => {
    const id = 1
    const category = 'priority'
    const indicator = 'indicator'

    const expectedAction = {
      type: action.DELETE_SURVEY_PRIORITY_ACHEIVEMENT_DATA,
      id,
      category,
      indicator
    }
    expect(
      action.deleteSurveyPriorityAcheivementData({ id, category, indicator })
    ).toEqual(expectedAction)
  })

  it('should create an action to add surcey data to a family member', () => {
    const id = 1
    const index = 2
    const payload = {
      reason: 'reason',
      action: 'action',
      indicator: 'indicator'
    }
    const isSocioEconomicAnswer = false
    const expectedAction = {
      type: action.ADD_SURVEY_FAMILY_MEMBER_DATA,
      id,
      index,
      payload,
      isSocioEconomicAnswer
    }
    expect(
      action.addSurveyFamilyMemberData({
        id,
        index,
        payload,
        isSocioEconomicAnswer
      })
    ).toEqual(expectedAction)
  })

  it('should create an action to post a draft', () => {
    const env = 'https://mock/env'
    const token = 'token'
    const payload = {}
    const id = 1

    const expectedAction = {
      type: action.SUBMIT_DRAFT,
      env,
      token,
      payload,
      id,
      meta: {
        offline: {
          effect: {
            url: `${env}/graphql`,
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              query:
                'mutation addSnapshot($newSnapshot: NewSnapshotDTOInput) {addSnapshot(newSnapshot: $newSnapshot)  { surveyId surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } family { familyId } user { userId  username } indicatorSurveyDataList {key value} economicSurveyDataList {key value} familyDataDTO { latitude longitude accuracy familyMemberDTOList { firstName lastName socioEconomicAnswers {key value} } } } }',
              variables: { newSnapshot: payload }
            })
          },
          commit: {
            type: action.SUBMIT_DRAFT_COMMIT,
            meta: {
              id,
              payload
            }
          },
          rollback: {
            type: action.SUBMIT_DRAFT_ROLLBACK,
            meta: {
              id,
              payload
            }
          }
        }
      }
    }
    expect(action.submitDraft(env, token, id, payload)).toEqual(expectedAction)
  })
  describe('language actions', () => {
    it('should create an action to switch the app language', () => {
      const language = 'es'
      const expectedAction = {
        type: action.SWITCH_LANGUAGE,
        language
      }
      expect(action.switchLanguage(language)).toEqual(expectedAction)
    })
  })

  describe('hydration actions', () => {
    it('should create an action to set the rehydrated state', () => {
      const expectedAction = {
        type: action.SET_HYDRATED
      }
      expect(action.setHydrated()).toEqual(expectedAction)
    })
  })

  describe('sync actions', () => {
    it('should create an action to set a synced item total amount to be synced', () => {
      const item = 'drafts'
      const amount = 10
      const expectedAction = {
        type: action.SET_SYNCED_ITEM_TOTAL,
        item,
        amount
      }
      expect(action.setSyncedItemTotal(item, amount)).toEqual(expectedAction)
    })

    it('should create an action to set current synced items amount', () => {
      const item = 'drafts'
      const amount = 2
      const expectedAction = {
        type: action.SET_SYNCED_ITEM_AMOUNT,
        item,
        amount
      }
      expect(action.setSyncedItemAmount(item, amount)).toEqual(expectedAction)
    })
  })
})
