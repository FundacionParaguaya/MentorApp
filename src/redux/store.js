import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'
import { offline } from '@redux-offline/redux-offline'
import { rootReducer } from './reducer'
import { setHydrated } from './actions'
import { setLanguage } from '../i18n'
let rehydrated = false

export const getHydrationState = () => rehydrated

const setHydratedState = () => store.dispatch(setHydrated())

// __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ enables seeing the redux store in the
// debugger. atob !== 'undefined' checks if remote debugging is enabled on the
// device
const store = createStore(
  rootReducer,
  typeof window !== 'undefined' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined' &&
    typeof atob !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
        applyMiddleware(thunk),
        offline({
          ...offlineConfig,
          persistOptions: {
            blacklist: ['hydration']
          },
          // this fires after store hydration is done
          persistCallback: () => {
            setLanguage()
            setHydratedState()
          },
          retry: () => 600000 // retry every 10 minutes
        })
      )
    : compose(
        applyMiddleware(thunk),
        offline({
          ...offlineConfig,
          persistOptions: {
            blacklist: ['hydration']
          },
          persistCallback: () => {
            setLanguage()
            setHydratedState()
          },
          retry: () => 600000 // retry every 10 minutes
        })
      )
)

export default store
