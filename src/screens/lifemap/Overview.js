import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {connect} from 'react-redux';
import arrow from '../../../assets/images/selectArrow.png';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import FilterListItem from '../../components/FilterListItem';
import LifemapOverview from '../../components/LifemapOverview';
import LifemapVisual from '../../components/LifemapVisual';
import StickyFooter from '../../components/StickyFooter';
import globalStyles from '../../globalStyles';
import {updateDraft} from '../../redux/actions';
import colors from '../../theme.json';

function Overview(props) {
  let survey = props.route.params.survey;
  let draftId = props.route.params.draftId;
  let familyLifemap = props.route.params.familyLifemap;
  let isResumingDraft = props.route.params.resumeDraft;
  let readOnly = props.route.params.readOnly || false;

  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(false);
  const [filterLabel, setFilterLabel] = useState(false);

  const getDraft = () =>
    props.drafts.find((draft) => draft.draftId === draftId);

  const onPressBack = () => {
    const draft = !props.readOnly ? getDraft() : props.familyLifemap;
    const survey = props.route.params.survey;

    //If we do not arrive to this screen from the families screen
    if (!familyLifemap) {
      const skippedQuestions = draft.indicatorSurveyDataList.filter(
        (question) => question.value === 0,
      );

      if (isResumingDraft) {
        props.navigation.replace('DrawerStack');
      } else if (skippedQuestions.length > 0) {
        props.navigation.navigate('Skipped', {
          draftId: draft.draftId,
          survey,
        });
      } else {
        props.navigation.navigate('Question', {
          step: survey.surveyStoplightQuestions.length - 1,
          draftId: draftId,
          survey,
        });
      }
    }
    // If we arrive to this screen from the families screen
    else {
      props.navigation.navigate('Families', {
        draftId: draftId,
        survey,
      });
    }
  };
  const navigateToScreen = (screen, indicator, indicatorText) => {
    props.navigation.navigate(screen, {
      survey: survey,
      indicator,
      indicatorText,
      draftId: draftId,
    });
  };
  const toggleFilterModal = () => {
    console.log('toggle');
    setFilterModalIsOpen(!filterModalIsOpen);
  };
  const selectFilter = (filter, filterLabel = false) => {
    console.log('here1');
    setSelectedFilter(filter);
    setFilterModalIsOpen(false);
    setFilterLabel(filterLabel);
    console.log('here2');
  };
  const onContinue = () => {
    navigateToScreen('Priorities');
  };
  const resumeDraft = () => {
    const draft = !props.readOnly ? getDraft() : props.familyLifemap;

    props.navigation.replace(draft.progress.screen, {
      resumeDraft: false,
      draftId: draftId,
      survey: survey,
      step: draft.progress.step,
    });
  };

  useEffect(() => {
    const draft = !props.readOnly ? getDraft() : props.familyLifemap;

    props.navigation.setParams({
      onPressBack: onPressBack,
      withoutCloseButton: draft.draftId ? false : true,
    });

    if (!isResumingDraft && !familyLifemap) {
      props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'Overview',
        },
      });
    }
  }, []);
  //REFACTORNOTE
  //  shouldComponentUpdate() {
  //   return props.navigation.isFocused();
  // }
  console.log('survey is');
  console.log(survey);
  const {t} = props;
  const draft = !props.readOnly ? getDraft() : props.familyLifemap;
  return props.readOnly ? (
    <View style={[globalStyles.background, styles.contentContainer]}>
      <View style={styles.indicatorsContainer}>
        <LifemapVisual
          large={props.readOnly}
          extraLarge={!props.readOnly}
          questions={draft.indicatorSurveyDataList}
          priorities={draft.priorities}
          achievements={draft.achievements}
          questionsLength={survey.surveyStoplightQuestions.length}
        />
      </View>
      {/*If we are in family/draft then show the questions.Else dont show them . This is requered for the families tab*/}
      <View>
        <View>
          <TouchableHighlight
            id="filters"
            underlayColor={'transparent'}
            activeOpacity={1}
            onPress={toggleFilterModal}
            accessible={true}>
            <View
              style={styles.listTitle}
              accessibilityLabel={
                filterLabel || t('views.lifemap.allIndicators')
              }
              accessibilityHint="Double tap to open dropdown">
              <Text style={globalStyles.subline}>
                {filterLabel || t('views.lifemap.allIndicators')}
              </Text>
              <Image source={arrow} style={styles.arrow} />
            </View>
          </TouchableHighlight>
          <LifemapOverview
            id="lifeMapOverview"
            surveyData={survey.surveyStoplightQuestions}
            draftData={draft}
            navigateToScreen={navigateToScreen}
            draftOverview={!isResumingDraft && !familyLifemap}
            selectedFilter={selectedFilter}
          />
        </View>

        {/* Filters modal */}
        <BottomModal
          isOpen={filterModalIsOpen}
          onRequestClose={toggleFilterModal}
          onEmptyClose={() => selectFilter(false)}>
          <View
            style={styles.dropdown}
            accessible={true}
            accessibilityLiveRegion="assertive">
            <Text style={[globalStyles.p, styles.modalTitle]}>
              {t('general.chooseView')}
            </Text>

            {/* All */}
            <View accessibilityLabel={t('views.lifemap.allIndicators')}>
              <FilterListItem
                id="all"
                onPress={() => selectFilter(false)}
                color={'#EAD1AF'}
                text={t('views.lifemap.allIndicators')}
                amount={draft.indicatorSurveyDataList.length}
              />
            </View>

            {/* Green */}
            <View accessibilityLabel={t('views.lifemap.allIndicators')}>
              <FilterListItem
                id="green"
                onPress={() => selectFilter(3, t('views.lifemap.green'))}
                color={colors.palegreen}
                text={t('views.lifemap.green')}
                amount={
                  draft.indicatorSurveyDataList.filter(
                    (item) => item.value === 3,
                  ).length
                }
              />
            </View>

            {/* Yellow */}
            <View accessibilityLabel={t('views.lifemap.yellow')}>
              <FilterListItem
                id="yellow"
                onPress={() => selectFilter(2, t('views.lifemap.yellow'))}
                color={colors.gold}
                text={t('views.lifemap.yellow')}
                amount={
                  draft.indicatorSurveyDataList.filter(
                    (item) => item.value === 2,
                  ).length
                }
              />
            </View>

            {/* Red */}
            <View accessibilityLabel={t('views.lifemap.red')}>
              <FilterListItem
                id="red"
                onPress={() => selectFilter(1, t('views.lifemap.red'))}
                color={colors.red}
                text={t('views.lifemap.red')}
                amount={
                  draft.indicatorSurveyDataList.filter(
                    (item) => item.value === 1,
                  ).length
                }
              />
            </View>

            {/* Priorities/achievements */}
            <View accessibilityLabel={t('views.lifemap.priorities')}>
              <FilterListItem
                id="priorities"
                onPress={() =>
                  selectFilter(
                    'priorities',
                    `${t('views.lifemap.priorities')} & ${t(
                      'views.lifemap.achievements',
                    )}`,
                  )
                }
                color={colors.blue}
                text={`${t('views.lifemap.priorities')} & ${t(
                  'views.lifemap.achievements',
                )}`}
                amount={draft.priorities.length + draft.achievements.length}
              />
            </View>

            {/* Skipped */}
            <View accessibilityLabel={t('views.skippedIndicators')}>
              <FilterListItem
                id="skipped"
                onPress={() => selectFilter(0, t('views.skippedIndicators'))}
                color={colors.palegrey}
                text={t('views.skippedIndicators')}
                amount={
                  draft.indicatorSurveyDataList.filter(
                    (item) => item.value === 0,
                  ).length
                }
              />
            </View>
          </View>
        </BottomModal>
      </View>
    </View>
  ) : (
    <StickyFooter
      continueLabel={t('general.continue')}
      onContinue={() => onContinue()}
      visible={!isResumingDraft && !familyLifemap}
      progress={
        !isResumingDraft && !familyLifemap
          ? (draft.progress.total - 1) / draft.progress.total
          : 0
      }>
      {!props.readOnly ? (
        <View style={{alignItems: 'center'}}>
          {draft.stoplightSkipped && <View style={{paddingTop: 50}} />}
          {!draft.stoplightSkipped && (
            <Text style={[globalStyles.h2Bold, styles.heading]}>
              {t('views.lifemap.congratulations')}
            </Text>
          )}
          <Text style={[globalStyles.h2Bold, styles.heading]}>
            {!draft.stoplightSkipped
              ? t('views.lifemap.youCreatedALifeMap')
              : t('views.lifemap.continueWithSurvey')}
          </Text>
        </View>
      ) : null}
      <View style={[globalStyles.background, styles.contentContainer]}>
        <View style={styles.indicatorsContainer}>
          {!draft.stoplightSkipped && (
            <LifemapVisual
              large={props.readOnly}
              extraLarge={!props.readOnly}
              questions={draft.indicatorSurveyDataList}
              priorities={draft.priorities}
              achievements={draft.achievements}
              questionsLength={survey.surveyStoplightQuestions.length}
            />
          )}
          {isResumingDraft ? (
            <Button
              id="resume-draft"
              style={{
                marginTop: 20,
              }}
              colored
              text={t('general.resumeDraft')}
              handleClick={resumeDraft}
            />
          ) : null}
        </View>
        {/*If we are in family/draft then show the questions.Else dont show them . This is requered for the families tab*/}
      </View>
    </StickyFooter>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  listTitle: {
    backgroundColor: colors.primary,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  indicatorsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  arrow: {
    marginLeft: 7,
    marginTop: 3,
    width: 10,
    height: 5,
  },
  dropdown: {
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
  },
  modalTitle: {
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 15,
    marginLeft: 16,
  },
});

Overview.propTypes = {
  drafts: PropTypes.array.isRequired,
  updateDraft: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
  familyLifemap: PropTypes.object,
};

const mapDispatchToProps = {
  updateDraft,
};

const mapStateToProps = ({drafts}) => ({drafts});

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Overview),
);
