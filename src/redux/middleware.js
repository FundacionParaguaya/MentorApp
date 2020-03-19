import { submitDraft } from './actions'

export const submitDraftWithImages = store => next => action => {
  if (action.type === 'LOAD_IMAGES_COMMIT') {
    let payload = JSON.stringify(action.payload)
    console.log('Middleware---')
    console.log(payload)
    //console.log(action);

    let reduce = submitDraft(action.env, action.token, action.id, {
      ...action.draft,
      pictures: JSON.parse(payload)
    })

    console.log('Next action should be: ')
    console.log(reduce)
    store.dispatch(reduce)
  }
  let result = next(action)
  return result
}
