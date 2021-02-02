import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
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
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { connect } from 'react-redux';

import arrow from '../../assets/images/selectArrow.png';
import BottomModal from '../components/BottomModal';
import Button from '../components/Button';
import Decoration from '../components/decoration/Decoration';
import DraftListItem from '../components/DraftListItem';
import FilterListItem from '../components/FilterListItem';
import NotificationModal from '../components/NotificationModal';
import RoundImage from '../components/RoundImage';
import { supported_API_version, url } from '../config';
import globalStyles from '../globalStyles';
import { markVersionCheked, toggleAPIVersionModal, submitDraftCommit, submitDraftError } from '../redux/actions';
import colors from '../theme.json';
import Bugsnag from '@bugsnag/react-native';


const TestFairy = require('react-native-testfairy');
// get env
const nodeEnv = process.env;

export class Dashboard extends Component {
  acessibleComponent = React.createRef();
  state = {
    selectedDraftId: null,
    filterModalIsOpen: false,
    renderFiltered: false,
    renderLable: false,
    filteredDrafts: [],
    green: 0,
    yellow: 0,
    red: 0,
  };

  // Navigate to Overview to see the results of Draft with Pending sync status
  navigateToPendingSync = (draft) => {
    const { firstName, lastName } = draft.familyData.familyMembersList[0];

    this.props.navigation.navigate('Families', {
      screen: 'Family',
      params: {
        familyName: `${firstName} ${lastName}`,
        familyLifemap: draft,
        draftId: draft.draftId,
        isDraft: false,
        survey: this.props.surveys.find(
          (survey) => survey.id === draft.surveyId,
        ),
        activeTab: 'Details',
      },
    });
  };

