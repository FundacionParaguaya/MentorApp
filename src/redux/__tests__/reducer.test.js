import * as action from '../actions'
import * as reducer from '../reducer'

jest.useFakeTimers()

describe('environment reducer', () => {
  it('should handle SET_ENV', () => {
    expect(
      reducer.env('development', {
        type: action.SET_ENV,
        env: 'production'
      })
    ).toEqual('production')
  })
})

describe('dimensions reducer', () => {
  it('should handle SET_DIMENSIONS', () => {
    expect(
      reducer.dimensions(
        { width: null, height: null },
        {
          type: action.SET_DIMENSIONS,
          dimensions: { width: 10, height: 10 }
        }
      )
    ).toEqual({ width: 10, height: 10 })
  })
})

describe('login reducer', () => {
  it('should handle SET_LOGIN_STATE success', () => {
    expect(
      reducer.user(
        { token: null, status: null, username: null },
        {
          type: action.SET_LOGIN_STATE,
          token: 'token',
          username: 'user',
          status: 200
        }
      )
    ).toEqual({ token: 'token', status: 200, username: 'user' })
  })

  it('should handle SET_LOGIN_STATE on error', () => {
    expect(
      reducer.user(
        { token: null, status: null, username: null },
        {
          type: action.SET_LOGIN_STATE,
          token: null,
          status: 401,
          username: null
        }
      )
    ).toEqual({ token: null, status: 401, username: null })
  })

  it('should handle USER_LOGOUT', () => {
    expect(
      reducer.user(
        { token: '2525', status: 'test', username: 'test' },
        {
          type: action.USER_LOGOUT
        }
      )
    ).toEqual({
      role: null,
      token: null,
      username: null,
      status: null
    })
  })

  describe('surveys reducer', () => {
    const payload = {
      data: {
        surveysByUser: []
      }
    }
    it('should handle LOAD_SURVEYS', () => {
      expect(
        reducer.surveys([], {
          type: action.LOAD_SURVEYS,
          payload
        })
      ).toEqual(payload.data.surveysByUser)
      expect(
        reducer.surveys([], {
          type: action.LOAD_SURVEYS
        })
      ).toEqual([])
    })
  })

  describe('families reducer', () => {
    const payload = {
      data: {
        familiesNewStructure: []
      }
    }
    it('should handle LOAD_FAMILIES', () => {
      expect(
        reducer.families([], {
          type: action.LOAD_FAMILIES,
          payload
        })
      ).toEqual(payload.data.familiesNewStructure)
      expect(
        reducer.families([], {
          type: action.LOAD_FAMILIES
        })
      ).toEqual([])
    })
  })

  describe('drafts reducer', () => {
    const initialStore = [
      {
        draftId: 1,
        status: 'Synced'
      },
      {
        draftId: 2,
        status: 'Draft',
        priorities: [
          { indicator: 'phoneNumber', action: 'Action', reason: 'reason' }
        ],
        familyData: {
          familyMembersList: [
            ({ name: 'Joan', socioEconomicAnswers: [] }, { name: 'Jane' })
          ]
        }
      }
    ]
    it('should handle CREATE_DRAFT', () => {
      const payload = {
        draftId: 3
      }
      expect(
        reducer.drafts(initialStore, {
          type: action.CREATE_DRAFT,
          payload
        })
      ).toEqual([...initialStore, payload])
    })

    it('should handle SUBMIT_DRAFT', () => {
      const expectedStore = [
        {
          draftId: 1,
          status: 'Pending sync'
        },
        {
          draftId: 2,
          status: 'Draft',
          priorities: [
            { indicator: 'phoneNumber', action: 'Action', reason: 'reason' }
          ],
          familyData: {
            familyMembersList: [({ name: 'Joan' }, { name: 'Jane' })]
          }
        }
      ]
      expect(
        reducer.drafts(initialStore, {
          type: action.SUBMIT_DRAFT,
          id: 1
        })
      ).toEqual(expectedStore)
    })
    it('should handle SUBMIT_DRAFT_COMMIT', () => {
      const expectedStore = [
        {
          draftId: 1,
          status: 'Synced'
        },
        {
          draftId: 2,
          status: 'Synced',
          priorities: [
            { indicator: 'phoneNumber', action: 'Action', reason: 'reason' }
          ],
          familyData: {
            familyMembersList: [({ name: 'Joan' }, { name: 'Jane' })]
          }
        }
      ]
      expect(
        reducer.drafts(initialStore, {
          type: action.SUBMIT_DRAFT_COMMIT,
          meta: { id: 2 }
        })[0]
      ).toEqual(expect.objectContaining(expectedStore[0]))

      expect(
        reducer.drafts(initialStore, {
          type: action.SUBMIT_DRAFT_COMMIT,
          meta: { id: 2 }
        })[1]
      ).toEqual(expect.objectContaining(expectedStore[1]))
    })

    it('should handle ADD_SURVEY_DATA', () => {
      const expectedStore = [
        {
          draftId: 1,
          status: 'Synced'
        },
        {
          draftId: 2,
          personal_survey_data: { name: 'Name' },
          status: 'Draft',
          priorities: [
            { indicator: 'phoneNumber', action: 'Action', reason: 'reason' }
          ],
          familyData: {
            familyMembersList: [({ name: 'Joan' }, { name: 'Jane' })]
          }
        }
      ]
      expect(
        reducer.drafts(initialStore, {
          type: action.ADD_SURVEY_DATA,
          id: 2,
          category: 'personal_survey_data',
          payload: { name: 'Name' }
        })
      ).toEqual(expectedStore)
    })
  })

  describe('language reducer', () => {
    it('should handle SWITCH_LANGUAGE', () => {
      expect(
        reducer.language('en', {
          type: action.SWITCH_LANGUAGE,
          language: 'es'
        })
      ).toEqual('es')
    })
  })

  describe('hydration reducer', () => {
    it('should handle SET_HYDRATED', () => {
      expect(
        reducer.hydration(false, {
          type: action.SET_HYDRATED
        })
      ).toEqual(true)
    })
  })

  describe('sync reducer', () => {
    it('should handle SET_SYNCED_ITEM_TOTAL', () => {
      expect(
        reducer.sync(
          {
            surveys: {
              total: 0,
              synced: 0
            },
            drafts: {
              total: 0,
              synced: 0
            }
          },
          {
            type: action.SET_SYNCED_ITEM_TOTAL,
            item: 'drafts',
            amount: 10
          }
        )
      ).toEqual({
        surveys: {
          total: 0,
          synced: 0
        },
        drafts: {
          total: 10,
          synced: 0
        }
      })
    })

    it('should handle SET_SYNCED_ITEM_AMOUNT', () => {
      expect(
        reducer.sync(
          {
            surveys: {
              total: 0,
              synced: 0
            },
            drafts: {
              total: 0,
              synced: 0
            }
          },
          {
            type: action.SET_SYNCED_ITEM_AMOUNT,
            item: 'drafts',
            amount: 2
          }
        )
      ).toEqual({
        surveys: {
          total: 0,
          synced: 0
        },
        drafts: {
          total: 0,
          synced: 2
        }
      })
    })
  })
})

describe('root reducer', () => {
  reducer.rootReducer(
    { user: { token: '123', username: 'test' }, surveys: [{ id: 1 }] },
    {
      type: action.SUBMIT_DRAFT_ROLLBACK,
      meta: { sanitizedSnapshot: { surveyId: 1 } }
    }
  )

  reducer.rootReducer(
    {},
    {
      type: action.SET_SYNCED_ITEM_TOTAL,
      item: 'images'
    }
  )

  reducer.rootReducer(
    {},
    {
      type: action.LOAD_SURVEYS_COMMIT,
      payload: { data: { surveysByUser: [] } }
    }
  )

  reducer.rootReducer(
    {},
    {
      type: action.LOAD_FAMILIES_COMMIT,
      payload: { data: { familiesNewStructure: [] } }
    }
  )
})
