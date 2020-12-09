import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withNamespaces} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  Text,
  StyleSheet,
  UIManager,
  View,
  Text,
  TextInput,
  findNodeHandle,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../theme.json';
import Button from '../components/Button';
import SyncInProgress from '../components/sync/SyncInProgress';
import SyncListItem from '../components/sync/SyncListItem';
import SyncOffline from '../components/sync/SyncOffline';
import SyncPriority from '../components/sync/SyncPriority';
import SyncRetry from '../components/sync/SyncRetry';
import SyncUpToDate from '../components/sync/SyncUpToDate';
import {url} from '../config';
import globalStyles from '../globalStyles';
import {submitDraft, createDraft, submitDraftWithImages, submitPriority} from '../redux/actions';
import {screenSyncScreenContent} from '../screens/utils/accessibilityHelpers';
import {prepareDraftForSubmit, fakeSurvey} from './utils/helpers';

import uuid from 'uuid/v1';
const nodeEnv = process.env;
export class Sync extends Component {
  acessibleComponent = React.createRef();
  state = {
    surveysCount: null,
  };
  navigateToDraft = (draft) => {
    if (
      draft.progress.screen !== 'Question' &&
      draft.progress.screen !== 'Skipped' &&
      draft.progress.screen !== 'Final' &&
      draft.progress.screen !== 'Overview'
    ) {
      this.props.navigation.navigate('Surveys', {
        screen: draft.progress.screen,
        params: {
          draftId: draft.draftId,
          survey: this.props.surveys.find(
            (survey) => survey.id === draft.surveyId,
          ),
          step: draft.progress.step,
          socioEconomics: draft.progress.socioEconomics,
        },
      });
    } else
      this.props.navigation.navigate('Surveys', {
        screen: 'Overview',
        params: {
          draftId: draft.draftId,
          survey: this.props.surveys.find(
            (survey) => survey.id === draft.surveyId,
          ),
          resumeDraft: true,
        },
      });
  };

  retrySubmittingAllPriorities = () => {
    const prioritiesWithError = this.props.priorities.filter(priority => priority.status == 'Sync Error');

    prioritiesWithError.forEach(priority => {
      let sanitazedPriority = priority;
          delete sanitazedPriority.status
          this.props.submitPriority (
            url[this.props.env],
            this.props.user.token,
            sanitazedPriority
          )

    })
  }

  retrySubmittingAllDrafts = () => {
    const draftsWithError = this.props.drafts.filter(
      (draft) => draft.status === 'Sync error',
    );

    draftsWithError.forEach((draft) => {
      console.log('sanitazedDraft in SYNC');
      const sanitazedDraft = prepareDraftForSubmit(
        draft,
        this.props.surveys.find((survey) => survey.id === draft.surveyId),
      );

      if (draft.pictures && draft.pictures.length > 0) {
        this.props.submitDraftWithImages(
          url[this.props.env],
          this.props.user.token,
          sanitazedDraft.draftId,
          {
            ...sanitazedDraft,
            //sendEmail: this.state.sendEmailFlag
          },
        );
      } else {
        this.props.submitDraft(
          url[this.props.env],
          this.props.user.token,
          sanitazedDraft.draftId,
          {
            ...sanitazedDraft,
            //sendEmail: this.state.sendEmailFlag,
            pictures: [],
          },
        );
      }

      setTimeout(() => {
        this.props.navigation.navigate('Dashboard');
      }, 500);
    });
  };

  retrySubmit = () => {
    this.retrySubmittingAllDrafts();
    this.retrySubmittingAllPriorities();
  }

  getFamilyName = (snapshotStoplightId) => {
    console.log('getFamilyName',snapshotStoplightId);
    let indicator;
    let familyName

    this.props.families.forEach(family => {
      let snapShotData = family.snapshotList.length > 0 
        ? family.snapshotList[family.snapshotList.length-1] 
        : family.snapshotList[0];
        console.log('snapShotData getFamilyName',snapShotData);

        !indicator ? indicator = snapShotData.indicatorSurveyDataList.find(
          item => item.snapshotStoplightId === snapshotStoplightId
        ): null;

        !familyName && indicator ? familyName = family.name: null
        
    });
    if(familyName) {
      return familyName
    }else {
      return 
    }
  }

  getIndicator = (snapshotStoplightId) => {
    console.log('snapshotStoplightId',snapshotStoplightId)
    let indicator;
    let surveyIndicator;

    this.props.families.forEach(family => {
      let snapShotData = family.snapshotList.length > 0 
        ? family.snapshotList[family.snapshotList.length-1] 
        : family.snapshotList[0];
        console.log('snapShotData',snapShotData)

      
      !indicator ? indicator = snapShotData.indicatorSurveyDataList.find(
        item => item.snapshotStoplightId === snapshotStoplightId
      ): null;

      console.log('ind',indicator)

      
    });
    this.props.surveys.forEach(survey => {
      !surveyIndicator ? surveyIndicator =
      survey.surveyEconomicQuestions.find(item => item.key == indicator.codeName): null;
    });

    if(surveyIndicator) {
      return surveyIndicator.questionText;
    }
    return;
  }

