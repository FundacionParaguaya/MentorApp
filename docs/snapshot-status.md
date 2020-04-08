Snapshots can be in differents status in the app. Here is a explanation of each status
## Sync pending

1. When the draft is submitted but the http call to the backend is queued with redux-offline. If it is in offline mode it will stay in ``Sync Pending`` until it has internet and can make the post to the backend.
2. When the images are submitted but the call to the backend is queued with redux-offline. If it is in offline mode it will stay in this state until it has internet and can make the post to the backend. 
3. When the image post has already been made, it will remains in this state, until it can execute the SUBMIT_DRAFT action.

### Reducers Involved 
LOAD_IMAGES
LOAD_IMAGES_COMMIT
SUBMIT_DRAFT

## Sync error
1. When the invocation to the backend fails after executing the SUBMIT_DRAFT action and activating the SUBMIT_DRAFT_ROLLBACK action.
2. When the invocation to the backend fails after executing the LOAD_IMAGES action and activating the LOAD_IMAGES_ROLLBACK action.

### Reducers Involved 
LOAD_IMAGES_ROLLBACK
SUBMIT_DRAFT_ROLLBACK

## Draft
1. Default snapshot status. It stays in this state as long as a LOAD_IMAGES or SUBMIT_DRAFT action is not executing.
2. If the survey is closed at any point, it is saved as DRAFT.
3. If the app is closed at any survey taking point before saving the snapshot.

There are no associated reducers, because when creating the draft of the snapshot in the store this is the default status.

## Synced

1. Only when the SUBMIT_DRAFT_COMMIT action is executed after activating SUBMIT_DRAFT and achieving the correct invocation to the backend to save the data.

### Reducer Involved 
SUBMIT_DRAFT_COMMIT