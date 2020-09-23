import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {updateDraft} from '../../redux/actions';
import {withNamespaces} from 'react-i18next';
import StickyFooter from '../../components/StickyFooter';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Decoration from '../../components/decoration/Decoration';
import FilterListItem from '../../components/FilterListItem';
import LifemapOverview from '../../components/LifemapOverview';
import BottomModal from '../../components/BottomModal';
import arrow from '../../../assets/images/selectArrow.png';
import globalStyles from '../../globalStyles';
import colors from '../../theme.json';
import {prioritiesScreen} from '../../screens/utils/accessibilityHelpers';

function Priorities(props) {
  let draftId = props.route.params.draftId;
  let survey = props.route.params.survey;
  let familyLifemap = props.route.params.familyLifemap;
  let isResumingDraft = props.route.params.resumeDraft;

  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(false);
  const [filterLabel, setFilterLabel] = useState(false);
  const [tipIsVisible, setTipIsVisible] = useState(false);

  const getDraft = () =>
    props.drafts.find((draft) => draft.draftId === draftId);

  const onPressBack = () => {
    props.navigation.push('Overview', {
      resumeDraft: false,
      draftId: draftId,
      survey: survey,
    });
  };

  const navigateToScreen = (screen, indicator, indicatorText) =>
    props.navigation.push(screen, {
      familyLifemap: getDraft(),
      survey: survey,
      indicator,
      indicatorText,
      draft: getDraft(),
    });
  const toggleFilterModal = () => {
    setFilterModalIsOpen(!filterModalIsOpen);
  };

  const selectFilter = (filter, filterLabel = false) => {
    setSelectedFilter(filter);
    setFilterModalIsOpen(false);
    setFilterLabel(filterLabel);
  };
  const getPotentialPrioritiesCount = () => {
    const draft = getDraft();
    return (
      draft &&
      draft.indicatorSurveyDataList &&
      draft.indicatorSurveyDataList.filter(
        (question) => question.value === 1 || question.value === 2,
      ).length
    );
  };
  const getMandatoryPrioritiesCount = () => {
    const potentialPrioritiesCount = getPotentialPrioritiesCount() || 0;
    const mimimumPriorities = (survey && survey.minimumPriorities) || 0;

    return potentialPrioritiesCount > mimimumPriorities
      ? mimimumPriorities
      : potentialPrioritiesCount;
  };

  const onTipClose = () => {
    setTipIsVisible(false);
  };

  const onContinue = (mandatoryPrioritiesCount, draft) => {
    if (mandatoryPrioritiesCount > draft.priorities.length) {
      setTipIsVisible(true);
    } else {
      //If sign support, the go to sign view
      if (survey.surveyConfig.pictureSupport) {
        props.navigation.navigate('Picture', {
          survey: survey,
          draftId: draftId,
        });
      } else if (survey.surveyConfig.signSupport) {
        props.navigation.navigate('Signin', {
          step: 0,
          survey: survey,
          draftId: draftId,
        });
      } else {
        //TODO update according to suvey config
        navigateToScreen('Final');
      }
    }
  };
  const getTipDescription = (mandatoryPrioritiesCount, tipValue) => {
    const {t} = props;
    const draft = getDraft();
    //no mandatory priotities
    if (tipValue) {
      return `${t('general.create')} ${
        mandatoryPrioritiesCount - draft.priorities.length
      } ${t('views.lifemap.priorities').toLowerCase()}!`;
    }
    if (
      !mandatoryPrioritiesCount ||
      mandatoryPrioritiesCount - draft.priorities.length <= 0
    ) {
      return t('views.lifemap.noPriorities');
      //only one mandatory priority
    } else if (mandatoryPrioritiesCount - draft.priorities.length === 1) {
      return t('views.lifemap.youNeedToAddPriotity');
    }
    //more than one mandatory priority
    else {
      return `${t('views.lifemap.youNeedToAddPriorities').replace(
        '%n',
        mandatoryPrioritiesCount - draft.priorities.length,
      )}!`;
    }
  };
  useEffect(() => {
    const draft = getDraft();
    // show priorities message if no priorities are made or they are not enough
    if (
      !draft.priorities.length ||
      getMandatoryPrioritiesCount(draft) > draft.priorities.length
    ) {
      if (getMandatoryPrioritiesCount(draft) != 0) {
        setTipIsVisible(true);
      }
    }

    if (!isResumingDraft && !familyLifemap) {
      props.updateDraft({
        draft: {
          ...draft,
          progress: {
            ...draft.progress,
            screen: 'Overview',
          },
        },
      });

      props.navigation.setParams({
        onPressBack: onPressBack,
        withoutCloseButton: draft.draftId ? false : true,
      });
    }
  }, []);
  //REFACTORNOTE
  // shouldComponentUpdate() {
  //   return props.navigation.isFocused();
  // }
  const {t} = props;

  const draft = getDraft();
  const mandatoryPrioritiesCount = getMandatoryPrioritiesCount(draft);
  const screenAccessibilityContent =
    prioritiesScreen(
      tipIsVisible,
      getTipDescription(mandatoryPrioritiesCount, true),
    ) || '';
  return (
    <StickyFooter
      continueLabel={t('general.continue')}
      onContinue={() => onContinue(mandatoryPrioritiesCount, draft)}
      style={{marginBottom: -20}}
      type={tipIsVisible ? 'tip' : 'button'}
      tipTitle={t('views.lifemap.toComplete')}
      onTipClose={onTipClose}
      tipDescription={getTipDescription(mandatoryPrioritiesCount, true)}>
      <View
        accessible={true}
        accessibilityLabel={`${screenAccessibilityContent}`}
        accessibilityLiveRegion="assertive">
        <View style={[globalStyles.background, styles.contentContainer]}>
          <Text style={[globalStyles.h2Bold, styles.heading]}>
            {t('views.lifemap.nowLetsMakeSomePriorities')}
          </Text>

          <Decoration variation="priorities">
            <View style={styles.iconContainer}>
              <View style={styles.blueIcon}>
                <Icon2 name="pin" color={colors.white} size={130} />
              </View>
            </View>
          </Decoration>
          <View style={styles.subheading}>
            <Text style={[styles.infoPriorities, styles.heading2]}>
              {getTipDescription(mandatoryPrioritiesCount)}
            </Text>

            {/* Choose 5 indicators below and explain why they are important and
          what you will do to achive them! */}
          </View>
          <View>
            <TouchableHighlight
              id="filters"
              underlayColor={'transparent'}
              activeOpacity={1}
              onPress={toggleFilterModal}>
              <View style={styles.listTitle}>
                <Text style={globalStyles.subline2}>
                  {filterLabel || t('views.lifemap.allIndicators')}
                </Text>
                <Image source={arrow} style={styles.arrow} />
              </View>
            </TouchableHighlight>
            {/* If we are in the draft then make the qustions clickable ,else dont make them clickable */}
            <LifemapOverview
              id="lifeMapOverview"
              surveyData={survey.surveyStoplightQuestions}
              draftData={draft}
              navigateToScreen={navigateToScreen}
              draftOverview={draft.status === 'Draft' ? true : false}
              selectedFilter={selectedFilter}
            />
          </View>

          {/* Filters modal */}
          <BottomModal
            isOpen={filterModalIsOpen}
            onRequestClose={toggleFilterModal}
            onEmptyClose={() => selectFilter(false)}>
            <View style={styles.dropdown}>
              <Text style={[globalStyles.p, styles.modalTitle]}>
                {t('general.chooseView')}
              </Text>

              {/* All */}
              <FilterListItem
                id="all"
                onPress={() => selectFilter(false)}
                color={'#EAD1AF'}
                text={t('views.lifemap.allIndicators')}
                amount={draft.indicatorSurveyDataList.length}
              />

              {/* Green */}
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

              {/* Yellow */}
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

              {/* Red */}
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

              {/* Priorities/achievements */}
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

              {/* Skipped */}
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
          </BottomModal>
        </View>
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
  infoPriorities: {
    fontSize: 19,
  },
  arrow: {
    marginLeft: 7,
    marginTop: 3,
    width: 10,
    height: 5,
  },
  blueIcon: {
    borderRadius: 100,
    borderColor: colors.white,
    borderWidth: 1,
    zIndex: 10,
    backgroundColor: colors.blue,
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '25deg'}],
  },
  dropdown: {
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading2: {
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  heading: {
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  subheading: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 38,
    paddingRight: 38,
  },
  modalTitle: {
    color: colors.grey,
    fontWeight: '300',
    marginBottom: 15,
    marginLeft: 16,
  },
});

Priorities.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  updateDraft: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updateDraft,
};

const mapStateToProps = ({drafts}) => ({drafts});

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Priorities),
);
