import NetInfo from '@react-native-community/netinfo';
import MapboxGL from '@react-native-mapbox-gl/maps';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {withNamespaces} from 'react-i18next';
import {
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import uuid from 'uuid/v1';

import mapPlaceholderLarge from '../../assets/images/map_placeholder_1000.png';
import marker from '../../assets/images/marker.png';
import Button from '../components/Button';
import FamilyListItem from '../components/FamilyListItem';
import FamilyTab from '../components/FamilyTab';
import RoundImage from '../components/RoundImage';
import {url} from '../config';
import globalStyles from '../globalStyles';
import {
  createDraft,
  submitDraft,
  submitDraftWithImages,
} from '../redux/actions';
import {getTotalScreens} from '../screens/lifemap/helpers';
import colors from '../theme.json';
import OverviewComponent from './lifemap/Overview';
import {prepareDraftForSubmit} from './utils/helpers';

function Family(props) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActivetab] = useState(
    props.route.params.activeTab || 'Details',
  );
  const [showSyncButton, setShowSyncButton] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  let unsubscribeNetChange;
  let allowRetake = props.route.params.allowRetake;
  let familyLifemap = props.route.params.familyLifemap;
  let isDraft = props.route.params.isDraft;
  let familyId = props.route.params.familyId;
  // extract socio economic categories from snapshot
  let socioEconomicCategories = [
    ...new Set(
      props.route.params.survey.surveyEconomicQuestions.map(
        (question) => question.topic,
      ),
    ),
  ];
  const onPressBack = () => {
    props.navigation.replace('Families');
  };
  useEffect(() => {
    unsubscribeNetChange = NetInfo.addEventListener((isOnline) => {
      setIsOnline(isOnline);
      //Allow to show or hide retrySyn button
      setShowSyncButton(availableForSync(isOnline));
    });

    // check if online first
    NetInfo.fetch().then((state) => {
      setIsOnline(isConnected);
    });

    props.navigation.setParams({
      onPressBack: onPressBack,
      withoutCloseButton: true,
    });
    return () => {
      unsubscribeNetChange();
    };
  }, []);
  const sendEmail = async (email) => {
    let url = `mailto:${email}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    }
  };
  const callPhone = async (phone) => {
    let url = `tel:${phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    }
  };
  const handleResumeClick = () => {
    const {navigation} = props;

    navigation.replace(familyLifemap.progress.screen, {
      draftId: familyLifemap.draftId,
      survey: survey,
      step: familyLifemap.progress.step,
      socioEconomics: familyLifemap.progress.socioEconomics,
    });
  };
  const retrySync = () => {
    const id = familyLifemap.draftId;

    if (loading) {
      return;
    }

    if (props.syncStatus.indexOf(id) === -1) {
      console.log('starting manual sync ', id);
      setLoading(true);
      prepareDraftForSubmit();
    } else {
      console.log('Not available to sync, already enqueue');
    }
  };
  const availableForSync = (isOnline) => {
    const id = familyLifemap.draftId;
    console.log('draft id ', id);
    console.log('list submitted: ', props.syncStatus);
    console.log('Status : ', familyLifemap.status);

    if (
      props.syncStatus.indexOf(id) === -1 &&
      isOnline &&
      props.route.params.familyLifemap.status === 'Pending sync'
    ) {
      console.log('Available for manual sync');
      return true;
    } else {
      console.log('Not available to sync, already enqueue');
      return false;
    }
  };
  const prepareDraftForSubmit = () => {
    if (loading) {
      const draft = prepareDraftForSubmit(familyLifemap, survey);

      if (draft.pictures && draft.pictures.length > 0) {
        props.submitDraftWithImages(
          url[props.env],
          props.user.token,
          draft.draftId,
          {
            ...draft,
            //sendEmail: sendEmailFlag
          },
        );
      } else {
        props.submitDraft(url[props.env], props.user.token, draft.draftId, {
          ...draft,
          pictures: [],
        });
      }

      setTimeout(() => {
        props.navigation.navigate('Dashboard');
      }, 500);
    } else {
      setTimeout(() => {
        prepareDraftForSubmit();
      }, 200);
    }
  };
  const retakeSurvey = () => {
    let draftId = uuid();

    const regularDraft = {
      draftId,
      stoplightSkipped: false,
      sign: '',
      pictures: [],
      sendEmail: false,
      created: Date.now(),
      status: 'Draft',
      surveyId: survey.id,
      surveyVersionId: survey.surveyVersionId,
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      priorities: [],
      achievements: [],
      progress: {
        screen: 'Terms',
        total: getTotalScreens(survey),
      },
      familyData: {
        familyId: familyId,
        countFamilyMembers: familyLifemap.familyData.familyMembersList.length,
        familyMembersList: familyLifemap.familyData.familyMembersList,
      },
    };

    // create the new draft in redux
    props.createDraft(regularDraft);

    props.navigation.navigate('Terms', {
      page: 'terms',
      survey: survey,
      draftId,
    });
  };

  let survey = props.surveys.find((item) => item.id === familyLifemap.surveyId);

  const {t, navigation} = props;
  const {familyData} = familyLifemap;
  const stoplightSkipped = familyLifemap.stoplightSkipped;

  const email =
    familyData &&
    familyData.familyMembersList &&
    familyData.familyMembersList.length &&
    !!familyData.familyMembersList[0].email &&
    familyData.familyMembersList[0].email !== null &&
    familyData.familyMembersList[0].email.length
      ? familyData.familyMembersList[0].email
      : false;

  const phone =
    familyData &&
    familyData.familyMembersList &&
    familyData.familyMembersList.length &&
    !!familyData.familyMembersList[0].phoneNumber &&
    familyData.familyMembersList[0].phoneNumber !== null &&
    familyData.familyMembersList[0].phoneNumber.length
      ? familyData.familyMembersList[0].phoneNumber
      : false;

  return (
    <ScrollView
      style={globalStyles.background}
      contentContainerStyle={styles.container}>
      <View style={styles.tabs}>
        <FamilyTab
          title={t('views.family.details')}
          onPress={() => setActivetab('Details')}
          active={activeTab === 'Details'}
          full={stoplightSkipped ? true : false}
        />
        {!stoplightSkipped && (
          <FamilyTab
            title={t('views.family.lifemap')}
            onPress={() => setActivetab('LifeMap')}
            active={activeTab === 'LifeMap'}
          />
        )}
      </View>

      {/* Details tab */}
      {activeTab === 'Details' ? (
        <ScrollView>
          <View>
            {!!familyData.latitude && !!familyData.longitude && !!isOnline ? (
              // Load Map
              <View style={{marginTop: -50}}>
                <View pointerEvents="none" style={styles.fakeMarker}>
                  <Image source={marker} />
                </View>
                <MapboxGL.MapView
                  style={{width: '100%', height: 189}}
                  logoEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  scrollEnabled={false}
                  pitchEnabled={false}
                  onPress={() => {
                    navigation.navigate('Location', {
                      readOnly: true,
                      survey: survey,
                      family: familyLifemap,
                    });
                  }}>
                  <MapboxGL.Camera
                    defaultSettings={{
                      centerCoordinate: [
                        +familyData.longitude || 0,
                        +familyData.latitude || 0,
                      ],
                      zoomLevel: 15,
                    }}
                    centerCoordinate={[
                      +familyData.longitude || 0,
                      +familyData.latitude || 0,
                    ]}
                    minZoomLevel={10}
                    maxZoomLevel={15}
                  />
                </MapboxGL.MapView>
              </View>
            ) : (
              // Load Map Image
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('Location', {
                    readOnly: true,
                    survey: survey,
                    family: familyLifemap,
                  });
                }}>
                <Image
                  style={styles.imagePlaceholder}
                  source={mapPlaceholderLarge}
                />
              </TouchableHighlight>
            )}
            <View style={styles.faceIconWrapper}>
              <View style={[styles.icon, {marginTop: -16}]}>
                {familyData.countFamilyMembers > 1 && (
                  <View style={styles.countCircleWrapper}>
                    <View style={styles.countCircle}>
                      <Text
                        style={[globalStyles.h3, {color: colors.lightdark}]}>
                        + {familyData.countFamilyMembers - 1}
                      </Text>
                    </View>
                  </View>
                )}

                <Icon
                  name="face"
                  style={styles.faceIcon}
                  color={colors.grey}
                  size={60}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={globalStyles.h2}>
                {props.route.params.familyName}
              </Text>
            </View>
          </View>
          {phone || email ? (
            <View style={styles.familiesIcon}>
              {email ? (
                <View style={styles.familiesIconContainer}>
                  <Icon
                    onPress={() => sendEmail(email)}
                    name="email"
                    style={styles.familiesIconIcon}
                    size={35}
                  />
                </View>
              ) : null}
              {phone ? (
                <View style={styles.familiesIconContainer}>
                  <Icon
                    onPress={() => callPhone(phone)}
                    name="phone"
                    style={styles.familiesIconIcon}
                    size={35}
                  />
                </View>
              ) : null}
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.content}>
              <Text style={[globalStyles.h3, {color: colors.lightdark}]}>
                {t('views.familyMembers').toUpperCase()}
              </Text>
              <FlatList
                data={familyData.familyMembersList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <FamilyListItem
                    icon
                    text={`${item.firstName} ${!index ? item.lastName : ''}`}
                    handleClick={() => {
                      if (!index) {
                        navigation.navigate('FamilyParticipant', {
                          survey: survey,
                          family: familyLifemap,
                          readOnly: true,
                        });
                      } else {
                        console.log(item);
                        navigation.navigate('FamilyMember', {
                          survey: survey,
                          readOnly: true,
                          member: item,
                        });
                      }
                    }}
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.content}>
              <Text style={[globalStyles.h3, {color: colors.lightdark}]}>
                {t('views.family.household').toUpperCase()}
              </Text>
              <FamilyListItem
                text={t('views.location')}
                handleClick={() => {
                  navigation.navigate('Location', {
                    survey: survey,
                    readOnly: true,
                    family: familyLifemap,
                  });
                }}
              />
              {!isDraft
                ? socioEconomicCategories.map((item, index) => (
                    <FamilyListItem
                      key={item}
                      text={item}
                      handleClick={() => {
                        navigation.navigate('SocioEconomicQuestion', {
                          family: familyLifemap,
                          page: index,
                          readOnly: true,
                          survey: survey,
                          title: item,
                        });
                      }}
                    />
                  ))
                : null}
            </View>
          </View>

          {!!allowRetake && (
            <Button
              style={styles.buttonSmall}
              text={t('views.retakeSurvey')}
              handleClick={() => retakeSurvey()}
            />
          )}
        </ScrollView>
      ) : null}

      {/* Lifemap tab */}

      {activeTab === 'LifeMap' ? (
        <ScrollView id="lifemap">
          {isDraft ? (
            <View>
              <View style={styles.draftContainer}>
                <Text
                  style={{
                    ...styles.lifemapCreated,
                    ...globalStyles.h2Bold,
                    fontSize: 16,
                    marginBottom: 10,
                    textAlign: 'center',
                    color: '#000000',
                  }}>{`${t('views.family.lifeMapCreatedOn')}: \n${moment(
                  familyLifemap.created,
                ).format('MMM DD, YYYY')}`}</Text>
                <RoundImage source="lifemap" />

                {props.route.params.familyLifemap.status &&
                props.route.params.familyLifemap.status === 'Draft' ? (
                  <Button
                    id="resume-draft"
                    style={{
                      marginTop: 20,
                    }}
                    colored
                    text={t('general.resumeDraft')}
                    handleClick={() => handleResumeClick()}
                  />
                ) : (
                  <View>
                    <Text
                      style={{
                        ...globalStyles.h2Bold,
                        ...{
                          textAlign: 'center',
                        },
                      }}>
                      {t('views.family.lifeMapAfterSync')}
                    </Text>
                    {showSyncButton && (
                      <Button
                        id="retry"
                        style={styles.button}
                        loading={loading}
                        text={t('views.synced')}
                        handleClick={retrySync}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          ) : (
            <ScrollView>
              <Text
                style={{...styles.lifemapCreated, ...globalStyles.h3}}>{`${t(
                'views.family.created',
              )}:  ${moment(familyLifemap.created).format(
                'MMM DD, YYYY',
              )}`}</Text>
              <OverviewComponent
                route={props.route}
                readOnly
                navigation={navigation}
                familyLifemap={familyLifemap}
              />
            </ScrollView>
          )}
        </ScrollView>
      ) : null}
    </ScrollView>
  );
}

Family.propTypes = {
  surveys: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func,
  submitDraft: PropTypes.func.isRequired,
  submitDraftWithImages: PropTypes.func.isRequired,
  env: PropTypes.string.isRequired,
  createDraft: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  syncStatus: PropTypes.array,
};

const styles = StyleSheet.create({
  familiesIconContainer: {
    backgroundColor: '#50AA47',
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSmall: {
    alignSelf: 'center',
    marginVertical: 20,
    maxWidth: 400,
    backgroundColor: '#50AA47',
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    alignSelf: 'center',
    marginVertical: 20,
    width: '100%',
    maxWidth: 400,

    backgroundColor: colors.palered,
  },
  familiesIconIcon: {
    margin: 'auto',
    color: 'white',
  },
  familiesIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    height: 55,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: 1,
  },
  faceIcon: {
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 15,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  countCircleWrapper: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  countCircle: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{translateX: 13}, {translateY: -13}],
  },
  content: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 30,
  },
  draftContainer: {
    paddingHorizontal: 25,
    marginTop: 70,
  },
  lifemapCreated: {
    marginHorizontal: 25,
    marginTop: 15,
    marginBottom: -10,
    zIndex: 10,
  },
  fakeMarker: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 10, //raise the marker so it's point, not center, marks the location
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceIconWrapper: {
    width: 92,
    height: 92,
    borderRadius: 100,
    marginBottom: 10,
    marginTop: -65,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  imagePlaceholder: {width: '100%', height: 139},
});
const mapDispatchToProps = {
  submitDraft,
  submitDraftWithImages,
  createDraft,
};
const mapStateToProps = ({surveys, env, user, drafts, syncStatus}) => ({
  surveys,
  env,
  user,
  drafts,
  syncStatus,
});

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Family),
);
