import { submitDraft } from './actions'

export const submitDraftWithImages = store => next => action => {
  if (action.type === 'LOAD_IMAGES_COMMIT') {
    let payload = JSON.stringify(action.payload)

    let reduce = submitDraft(action.env, action.token, action.id, {
      ...action.draft,
      pictures: JSON.parse(payload)
    })

    console.log('LOAD IMAGES SUCCESS')
    store.dispatch(reduce)
  }

  if (action.type === 'LOAD_IMAGES_ROLLBACK') {
    //Submit draft without pictures anyway
    let reduce = submitDraft(action.env, action.token, action.id, {
      ...action.draft,
      pictures: []
    })
    console.log('LOAD IMAGES ROLLBACK')
    store.dispatch(reduce)
  }

  let result = next(action)
  return result
}
