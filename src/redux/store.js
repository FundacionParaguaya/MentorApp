import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'
import { offline } from '@redux-offline/redux-offline'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer } from './reducer'
import { setHydrated } from './actions'
import { setLanguage } from '../i18n'
let rehydrated = false

export const getHydrationState = () => rehydrated

const setHydratedState = () => store.dispatch(setHydrated())

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
      retry: () => 60000 // retry  every 5 minutes
    }),
    applyMiddleware(thunk)
  )
)

export default store
