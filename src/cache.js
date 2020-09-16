import RNFetchBlob from 'rn-fetch-blob'
import store from './redux/store'
import { setSyncedItemTotal, setSyncedItemAmount } from './redux/actions'
let dirs = RNFetchBlob.fs.dirs

export const getSurveys = () => store.getState().surveys
let isOnline = true

export const filterURLsFromSurveys = surveys => {
  const imageURLs = []
  surveys.forEach(survey =>
    survey.surveyStoplightQuestions.forEach(question =>
      question.stoplightColors.forEach(color => imageURLs.push(color.url))
    )
  )
  // set total amount of images to be cached
  store.dispatch(setSyncedItemTotal('images', imageURLs.length))
  return imageURLs
}

export const cacheImages = async imageURLs => {
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      // break loop if offline
      if (!isOnline) {
        break
      }
      await callback(array[index], index, array)
    }
  }

  store.dispatch(setSyncedItemAmount('images', 0))

  await asyncForEach(imageURLs, async source => {
    RNFetchBlob.fs
      .exists(`${dirs.DocumentDir}/${source.replace(/https?:\/\//, '')}`)
      .then(exist => {
        if (!exist && isOnline) {
          RNFetchBlob.config({
            fileCache: true,
            appendExt: 'jpg',
            path: `${dirs.DocumentDir}/${source.replace(/https?:\/\//, '')}`
          })
            .fetch('GET', source)
            .then(() => {
              store.dispatch(
                setSyncedItemAmount(
                  'images',
                  store.getState().sync.images.synced + 1
                )
              )
            })
            .catch(() => {})
        } else if (exist) {
          store.dispatch(
            setSyncedItemAmount(
              'images',
              store.getState().sync.images.synced + 1
            )
          )
        }
      })
  })
}

export const filterAudioURLsFromSurveys = surveys => {
  const audioURLS = []
  surveys.forEach(survey => 
      survey.surveyStoplightQuestions.forEach(question => question.questionAudio && audioURLS.push(question.questionAudio))
    )

    // set total amount of audio to be cached
    store.dispatch(setSyncedItemTotal('audios', audioURLS.length));
    return audioURLS
}

export const cacheAudios = async audioURLS => {
  async function asyncForEach(array, callback)  {
    for(let index = 0; index < array.length; index++) {
      if(!isOnline){
        break
      }
      await callback(array[index], index, array)
    }
  }
  store.dispatch(setSyncedItemAmount('audios',0))

  await asyncForEach(audioURLS, async source => {
    RNFetchBlob.fs.
      exists(`${dirs.DocumentDir}/${source.replace(/https?:\/\//, '')}`)
      .then(exist => {
        if(!exist && isOnline){
          RNFetchBlob.config({
            fileCache: true,
            appendExt: 'mp4',
            path: `${dirs.DocumentDir}/${source.replace(/https?:\/\//, '')}`
          })
          .fetch('GET',source)
          .then(()=> {
            store.dispatch(
              setSyncedItemAmount('audios',
                store.getState().sync.audios.synced + 1
              )
            )
          })
          .catch(()=>{} )
        }else if (exist) {
          store.dispatch(setSyncedItemAmount('audios', store.getState().sync.audios.synced + 1))
        }
      })
  })
}


export const initImageCaching = async () => {
  const surveys = getSurveys()
  const imageURLs = await filterURLsFromSurveys(surveys)
  cacheImages(imageURLs)
}



export const initAudioCaching = async () => {
  const surveys = getSurveys();
  const audioURLS = await filterAudioURLsFromSurveys(surveys);
  cacheAudios(audioURLS);
}
