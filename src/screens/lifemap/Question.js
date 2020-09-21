import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';

import IconButton from '../../components/IconButton';
import Popup from '../../components/Popup';
import SliderComponent from '../../components/Slider';
import StickyFooter from '../../components/StickyFooter';
import {updateDraft} from '../../redux/actions';
import colors from '../../theme.json';
import {getTotalEconomicScreens} from './helpers';
import globalStyles from '../../globalStyles';

function Question(props) {
  let step = props.route.params.step;
  let survey = props.route.params.survey;
  let draftId = props.route.params.draftId;
  let answeringSkipped = props.route.params.answeringSkipped;

  let indicators = props.route.params.survey.surveyStoplightQuestions;
  let indicator = indicators[step];

  let slides = indicator.stoplightColors;
  let readOnly = props.route.params.readOnly;
  const [showDefinition, setShowDefinition] = useState(false);

  const getDraft = () =>
    props.drafts.find((draft) => draft.draftId === draftId);
  const getFieldValue = (field) => {
    const draft = getDraft();

    const indicatorObject =
      draft && draft.indicatorSurveyDataList
        ? draft.indicatorSurveyDataList.find((item) => item.key === field)
        : null;
    if (indicatorObject) {
      return indicatorObject.value;
    }
  };
  const selectAnswer = (answer = 0) => {
    const draft = getDraft();

    const skippedQuestions = draft.indicatorSurveyDataList.filter(
      (question) => question.value === 0,
    );
    const fieldValue = getFieldValue(indicator.codeName);

    let updatedIndicators;

    if (
      draft.indicatorSurveyDataList.find(
        (item) => item.key === indicator.codeName,
      )
    ) {
      updatedIndicators = draft.indicatorSurveyDataList.map((item) => {
        if (item.key === indicator.codeName) {
          return {...item, value: answer};
        } else {
          return item;
        }
      });
    } else {
      updatedIndicators = [
        ...draft.indicatorSurveyDataList,
        {key: indicator.codeName, value: answer},
      ];
    }

    let updatedDraft = {
      ...draft,
      indicatorSurveyDataList: updatedIndicators,
    };

    //When the user changes the answer of a question
    if (fieldValue !== answer) {
      //If the indicator is green or skipped

      if (answer === 3 || answer === 0) {
        //delete priority
        updatedDraft = {
          ...draft,
          indicatorSurveyDataList: updatedIndicators,
          priorities: [
            ...draft.priorities.filter(
              (item) => item.indicator !== indicator.codeName,
            ),
          ],
        };
      }
      //If indicator is yellow, red or skipped
      if (answer < 3) {
        //Delete achievements
        updatedDraft = {
          ...draft,
          indicatorSurveyDataList: updatedIndicators,
          achievements: [
            ...draft.achievements.filter(
              (item) => item.indicator !== indicator.codeName,
            ),
          ],
        };
      }
    }

    props.updateDraft(updatedDraft);

    // after updating the draft, navigate based on navigation state
    if (step + 1 < indicators.length && !answeringSkipped) {
      return props.navigation.replace('Question', {
        step: step + 1,
        draftId: draftId,
        survey: survey,
      });
    } else if (step + 1 >= indicators.length && answer === 0) {
      return props.navigation.navigate('Skipped', {
        draftId: draftId,
        survey: survey,
      });
    } else if (
      (answeringSkipped && skippedQuestions.length === 1 && answer !== 0) ||
      skippedQuestions.length === 0
    ) {
      return props.navigation.navigate('Overview', {
        resumeDraft: false,
        draftId: draftId,
        survey: survey,
      });
    } else {
      return props.navigation.navigate('Skipped', {
        draftId: draftId,
        survey: survey,
      });
    }
  };
  const onPressBack = () => {
    // navigate back to skipped questions if answering one,
    // otherwise to the expected screen in the lifemap flow
    if (answeringSkipped) {
      props.navigation.navigate('Skipped', {
        draftId: draftId,
        survey: survey,
      });
    } else if (step > 0) {
      props.navigation.replace('Question', {
        step: step - 1,
        draftId: draftId,
        survey: survey,
      });
    } else {
      props.navigation.navigate('BeginLifemap', {
        draftId: draftId,
        survey: survey,
      });
    }
  };
  const toggleDefinitionWindow = (stateWindow) => {
    setShowDefinition(stateWindow);
  };
  useEffect(() => {
    const draft = getDraft();

    props.updateDraft({
      ...draft,
      progress: {
        ...draft.progress,
        screen: 'Question',
        step: step,
      },
    });

    props.navigation.setParams({
      onPressBack: onPressBack,
    });
  }, []);
  //REFACTORNOTE
  // shouldComponentUpdate() {
  //   return props.navigation.isFocused();
  // }

  const draft = getDraft();
  // added a popup component to the Question.js instead of adding it to the
  // modals folder because it is really smol and does not do much

  const {t} = props;
  return (
    <View style={{flex: 1}}>
      <StickyFooter
        visible={false}
        readOnly
        progress={
          ((draft.familyData.countFamilyMembers > 1 ? 5 : 4) + step) /
            draft.progress.total || getTotalEconomicScreens(survey)
        }
        currentScreen="Question">
        {showDefinition ? (
          <Popup
            modifiedPopUp
            definition
            isOpen={showDefinition}
            onClose={() => toggleDefinitionWindow(false)}>
            <Icon
              style={styles.closeIconStyle}
              onPress={() => toggleDefinitionWindow(false)}
              name="close"
              size={20}
            />
            <Text
              style={{
                ...globalStyles.h3Bold,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              {t('views.lifemap.indicatorDefinition')}
            </Text>
            <Text
              id="definition"
              style={{
                fontSize: 16,
              }}>
              {indicator.definition || null}
            </Text>
          </Popup>
        ) : null}

        <SliderComponent
          slides={slides}
          value={getFieldValue(indicator.codeName)}
          selectAnswer={selectAnswer}
        />

        <View style={styles.skip}>
          {indicator.definition ? (
            <Icon
              id="show-definition"
              onPress={() => toggleDefinitionWindow(true)}
              name="info"
              color={colors.palegrey}
              size={40}
              style={{
                color: colors.palegreen,
                position: 'absolute',
                top: '55%',
                left: '10%',
              }}
            />
          ) : null}

          {indicator.required ? (
            <Text>{t('views.lifemap.responseRequired')}</Text>
          ) : (
            <IconButton
              text={t('views.lifemap.skipThisQuestion')}
              textStyle={styles.link}
              onPress={() => selectAnswer(0)}
            />
          )}
        </View>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  closeIconStyle: {
    color: colors.palegreen,
    marginLeft: 'auto',
    fontSize: 35,
  },
  skip: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    marginBottom: 120,
  },
  link: {
    color: colors.palegreen,
  },
});

Question.propTypes = {
  drafts: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  dimensions: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  updateDraft: PropTypes.func.isRequired,
};

const mapStateToProps = ({dimensions, drafts}) => ({
  dimensions,
  drafts,
});

const mapDispatchToProps = {updateDraft};

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Question),
);