  componentDidMount() {
    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(this.acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused,
        );
      }, 1);
    }
  }

  onClickGenerate = async () => {
    if (this.state.surveysCount == null) return;

    const draftId = uuid();
    let i = 0;
    while (i < parseInt(this.state.surveysCount, 10)) {
      this.props.createDraft(fakeSurvey(draftId, Date.now()));
      i++;
    }
  };
  render() {
    const {drafts, offline, priorities, t} = this.props;
    const lastSync = drafts.reduce(
      (lastSynced, item) =>
        item.syncedAt > lastSynced ? item.syncedAt : lastSynced,
      0,
    );
    const pendingDrafts = offline.outbox.filter(
      (item) => item.type === 'SUBMIT_DRAFT',
    );

    const draftsWithError = drafts.filter(
      (draft) => draft.status === 'Sync error',
    );

    const list = drafts.filter(
      (draft) =>
        draft.status === 'Sync error' || draft.status === 'Pending sync',
    );

    const prioritiesWithError = priorities.filter(priority => priority.status == 'Sync Error');
    const pendingPriorities = offline.outbox.filter(item => item.type === 'Pending Status');
    const screenAccessibilityContent = screenSyncScreenContent(
      offline,
      pendingDrafts,
      draftsWithError,
      lastSync,
    );

    return (
      <ScrollView contentContainerStyle={[globalStyles.container, styles.view]}>
        {nodeEnv.NODE_ENV === 'development' && (
          <View
            style={{
              height: 120,
              alignSelf: 'stretch',
              marginBottom: 30,
              alignItems: 'center',
            }}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder={'Surveys Count'}
              onChangeText={(surveysCount) => this.setState({surveysCount})}
              style={{
                ...styles.input,
                borderColor: colors.palegreen,
              }}
              autoCapitalize="none"
            />

            <Button
              colored
              style={{
                maxWidth: 200,
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              text={'Generate Surveys'}
              handleClick={() => this.onClickGenerate()}
            />
          </View>
        )}

        <View
          ref={this.acessibleComponent}
          accessible={true}
          accessibilityLabel={screenAccessibilityContent}>
          {offline.online &&
          !pendingDrafts.length &&
          !draftsWithError.length &&
          !prioritiesWithError.length
          ? (
            <SyncUpToDate date={lastSync} lng={this.props.lng} />
          ) : null}
          {offline.online && pendingDrafts.length ? (
            <SyncInProgress pendingDraftsLength={pendingDrafts.length} />
          ) : null}
          {!offline.online ? (
            <SyncOffline pendingDraftsLength={pendingDrafts.length} />
          ) : null}
          {offline.online && (draftsWithError.length && !pendingDrafts.length) || (prioritiesWithError
          .length && !pendingPriorities.length) ? (
            <SyncRetry
              withError={draftsWithError.length + prioritiesWithError.length}
              retrySubmit={this.retrySubmit}
              
            />
          ) : null}
        </View>
        {list.length ? (
          <FlatList
            style={{marginTop: 15}}
            data={list}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <SyncListItem
                item={item.familyData}
                status={item.status}
                handleClick={() => this.navigateToDraft(item)}
                errors={item.errors || []}
              />
            )}
          />
        ) : null}
       
        {prioritiesWithError.length ? (
          <>
          <Text style={globalStyles.h3Bold}>{t('views.lifemap.priorities')}</Text>
          <FlatList
            style={{marginTop: 15}}
            data={prioritiesWithError}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <SyncPriority
                indicatorName = {this.getIndicator(item.snapshotStoplightId)}
                familyName= {this.getFamilyName(item.snapshotStoplightId)}  
              />
            )}
          />
          </>
        ) : null}
      </ScrollView>
    );
  }
}

Sync.propTypes = {
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  offline: PropTypes.object.isRequired,
  lng: PropTypes.string.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  surveys: PropTypes.array,
  submitDraft: PropTypes.func.isRequired,
  submitDraftWithImages: PropTypes.func.isRequired,
  priorities: PropTypes.array,
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 400,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Roboto',
    borderWidth: 1,
    borderRadius: 2,
    height: 48,
    marginBottom: 25,
    padding: 15,
    paddingBottom: 12,
    color: colors.lightdark,
    backgroundColor: colors.white,
  },
});

const mapStateToProps = ({drafts, offline, env, user, surveys, priorities, families}) => ({
  drafts,
  offline,
  env,
  user,
  surveys,
  priorities,
  families
});

const mapDispatchToProps = {
  createDraft,
  submitDraft,
  submitDraftWithImages,
  submitPriority
};

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Sync),
);
