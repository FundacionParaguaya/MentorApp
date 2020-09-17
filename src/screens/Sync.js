import PropTypes from 'prop-types';
import React, {useRef, useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
  findNodeHandle,
} from 'react-native';
import {connect} from 'react-redux';

import SyncInProgress from '../components/sync/SyncInProgress';
import SyncListItem from '../components/sync/SyncListItem';
import SyncOffline from '../components/sync/SyncOffline';
import SyncRetry from '../components/sync/SyncRetry';
import SyncUpToDate from '../components/sync/SyncUpToDate';
import {url} from '../config';
import globalStyles from '../globalStyles';
import {submitDraft, submitDraftWithImages} from '../redux/actions';
import {screenSyncScreenContent} from '../screens/utils/accessibilityHelpers';
import {prepareDraftForSubmit} from './utils/helpers';

function Sync(props) {
  const acessibleComponent = useRef();
  useEffect(() => {
    if (UIManager.AccessibilityEventTypes) {
      setTimeout(() => {
        UIManager.sendAccessibilityEvent(
          findNodeHandle(acessibleComponent.current),
          UIManager.AccessibilityEventTypes.typeViewFocused,
        );
      }, 1);
    }
  }, []);

  const retrySubmittingAllDrafts = () => {
    const draftsWithError = props.drafts.filter(
      (draft) => draft.status === 'Sync error',
    );

    draftsWithError.forEach((draft) => {
      console.log('sanitazedDraft in SYNC');
      const sanitazedDraft = prepareDraftForSubmit(
        draft,
        props.surveys.find((survey) => survey.id === draft.surveyId),
      );

      if (draft.pictures && draft.pictures.length > 0) {
        props.submitDraftWithImages(
          url[props.env],
          props.user.token,
          sanitazedDraft.draftId,
          {
            ...sanitazedDraft,
            //sendEmail: state.sendEmailFlag
          },
        );
      } else {
        props.submitDraft(
          url[props.env],
          props.user.token,
          sanitazedDraft.draftId,
          {
            ...sanitazedDraft,
            //sendEmail: state.sendEmailFlag,
            pictures: [],
          },
        );
      }

      setTimeout(() => {
        props.navigation.navigate('Dashboard');
      }, 500);
    });
  };
  const navigateToDraft = (draft) => {
    if (
      draft.progress.screen !== 'Question' &&
      draft.progress.screen !== 'Skipped' &&
      draft.progress.screen !== 'Final' &&
      draft.progress.screen !== 'Overview'
    ) {
      props.navigation.navigate('Surveys', {
        screen: draft.progress.screen,
        params: {
          draftId: draft.draftId,
          survey: props.surveys.find((survey) => survey.id === draft.surveyId),
          step: draft.progress.step,
          socioEconomics: draft.progress.socioEconomics,
        },
      });
    } else
      props.navigation.navigate('Surveys', {
        screen: 'Overview',
        params: {
          draftId: draft.draftId,
          survey: props.surveys.find((survey) => survey.id === draft.surveyId),
          resumeDraft: true,
        },
      });
  };
  const {drafts, offline} = props;
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
    (draft) => draft.status === 'Sync error' || draft.status === 'Pending sync',
  );
  const screenAccessibilityContent = screenSyncScreenContent(
    offline,
    pendingDrafts,
    draftsWithError,
    lastSync,
  );

  return (
    <ScrollView contentContainerStyle={[globalStyles.container, styles.view]}>
      <View
        ref={acessibleComponent}
        accessible={true}
        accessibilityLabel={screenAccessibilityContent}>
        {offline.online && !pendingDrafts.length && !draftsWithError.length ? (
          <SyncUpToDate date={lastSync} lng={props.lng} />
        ) : null}
        {offline.online && pendingDrafts.length ? (
          <SyncInProgress pendingDraftsLength={pendingDrafts.length} />
        ) : null}
        {!offline.online ? (
          <SyncOffline pendingDraftsLength={pendingDrafts.length} />
        ) : null}
        {offline.online && draftsWithError.length && !pendingDrafts.length ? (
          <SyncRetry
            draftsWithError={draftsWithError.length}
            retrySubmit={retrySubmittingAllDrafts}
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
              handleClick={() => navigateToDraft(item)}
              errors={item.errors || []}
            />
          )}
        />
      ) : null}
    </ScrollView>
  );
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
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
  },
});

const mapStateToProps = ({drafts, offline, env, user, surveys}) => ({
  drafts,
  offline,
  env,
  user,
  surveys,
});

const mapDispatchToProps = {
  submitDraft,
  submitDraftWithImages,
};

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Sync),
);
