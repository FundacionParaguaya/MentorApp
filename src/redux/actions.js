// Login

export const SET_LOGIN_STATE = 'SET_LOGIN_STATE'
export const USER_LOGOUT = 'USER_LOGOUT'

export const login = (username, password, env) => dispatch =>
  fetch(
    `${env}/oauth/token?username=${username}&password=${password}&grant_type=password`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic bW9iaWxlQ2xpZW50SWQ6bW9iaWxlQ2xpZW50U2VjcmV0'
      }
    }
  )
    .then(data => {
      if (data.status !== 200) {
        dispatch({
          type: SET_LOGIN_STATE,
          token: null,
          status: data.status,
          username: null
        })
        throw new Error()
      } else return data.json()
    })
    .then(data =>
      dispatch({
        type: SET_LOGIN_STATE,
        token: data.access_token,
        status: 200,
        username: data.user.username
      })
    )
    .catch(e => e)

export const logout = () => ({
  type: USER_LOGOUT
})

// Dimensions

export const SET_DIMENSIONS = 'SET_DIMENSIONS'

export const setDimensions = dimensions => ({
  type: SET_DIMENSIONS,
  dimensions
})

// Environment

export const SET_ENV = 'SET_ENV'

export const setEnv = env => ({
  type: SET_ENV,
  env
})

// Surveys

export const LOAD_SURVEYS = 'LOAD_SURVEYS'
export const LOAD_SURVEYS_COMMIT = 'LOAD_SURVEYS_COMMIT'

export const loadSurveys = (env, token) => ({
  type: LOAD_SURVEYS,
  env,
  token,
  meta: {
    offline: {
      effect: {
        url: `${env}/graphql`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          query:
            'query { surveysByUser { title id minimumPriorities privacyPolicy { title  text } termsConditions{ title text }  surveyConfig { documentType {text value otherOption} gender { text value otherOption} countryOfBirth{text value} surveyLocation { country latitude longitude} }  surveyEconomicQuestions { questionText codeName answerType topic required forFamilyMember options {text value otherOption} conditions{codeName type value operator} } surveyStoplightQuestions { questionText codeName dimension id stoplightColors { url value description } required } } }'
        })
      },
      commit: { type: LOAD_SURVEYS_COMMIT }
    }
  }
})

// Families

export const LOAD_FAMILIES = 'LOAD_FAMILIES'
export const LOAD_FAMILIES_COMMIT = 'LOAD_FAMILIES_COMMIT'

export const loadFamilies = (env, token) => ({
  type: LOAD_FAMILIES,
  env,
  token,
  meta: {
    offline: {
      effect: {
        url: `${env}/graphql`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          query:
            'query { familiesNewStructure {familyId name code snapshotList { surveyId createdAt familyData { familyMembersList { birthCountry birthDate documentNumber documentType email familyId firstName firstParticipant gender id lastName memberIdentifier phoneNumber socioEconomicAnswers { key value}  }  countFamilyMembers latitude longitude country accuracy } economicSurveyDataList { key value } indicatorSurveyDataList { key value } achievements { action indicator roadmap } priorities { action estimatedDate indicator reason } } } }'
        })
      },
      commit: { type: LOAD_FAMILIES_COMMIT }
    }
  }
})

// Drafts

export const CREATE_DRAFT = 'CREATE_DRAFT'
export const DELETE_DRAFT = 'DELETE_DRAFT'
export const ADD_SURVEY_DATA_CHECKBOX = 'ADD_SURVEY_DATA_CHECKBOX'
export const ADD_SURVEY_DATA = 'ADD_SURVEY_DATA'
export const ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA =
  'ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA'
export const DELETE_SURVEY_PRIORITY_ACHEIVEMENT_DATA =
  'DELETE_SURVEY_PRIORITY_ACHEIVEMENT_DATA'