  navigateToDraft = (draft) => {
    const survey = this.props.surveys.find(
      (survey) => survey.id === draft.surveyId,
    );
    if (
      draft.progress.screen === 'Question' ||
      draft.progress.screen === 'Skipped' ||
      draft.progress.screen === 'Final' ||
      draft.progress.screen === 'Signin' ||
      draft.progress.screen === 'Overview'
    ) {
      this.props.navigation.navigate('Surveys', {
        screen: 'Overview',
        params: {
          resumeDraft: true,
          draftId: draft.draftId,
          stoplightSkipped: draft.stoplightSkipped,
          survey,
        },
      });
    } else {
      this.props.navigation.navigate('Surveys', {
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
  navigateToSynced = (item) => {
    this.props.navigation.navigate('Families', {
      screen: 'Family',
      params: {
        familyName: item.familyData.familyMembersList[0].firstName,
        familyLifemap: item,
        draftId: item.draftId,
        isDraft: !item,
        survey: this.props.surveys.find((survey) =>
          item ? survey.id === item.surveyId : null,
        ),
      },
    });
  };
  handleClickOnListItem = (item) => {
    switch (item.status) {
      case 'Pending sync':
        this.navigateToPendingSync(item);
        break;
      case 'Synced':
        this.navigateToSynced(item);
        break;
      default:
        this.navigateToDraft(item);
    }
  };

  navigateToCreateLifemap = () => {
    this.props.navigation.navigate('Surveys');
  };

  toggleFilterModal = () => {
    this.setState({
      filterModalIsOpen: !this.state.filterModalIsOpen,
    });
  };

  onNotificationClose = () => {
    this.props.toggleAPIVersionModal(false);
  };

  selectFilter = (filter, label) => {
    if (filter) {
      let propsCopy = [...this.props.drafts];
      let filteredDrafts = propsCopy.filter((e) => {
        if (e.status === filter) {
          return e;
        }
      });
      this.setState({
        filteredDrafts: filteredDrafts,
        filterModalIsOpen: false,
        renderFiltered: true,
        renderLable: label,
      });
    } else {
      this.setState({
        filterModalIsOpen: false,
        renderFiltered: false,
        renderLable: false,
      });
    }
  };

  checkAPIVersion() {
    const { timestamp } = this.props.apiVersion;

    // when this was last checked
    if (
      !timestamp ||
      (timestamp && new Date() - new Date(timestamp) > 24 * 60 * 60 * 1000)
    ) {
      // check simply if user is online
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          // check the API version status compared
          // to the supported version in config
          fetch(`${url[this.props.env]}/graphql`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.props.user.token}`,
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
              this.props.markVersionCheked(new Date());
              if (json.data.apiVersionStatus.status !== 'up-to-date') {
                this.props.toggleAPIVersionModal(true);
              }
            })
            .catch((e) => e);
        }
      });
    }
  }

  componentDidMount() {
    // if user has no token navigate to login screen
    if (!this.props.user.token) {
      this.props.navigation.navigate('Login');
    } else {
      try {
        throw new Error('en didMount')
      }catch(e) {
        const pendingDraft = this.props.drafts.filter(draft => draft.status == 'Pending sync')
        const errorDraft = this.props.drafts.filter(draft => draft.status == 'Sync error')
        Bugsnag.notify(e, event => {
          event.addMetadata('pending', { pending: pendingDraft });
          event.addMetadata('error', { error: errorDraft });
          event.addMetadata('env',{env: this.props.env}),
          event.addMetadata('url',{url: url[this.props.env]})
          event.addMetadata('user',{user: this.props.user})
        });
      }
      nodeEnv.NODE_ENV === 'production'
        ? TestFairy.setUserId(this.props.user.username)
        : null;
      this.checkAPIVersion();

      if (UIManager.AccessibilityEventTypes) {
        setTimeout(() => {
          UIManager.sendAccessibilityEvent(
            findNodeHandle(this.acessibleComponent.current),
            UIManager.AccessibilityEventTypes.typeViewFocused,
          );
        }, 1);
      }
    }
  }

  formatPhone = (code, phone) => {
    if (code && phone && phone.length > 0) {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const international = '+' + code + ' ' + phone;
      let phoneNumber = phoneUtil.parse(international, code);
      phone = phoneNumber.getNationalNumber();
    }
    return phone;
  };

  sendDraft = (env, token, id, payload) => {
    console.log('----Calling Submit Draft----', payload);
    const sanitizedSnapshot = { ...payload };

    let { economicSurveyDataList } = payload;

    const validEconomicIndicator = (ec) =>
      (ec.value !== null && ec.value !== undefined && ec.value !== '') ||
      (!!ec.multipleValue && ec.multipleValue.length > 0);

    economicSurveyDataList = economicSurveyDataList.filter(
      validEconomicIndicator,
    );
    sanitizedSnapshot.economicSurveyDataList = economicSurveyDataList;
    sanitizedSnapshot.familyData.familyMembersList.forEach((member) => {
      let { socioEconomicAnswers = [] } = member;
      delete member.memberIdentifier;
      delete member.id;
      delete member.familyId;
      delete member.uuid;

      member.phoneNumber = this.formatPhone(member.phoneCode, member.phoneNumber);
      socioEconomicAnswers = socioEconomicAnswers.filter(validEconomicIndicator);
      // eslint-disable-next-line no-param-reassign
      member.socioEconomicAnswers = socioEconomicAnswers;
    });
    console.log(sanitizedSnapshot);
    fetch(`${env}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json;charset=utf8',
      },
      body: JSON.stringify({
        query:
          'mutation addSnapshot($newSnapshot: NewSnapshotDTOInput) {addSnapshot(newSnapshot: $newSnapshot)  { surveyId surveyVersionId snapshotStoplightAchievements { action indicator roadmap } snapshotStoplightPriorities { reason action indicator estimatedDate } family { familyId } user { userId  username } indicatorSurveyDataList {key value} economicSurveyDataList {key value multipleValue} familyDataDTO { latitude longitude accuracy familyMemberDTOList { firstName lastName socioEconomicAnswers {key value } } } } }',
        variables: { newSnapshot: sanitizedSnapshot },
      })
    }).then((data) => {
      if (data.status !== 200) {
        this.props.submitDraftError(id);
        this.setState({ selectedDraftId: null })
        throw new Error();
      } else return data.json();
    }).
      then((data) => {
        this.setState({ selectedDraftId: null })
        this.props.submitDraftCommit(id);
      })
  }

  createFormData = (item) => {
    let data = new FormData();
    if (item) {
      item.forEach(el => {
        data.append('pictures', {
          uri: el[1].uri,
          name: el[1].name,
          type: el[1].type,
        })
      });
    }
    return data;
  }

  handleSync = (item) => {
    //console.log('item',item)

    fetch(`https://platform.backend.povertystoplight.org/api/v1/stoplight/assistant/location?ClientNumber=+595981318432&TwilioNumber=+18055902031&Token=token&Latitude=latitude&Longitude=longitude`, {
      method: 'POST',
    }).then((response) =>{
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })

    let payload = {
      ...item,
      pictures: [],
    }

    delete payload.progress;



    try {
      throw new Error('log bug')
    }catch(e) {
      Bugsnag.notify(e, event => {
        event.addMetadata('draft', { draft: item });
        event.addMetadata('env',{env: this.props.env}),
        event.addMetadata('url',{url: url[this.props.env]})
        event.addMetadata('user',{user: this.props.user})
      });
    }
   
    this.setState({ selectedDraftId: payload.draftId });
    /* let draftPayload = {
      ...payload,
      pictures: [],
    } */
    
    this.sendDraft(url[this.props.env], this.props.user.token, payload.draftId, payload);


  }

  render() {
    const { t, families, drafts, offline } = this.props;
    const { filterModalIsOpen } = this.state;
    const allDraftFamilies = drafts.filter(
      (d) => d.status === 'Draft' || d.status === 'Pending sync',
    ).length;

    const countFamilies = families.length + allDraftFamilies;

    return (
      <AndroidBackHandler onBackPress={() => true}>
        <View style={globalStyles.ViewMainContainer}>
          <NotificationModal
            isOpen={this.props.apiVersion.showModal}
            onClose={this.onNotificationClose}
            label={t('general.attention')}
            subLabel={t('general.syncAll')}></NotificationModal>
          <ScrollView
            contentContainerStyle={
              drafts.length
                ? globalStyles.ScrollMainContainerNotCentered
                : globalStyles.ScrollMainContainerCentered
            }>
            <View ref={this.acessibleComponent} accessible={true}>
              <View>
                <View
                  style={
                    drafts.length
                      ? globalStyles.container
                      : globalStyles.containerNoPadding
                  }>
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
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
                    {this.props.user.role !== 'ROLE_SURVEY_TAKER' && (
                      <Text style={{ ...styles.familiesCount }}>
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
                    handleClick={this.navigateToCreateLifemap}
                  />
                </View>
                {drafts.length ? (
                  <View style={styles.borderBottom}>
                    <View>
                      <TouchableHighlight
                        id="filters"
                        underlayColor={'transparent'}
                        activeOpacity={1}
                        onPress={this.toggleFilterModal}>
                        <View style={styles.listTitle}>
                          <View>
                            {this.state.renderLable ? (
                              <Text style={globalStyles.subline}>
                                {' '}
                                {this.state.renderLable}
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
                      onRequestClose={this.toggleFilterModal}
                      onEmptyClose={() =>
                        this.setState({ filterModalIsOpen: false })
                      }>
                      <View style={styles.dropdown}>
                        <FilterListItem
                          id="all"
                          dashboard
                          onPress={() => this.selectFilter(false)}
                          text={t('filterLabels.allSurveys')}
                        />
                        <FilterListItem
                          id="drafts"
                          dashboard
                          onPress={() =>
                            this.selectFilter('Draft', t('filterLabels.drafts'))
                          }
                          text={t('filterLabels.drafts')}
                        />
                        <FilterListItem
                          id="pending"
                          dashboard
                          onPress={() =>
                            this.selectFilter(
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
                            this.selectFilter(
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
                            this.selectFilter(
                              'Synced',
                              t('filterLabels.completed'),
                            )
                          }
                          text={t('filterLabels.completed')}
                        />
                      </View>
                    </BottomModal>
                  </View>
                ) : null}
                <FlatList
                  style={{ ...styles.background }}
                  data={
                    this.state.renderFiltered
                      ? this.state.filteredDrafts.slice().reverse()
                      : drafts.slice().reverse()
                  }
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => { console.log ('item render',item); return(
                    <DraftListItem
                      item={item}
                      isOnline={offline.online}
                      handleClick={this.handleClickOnListItem}
                      handleSync={this.handleSync}
                      lng={this.props.lng}
                      user={this.props.user}
                      selectedDraftId={this.state.selectedDraftId}
                    />
                  )}}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </AndroidBackHandler>
    );
  }
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

const mapDispatchToProps = { markVersionCheked, toggleAPIVersionModal, submitDraftCommit, submitDraftError };

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard),
);
