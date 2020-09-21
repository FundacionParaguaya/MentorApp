import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import Button from '../../components/Button';
import Decoration from '../../components/decoration/Decoration';
import RoundImage from '../../components/RoundImage';
import StickyFooter from '../../components/StickyFooter';
import globalStyles from '../../globalStyles';
import {updateDraft} from '../../redux/actions';
import {getTotalEconomicScreens} from './helpers';

function BeginLifemap(props) {
  const [survey, setSurvey] = useState(props.route.params.survey);
  const [draftId, setDraftId] = useState(props.route.params.draftId);
  const [draft, setDraft] = useState(
    props.drafts.find((draft) => draft.draftId === draftId),
  );

  const onPressBack = () => {
    const previousPage =
      survey.surveyEconomicQuestions && survey.surveyEconomicQuestions.length
        ? 'SocioEconomicQuestion'
        : 'Location';

    props.navigation.replace(previousPage, {
      fromBeginLifemap: true,
      survey: survey,
      draftId: draftId,
    });
  };

  const onContinue = () => {
    props.updateDraft({
      ...draft,
      stoplightSkipped: false,
    });
    draft.stoplightSkipped = false;
    props.navigation.navigate('Question', {
      step: 0,
      survey: survey,
      draftId: draftId,
    });
  };

  const onSaveSnapshot = () => {
    console.log('Skipped Stoplight Section');
    console.log('Draft');
    console.log(draft);
    props.updateDraft({
      ...draft,
      stoplightSkipped: true,
    });
    draft.stoplightSkipped = true;

    if (survey.surveyConfig.pictureSupport) {
      props.navigation.replace('Picture', {
        survey: survey,
        draftId: draftId,
      });
    } else if (survey.surveyConfig.signSupport) {
      props.navigation.replace('Signin', {
        step: 0,
        survey: survey,
        draftId: draftId,
      });
    } else {
      props.navigation.navigate('Final', {
        fromBeginLifemap: true,
        survey: survey,
        draftId: draftId,
        draft: draft,
      });
    }
  };

  useEffect(() => {
    if (draft.progress.screen !== 'BeginLifemap') {
      props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'BeginLifemap',
        },
      });
    }

    props.navigation.setParams({
      onPressBack: onPressBack,
    });
  }, []);
  const {t} = props;
  return (
    <StickyFooter
      onContinue={onContinue}
      continueLabel={
        survey.surveyConfig.stoplightOptional
          ? t('general.completeStoplight')
          : t('general.continue')
      }
      progress={
        ((draft.familyData.countFamilyMembers > 1 ? 4 : 3) +
          getTotalEconomicScreens(survey)) /
        draft.progress.total
      }>
      <View
        style={{
          ...globalStyles.containerNoPadding,
          padding: 0,
          paddingTop: 0,
        }}>
        <Text id="label" style={{...globalStyles.h2Bold, ...styles.text}}>
          {!survey.surveyConfig.stoplightOptional
            ? t('views.lifemap.thisLifeMapHas').replace(
                '%n',
                survey.surveyStoplightQuestions.length,
              )
            : t('views.lifemap.thisLifeMapHasNoStoplight').replace(
                '%n',
                survey.surveyStoplightQuestions.length,
              )}
        </Text>

        <Decoration variation="terms">
          <RoundImage source="stoplight" />
        </Decoration>
      </View>
      <View style={{height: 50}} />
      {survey.surveyConfig.stoplightOptional && (
        <Button
          id="skipStoplight"
          style={{...styles.button, ...styles.skipButton}}
          handleClick={onSaveSnapshot}
          outlined
          text={t('general.closeAndSign')}
        />
      )}
    </StickyFooter>
  );
}

const styles = StyleSheet.create({
  button: {width: '70%', alignSelf: 'center', marginTop: 20},
  skipButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignSelf: 'center',
  },
  text: {
    textAlign: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
    paddingBottom: 30,
  },
});

BeginLifemap.propTypes = {
  t: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
};

const mapDispatchToProps = {
  updateDraft,
};

const mapStateToProps = ({drafts}) => ({drafts});

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(BeginLifemap),
);
