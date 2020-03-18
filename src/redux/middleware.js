export const submitDraftWithImages = store => next => action => {
  if (action.type === 'LOAD_IMAGES_COMMIT') {
    let payload = JSON.stringify(action.payload)
    console.log('LOAD_IMAGES_COMMIT')
    console.log(payload)
  }
  let result = next(action)
  return result
}
