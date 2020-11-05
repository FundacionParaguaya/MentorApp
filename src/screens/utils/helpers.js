import {getTotalScreens} from '../lifemap/helpers';
import {
  getConditionalQuestions,
  getDraftWithUpdatedQuestionsCascading,
} from '../utils/conditional_logic';
import {generateRandomDraftData} from './demo_draft_generator';
import {ImageStore} from 'react-native';

const LATIN_CHARS = /^[A-Za-z0-9]*$/;

export const checkAndReplaceSpecialChars = (question) => {
  return {
    ...question,
    options: question.options.map((option) => {
      return {
        ...option,
        text: LATIN_CHARS.test(option.text.replace(/\s/g, '')) // check for strange chars and if found decode
          ? option.text
          : decodeURIComponent(option.text),
      };
    }),
  };
};

export const prepareDraftForSubmit = (draft, survey) => {
  const conditionalQuestions = getConditionalQuestions(survey);
  const currentDraft = getDraftWithUpdatedQuestionsCascading(
    draft,
    conditionalQuestions,
    false,
  );

  // remove unnecessary for sync properties from saved draft
  const {previousIndicatorSurveyDataList, previousIndicatorPriorities, previousIndicatorAchievements, progress, errors, status, ...result} = Object.assign({}, currentDraft);

  // we remove
  previousIndicatorSurveyDataList;
  previousIndicatorPriorities;
  previousIndicatorAchievements;

  progress;
  errors;
  status;


  // check for frequent sync errors

  // set country to survey country if not set
  if (result.familyData && !result.familyData.country) {
    result.familyData.country =
      survey.surveyConfig.surveyLocation &&
      survey.surveyConfig.surveyLocation.country;
  }
  console.log('prepared', result)

  return result;
};
export const convertImages = (sanitizedSnapshot) => {
  // var base64Pictures = []
  const promises = [];
  for (var index in sanitizedSnapshot.pictures) {
    var picture = sanitizedSnapshot.pictures[index];
    const imagePromise = new Promise((resolve, reject) => {
      ImageStore.getBase64ForTag(
        picture.content,
        (success) => {
          resolve({
            name: picture.name,
            content: 'data:' + picture.type + ';base64,' + success,
            type: picture.type,
          });
        },
        () => reject('conversion to base64 failed'),
      );
    });
    promises.push(imagePromise);
  }
  return Promise.all(promises);
};

export const generateNewDemoDraft = (survey, draftId, projectId) => {
  const toalScreens = getTotalScreens(survey);
  const random = Math.floor(
    Math.random() & survey.surveyConfig.documentType.length,
  );
  const documentType = survey.surveyConfig.documentType[random];
  const surveyId = survey.id;
  return generateRandomDraftData(draftId, surveyId, toalScreens, documentType, projectId);
};

//helps us calculate the progress bar.
export const calculateProgressBar = ({readOnly,draft,screen = 1,isLast,currentScreen,skipQuestions}) =>{

  if(readOnly || !draft){
    return 0;
  }
  if(isLast){
    return (draft.progress.total -1) / draft.progress.total
  }
  if(skipQuestions){
    //search all surveys and remove the questions from the total of the draft.

   
    if(currentScreen == "Picture"){
      return (draft.progress.total -3) / draft.progress.total
    }else{
      //if we have the signing after the questions (e.g Testing, Fupa)
      let minusScreens = draft.indicatorSurveyDataList.length > 0 ? 1 : 2;
      return  (draft.progress.total - minusScreens) / draft.progress.total
    }
    //return 80%, or 90%;

  }

  //decide if we add one more screen if the primary participant is not alone (the family members screen).
  let showSkippedScreen = draft.indicatorSurveyDataList.findIndex(x=>x.value == 0) != -1 ? 1 : 0;
  let membersScreen = draft.familyData.familyMembersList.length > 1 ? 1 : 0;
  //let economicQuestions = draft.progress.socioEconomics ? draft.progress.socioEconomics.questionsPerScreen.length : 0;
 
//  let mainScreens = skipQuestions ? draft.progress.total - economicQuestions : draft.progress.total

  let totalScreens = draft.progress.total + membersScreen + showSkippedScreen;
 
  return screen / (totalScreens + 2);
  }
