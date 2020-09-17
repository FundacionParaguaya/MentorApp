import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import React, {useRef, useEffect, useState} from 'react';
import {withNamespaces} from 'react-i18next';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  UIManager,
  View,
  findNodeHandle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {connect} from 'react-redux';

import arrow from '../../assets/images/selectArrow.png';
import BottomModal from '../components/BottomModal';
import Button from '../components/Button';
import Decoration from '../components/decoration/Decoration';
import DraftListItem from '../components/DraftListItem';
import FilterListItem from '../components/FilterListItem';
import NotificationModal from '../components/NotificationModal';
import RoundImage from '../components/RoundImage';
import {supported_API_version, url} from '../config';
import globalStyles from '../globalStyles';
import {markVersionCheked, toggleAPIVersionModal} from '../redux/actions';
import colors from '../theme.json';

const TestFairy = require('react-native-testfairy');
// get env
const nodeEnv = process.env;

function Dashboard(props) {
  const acessibleComponent = useRef(null);

  const [filterModalIsOpen, setFilteredModalIsOpen] = useState(false);

  const [renderFiltered, setRenderFiltered] = useState(false);

  const [renderLable, setRenderLable] = useState(false);

  const [filteredDrafts, setFilteredDrafts] = useState([]);

  const [green, setGreen] = useState(0);

  const [yellow, setYellow] = useState(0);

  const [red, setRed] = useState(0);
  const navigateToPendingSync = (draft) => {
    const {firstName, lastName} = draft.familyData.familyMembersList[0];

    props.navigation.navigate('Families', {
      screen: 'Family',
      params: {
        familyName: `${firstName} ${lastName}`,
        familyLifemap: draft,
        isDraft: true,
        survey: props.surveys.find((survey) => survey.id === draft.surveyId),
        activeTab: 'LifeMap',
      },
    });
  };
  const navigateToDraft = (draft) => {
    const survey = props.surveys.find((survey) => survey.id === draft.surveyId);
    if (
      draft.progress.screen === 'Question' ||
      draft.progress.screen === 'Skipped' ||
      draft.progress.screen === 'Final' ||
      draft.progress.screen === 'Signin' ||
      draft.progress.screen === 'Overview'
    ) {
      props.navigation.navigate('Surveys', {
        screen: 'Overview',
        params: {
          resumeDraft: true,
          draftId: draft.draftId,
          stoplightSkipped: draft.stoplightSkipped,
          survey,
        },
      });
    } else {
      props.navigation.navigate('Surveys', {
        screen: draft.progress.screen,
        params: {
          draftId: draft.draftId,
          survey,
          step: draft.progress.step,
          socioEconomics: draft.progress.socioEconomics,
        },
      });
    }
  };
  const navigateToSynced = (item) => {
    props.navigation.navigate('Families', {
      screen: 'Family',
      params: {
        familyName: item.familyData.familyMembersList[0].firstName,
        familyLifemap: item,
        draftId: item.draftId,
        isDraft: !item,
        survey: props.surveys.find((survey) =>
          item ? survey.id === item.surveyId : null,
        ),
      },
    });
  };
  const handleClickOnListItem = (item) => {
    switch (item.status) {
      case 'Pending sync':
        navigateToPendingSync(item);
        break;
      case 'Synced':
        navigateToSynced(item);
        break;
      default:
        navigateToDraft(item);
    }
  };
  const navigateToCreateLifemap = () => {
    props.navigation.navigate('Surveys');
  };
  const toggleFilterModal = () => {
    setFilteredModalIsOpen(!filterModalIsOpen);
  };
  const onNotificationClose = () => {
    props.toggleAPIVersionModal(false);
  };
  const selectFilter = (filter, label) => {
    console.log(`set ${label} and ${filter}`);
    if (filter) {
      let propsCopy = [...props.drafts];
      let filteredDrafts = propsCopy.filter((e) => {
        if (e.status === filter) {
          return e;
        }
      });

      setFilteredDrafts(filteredDrafts);
      setFilteredModalIsOpen(false);
      setRenderFiltered(true);
      setRenderLable(label);
    } else {
      setFilteredDrafts(props.drafts);
      setFilteredModalIsOpen(false);
      setRenderFiltered(true);
      setRenderLable(false);
    }
  };
  const checkAPIVersion = () => {
    const {timestamp} = props.apiVersion;

    // when this was last checked
    if (
      !timestamp ||
      (timestamp && new Date() - new Date(timestamp) > 24 * 60 * 60 * 1000)
    ) {
      // check simply if user is online
      NetInfo.fetch().then((state) => {
        if (isConnected) {
          // check the API version status compared
          // to the supported version in config
          fetch(`${url[props.env]}/graphql`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${props.user.token}`,
              'content-type': 'application/json;charset=utf8',
            },
            body: JSON.stringify({
              query:
                'query apiVersionStatus($version:String) { apiVersionStatus(version:$version) {id,status,supportWindow,supportWindowTime,major,minor,patch,version} }',
              variables: {
                version: supported_API_version,
              },
            }),
          })
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              }
            })
            .then((json) => {
              props.markVersionCheked(new Date());
              if (json.data.apiVersionStatus.status !== 'up-to-date') {
                props.toggleAPIVersionModal(true);
              }
            })
            .catch((e) => e);
        }
      });
    }
  };
  useEffect(() => {
    if (!props.user.token) {
      props.navigation.navigate('Login');
    } else {
      nodeEnv.NODE_ENV === 'production'
        ? TestFairy.setUserId(props.user.username)
        : null;
      checkAPIVersion();
      if (UIManager.AccessibilityEventTypes) {
        setTimeout(() => {
          UIManager.sendAccessibilityEvent(
            findNodeHandle(acessibleComponent.current),
            UIManager.AccessibilityEventTypes.typeViewFocused,
          );
        }, 1);
      }
    }
  }, []);
  const {t, families, drafts} = props;
  console.log(drafts);
  const allDraftFamilies = drafts.filter(
    (d) => d.status === 'Draft' || d.status === 'Pending sync',
  ).length;
  const countFamilies = families.length + allDraftFamilies;

  return (
    <AndroidBackHandler onBackPress={() => true}>
      <View style={globalStyles.ViewMainContainer}>
        <NotificationModal
          isOpen={props.apiVersion.showModal}
          onClose={onNotificationClose}
          label={t('general.attention')}
          subLabel={t('general.syncAll')}></NotificationModal>
        <ScrollView
          contentContainerStyle={
            drafts.length
              ? globalStyles.ScrollMainContainerNotCentered
              : globalStyles.ScrollMainContainerCentered
          }>
          <View ref={acessibleComponent} accessible={true}>
            <View>
              <View
                style={
                  drafts.length
                    ? globalStyles.container
                    : globalStyles.containerNoPadding
                }>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Decoration>
                    <RoundImage source="family" />
                  </Decoration>
                  <View style={styles.familiesIcon}>
                    <Icon
                      name="face"
                      style={styles.familiesIconIcon}
                      size={60}
                    />
                  </View>
                  {props.user.role !== 'ROLE_SURVEY_TAKER' && (
                    <Text style={{...styles.familiesCount}}>
                      {countFamilies} {t('views.families')}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View style={styles.circleAndTextContainer}>
                    <View style={styles.circleContainer}>
                      <View style={styles.circleGreen} />
                    </View>
                    {/* <Text style={styles.numberIndicator}>{green}</Text> */}
                    <Text style={styles.colorIndicator}>
                      {t('views.DashGreen')}
                    </Text>
                  </View>

                  <View style={styles.circleAndTextContainer}>
                    <View style={styles.circleContainer}>
                      <View style={styles.circleYellow} />
                    </View>
                    {/* <Text style={styles.numberIndicator}>{yellow}</Text> */}
                    <Text style={styles.colorIndicator}>
                      {t('views.DashYellow')}
                    </Text>
                  </View>

                  <View style={styles.circleAndTextContainer}>
                    <View style={styles.circleContainer}>
                      <View style={styles.circleRed} />
                    </View>
                    {/* <Text style={styles.numberIndicator}>{red}</Text> */}
                    <Text style={styles.colorIndicator}>
                      {t('views.DashRed')}
                    </Text>
                  </View>
                </View>

                <Button
                  style={{
                    marginTop: 20,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: 400,
                  }}
                  id="create-lifemap"
                  text={t('views.createLifemap')}
                  colored
                  handleClick={navigateToCreateLifemap}
                />
              </View>
              {drafts.length ? (
                <View style={styles.borderBottom}>
                  <View>
                    <TouchableHighlight
                      id="filters"
                      underlayColor={'transparent'}
                      activeOpacity={1}
                      onPress={toggleFilterModal}>
                      <View style={styles.listTitle}>
                        <View>
                          {renderLable ? (
                            <Text style={globalStyles.subline}>
                              {' '}
                              {renderLable}
                            </Text>
                          ) : (
                            <Text style={globalStyles.subline}>
                              {t('filterLabels.lifeMaps')}
                            </Text>
                          )}
                        </View>
                        <Image source={arrow} style={styles.arrow} />
                      </View>
                    </TouchableHighlight>
                  </View>
                  {/* Filters modal */}
                  <BottomModal
                    isOpen={filterModalIsOpen}
                    onRequestClose={toggleFilterModal}
                    onEmptyClose={() => setFilteredModalIsOpen(false)}>
                    <View style={styles.dropdown}>
                      <FilterListItem
                        id="all"
                        dashboard
                        onPress={() => selectFilter(false)}
                        text={t('filterLabels.allSurveys')}
                      />
                      <FilterListItem
                        id="drafts"
                        dashboard
                        onPress={() =>
                          selectFilter('Draft', t('filterLabels.drafts'))
                        }
                        text={t('filterLabels.drafts')}
                      />
                      <FilterListItem
                        id="pending"
                        dashboard
                        onPress={() =>
                          selectFilter(
                            'Pending sync',
                            t('filterLabels.syncPending'),
                          )
                        }
                        text={t('filterLabels.syncPending')}
                      />
                      <FilterListItem
                        id="error"
                        dashboard
                        onPress={() =>
                          selectFilter(
                            'Sync error',
                            t('filterLabels.syncError'),
                          )
                        }
                        text={t('filterLabels.syncError')}
                      />
                      <FilterListItem
                        id="synced"
                        dashboard
                        onPress={() =>
                          selectFilter('Synced', t('filterLabels.completed'))
                        }
                        text={t('filterLabels.completed')}
                      />
                    </View>
                  </BottomModal>
                </View>
              ) : null}
              <FlatList
                style={{...styles.background}}
                data={
                  renderFiltered
                    ? filteredDrafts.slice().reverse()
                    : drafts.slice().reverse()
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <DraftListItem
                    item={item}
                    handleClick={handleClickOnListItem}
                    lng={props.lng}
                    user={props.user}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  colorIndicator: {
    fontFamily: 'Poppins SemiBold',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 10,
  },
  circleAndTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleGreen: {
    backgroundColor: colors.palegreen,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  circleYellow: {
    backgroundColor: colors.palegold,
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  circleRed: {
    backgroundColor: colors.palered,
    width: 20,
    height: 20,
    borderRadius: 50,
  },
  familiesIconIcon: {
    margin: 'auto',
  },
  familiesIcon: {
    top: 120,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  familiesCount: {
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'Poppins SemiBold',
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  arrow: {
    marginLeft: 7,
    marginTop: 3,
    width: 10,
    height: 5,
  },
  listTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.primary,
    height: 41,
    lineHeight: 41,
    flex: 1,
    textAlign: 'center',
  },
  borderBottom: {
    marginTop: 20,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
  },
  dropdown: {
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
  },
});

Dashboard.propTypes = {
  navigation: PropTypes.object.isRequired,
  toggleAPIVersionModal: PropTypes.func.isRequired,
  markVersionCheked: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  apiVersion: PropTypes.object.isRequired,
  offline: PropTypes.object,
  lng: PropTypes.string.isRequired,
  surveys: PropTypes.array,
  sync: PropTypes.object,
  families: PropTypes.array,
};

export const mapStateToProps = ({
  env,
  user,
  drafts,
  offline,
  string,
  surveys,
  families,
  sync,
  apiVersion,
}) => ({
  env,
  user,
  drafts,
  offline,
  string,
  surveys,
  families,
  sync,
  apiVersion,
});

const mapDispatchToProps = {markVersionCheked, toggleAPIVersionModal};

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard),
);
