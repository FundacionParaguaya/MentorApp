import {createStore, applyMiddleware, compose} from 'redux';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import AsyncStorage from '@react-native-community/async-storage';
import * as _ from 'lodash';
import {autoRehydrate, persistStore, getStoredState} from 'redux-persist';
import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import {rootReducer} from './reducer';
import {setHydrated} from './actions';
import {setLanguage} from '../i18n';
import thunk from 'redux-thunk';
import {submitDraftWithImages} from './middleware';

let rehydrated = false;

export const getHydrationState = () => rehydrated;

const setHydratedState = () => store.dispatch(setHydrated());

const reduxOfflineConfig = {
  persist: null,
  ...offlineConfig,
  persistOptions: {
    blacklist: ['hydration'],
  },
  // this fires after store hydration is done
  persistCallback: () => {
    setLanguage();
    setHydratedState();
  },
  retry: () => 300000, // retry  every 5 minutes
};
const middlewaresToApply = [thunk, submitDraftWithImages];
const store = createStore(
  rootReducer,
  compose(
    offline(reduxOfflineConfig),
    applyMiddleware(...middlewaresToApply),
    autoRehydrate(),
  ),
);

const fsPersistor = persistStore(
  store,
  {
    blacklist: ['hydration'],
    debounce: 500,
    storage: FilesystemStorage,
  },
  async (fsError, fsResult) => {
    if (_.isEmpty(fsResult)) {
      try {
        const asyncState = await getStoredState({storage: AsyncStorage});
        if (!_.isEmpty(asyncState)) {
          fsPersistor.rehydrate(asyncState, {serial: false});
        }
      } catch (getStateError) {
        console.warn('getStoredState error', getStateError);
      }
    }
  },
);

export default store;
