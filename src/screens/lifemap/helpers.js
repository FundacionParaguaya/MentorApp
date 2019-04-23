import store from '../../redux/store'
import draftMock from '../__mocks__/draftMock'

export const getDraft = () =>
  store
    .getState()
    .drafts.find(draft => draft.draftId === store.getState().nav.draftId) ||
  draftMock
