import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'
import { offline } from '@redux-offline/redux-offline'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from './reducer'
import { setHydrated } from './actions'
import { setLanguage } from '../i18n'
import defaultQueue from '@redux-offline/redux-offline/lib/defaults/queue'

let rehydrated = false

export const getHydrationState = () => rehydrated

const setHydratedState = () => store.dispatch(setHydrated())

const removeKeyFromObject = (obj, omitKey) => {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== omitKey) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

const store = createStore(
  rootReducer,
  composeWithDevTools(
    offline({
      ...offlineConfig,
      persistOptions: {
        blacklist: ['hydration', 'nav']
      },

      // this fires after store hydration is done
      persistCallback: () => {
        setLanguage()
        setHydratedState()
      },
      retry: () => 300000, // retry  every 5 minutes
      queue: {
        ...defaultQueue,
        enqueue(outbox, action) {
          return action.type !== 'SUBMIT_DRAFT'
            ? [...outbox, action]
            : outbox.filter(
                outboxAction =>
                  outboxAction.id !== action.id &&
                  outboxAction.payload.draftId !== action.payload.draftId &&
                  JSON.stringify(
                    removeKeyFromObject(outboxAction.meta, 'transaction')
                  ) !==
                    JSON.stringify(
                      removeKeyFromObject(action.meta, 'transaction')
                    )
              )
        },
        peek(outbox) {
          return outbox[0]
        }
      }
    }),
    applyMiddleware(thunk)
  )
)

export default store