export const ADD_SURVEY_FAMILY_MEMBER_DATA = 'ADD_SURVEY_FAMILY_MEMBER_DATA'
export const SUBMIT_DRAFT = 'SUBMIT_DRAFT'
export const SUBMIT_DRAFT_COMMIT = 'SUBMIT_DRAFT_COMMIT'
export const SUBMIT_DRAFT_ROLLBACK = 'SUBMIT_DRAFT_ROLLBACK'
export const REMOVE_FAMILY_MEMBERS = 'REMOVE_FAMILY_MEMBERS'
export const ADD_DRAFT_PROGRESS = 'ADD_DRAFT_PROGRESS'

export const createDraft = payload => ({
  type: CREATE_DRAFT,
  payload
})

export const deleteDraft = id => ({
  type: DELETE_DRAFT,
  id
})

export const addDraftProgress = (id, progress) => ({
  type: ADD_DRAFT_PROGRESS,
  id,
  progress
})

export const addSurveyPriorityAcheivementData = ({
  id,
  category,
  payload
}) => ({
  type: ADD_SURVEY_PRIORITY_ACHEIVEMENT_DATA,
  id,
  category,
  payload
})

export const deleteSurveyPriorityAcheivementData = ({
  id,
  category,
  indicator
}) => ({
  type: DELETE_SURVEY_PRIORITY_ACHEIVEMENT_DATA,
  id,
  category,
  indicator
})

export const addSurveyFamilyMemberData = ({
  id,
  index,
  payload,
  isSocioEconomicAnswer
}) => ({
  type: ADD_SURVEY_FAMILY_MEMBER_DATA,
  id,
  index,
  isSocioEconomicAnswer,
  payload
})

export const removeFamilyMembers = (id, afterIndex) => ({
  type: REMOVE_FAMILY_MEMBERS,
  id,
  afterIndex
})

export const addSurveyDataCheckBox = (id, category, payload) => ({
  type: ADD_SURVEY_DATA_CHECKBOX,
  category,
  id,
  payload
})
export const addSurveyData = (id, category, payload) => ({
  type: ADD_SURVEY_DATA,
  category,
  id,
  payload
})

export const submitDraft = (env, token, id, payload) => ({
  type: SUBMIT_DRAFT,
  env,
  token,
  id,
  payload,

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
        type: SUBMIT_DRAFT_COMMIT,
        meta: {
          id,
          payload
        }
      },
      rollback: {
        type: SUBMIT_DRAFT_ROLLBACK,
        meta: {
          id,
          payload
        }
      }
    }
  }
})

// Language
export const SWITCH_LANGUAGE = 'SWITCH_LANGUAGE'

export const switchLanguage = language => ({
  type: SWITCH_LANGUAGE,
  language
})

// Store Hydration
export const SET_HYDRATED = 'SET_HYDRATED'

export const setHydrated = () => ({
  type: SET_HYDRATED
})

// Sync
export const SET_SYNCED_ITEM_TOTAL = 'SET_SYNCED_ITEM_TOTAL'
export const SET_SYNCED_ITEM_AMOUNT = 'SET_SYNCED_ITEM_AMOUNT'
export const SET_SYNCED_STATE = 'SET_SYNCED_STATE'
export const RESET_SYNCED_STATE = 'RESET_SYNCED_STATE'

export const setSyncedItemTotal = (item, amount) => ({
  type: SET_SYNCED_ITEM_TOTAL,
  item,
  amount
})

export const setSyncedItemAmount = (item, amount) => ({
  type: SET_SYNCED_ITEM_AMOUNT,
  item,
  amount
})

export const setAppVersion = value => ({
  type: SET_SYNCED_STATE,
  item: 'appVersion',
  value
})

export const resetSyncState = () => ({
  type: RESET_SYNCED_STATE
})

// NAV
export const UPDATE_NAV = 'UPDATE_NAV'

export const updateNav = (item, value) => ({
  type: UPDATE_NAV,
  item,
  value
})
