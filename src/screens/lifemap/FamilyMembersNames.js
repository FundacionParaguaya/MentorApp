import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import uuid from 'uuid/v1';

import Button from '../../components/Button';
import Decoration from '../../components/decoration/Decoration';
import DateInput from '../../components/form/DateInput';
import Select from '../../components/form/Select';
import TextInput from '../../components/form/TextInput';
import Popup from '../../components/Popup';
import StickyFooter from '../../components/StickyFooter';
import globalStyles from '../../globalStyles';
import {updateDraft} from '../../redux/actions';
import colors from '../../theme.json';
import {getTotalScreens, setValidationSchema} from './helpers';

function FamilyMembersNames(props) {
  let survey = props.route.params.survey;
  let readOnly = props.route.params.readOnly;
  let draftId = props.route.params.draftId;
  let requiredFields =
    (survey.surveyConfig &&
      survey.surveyConfig.requiredFields &&
      survey.surveyConfig.requiredFields.primaryParticipant) ||
    null;
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMembersContinue, setDeleteMembersContinue] = useState(false);
  const getDraft = () =>
    props.drafts.find((draft) => draft.draftId === draftId);
  const setError = (error, field, memberId) => {
    let errorExists = false;
    for (let errorIndex in errors) {
      if (errors[errorIndex].memberId == memberId) {
        errorExists = true;
        break;
      }
    }
    if (!error) {
      setErrors(errors.filter((item) => item.memberId !== memberId));
    } else if (error && !errorExists) {
      setErrors([...errors, {field, memberId}]);
    }
  };

  const validateForm = () => {
    console.log(errors);
    if (errors.length) {
      setShowErrors(true);
    } else {
      console.log('contineu');
      onContinue();
    }
  };
  const onPressBack = () => {
    props.navigation.navigate('FamilyParticipant', {
      draftId: draftId,
      survey: survey,
    });
  };
  //REFACTORNOTE
  //  shouldComponentUpdate() {
  //   return props.navigation.isFocused();
  // }
  const deleteMember = function (index) {
    const draft = getDraft();

    let newArr = [...familyMembers];
    newArr.splice(index, 1);
    setFamilyMembers(newArr);

    let familyMembersList = draft.familyData.familyMembersList;
    var newCount = draft.familyData.countFamilyMembers;

    if (
      familyMembersList.length < draft.familyData.countFamilyMembers ||
      familyMembersList.length == draft.familyData.countFamilyMembers
    ) {
      newCount -= 1;
    }
    familyMembersList.splice(index, 1);

    props.updateDraft({
      ...draft,
      familyData: {
        ...draft.familyData,
        countFamilyMembers: newCount,
        familyMembersList,
      },
    });
  };
  const onContinue = () => {
    const draft = getDraft();

    if (
      draft.familyData.familyMembersList.length >
      draft.familyData.countFamilyMembers
    ) {
      setIsOpen(true);
      setDeleteMembersContinue(true);
    } else {
      props.navigation.replace('Location', {
        draftId: draftId,
        survey: survey,
      });
    }
  };
  const addMember = () => {
    const draft = getDraft();

    let newArr = [...familyMembers];
    let newUUid = uuid();
    newArr.push({firstParticipant: false, uuid: newUUid});
    setFamilyMembers(newArr);

    let familyMembersList = draft.familyData.familyMembersList;

    familyMembersList.push({firstParticipant: false, uuid: newUUid});
    var familyMemberCount = draft.familyData.countFamilyMembers;

    if (
      draft.familyData.familyMembersList.length >
      draft.familyData.countFamilyMembers
    ) {
      familyMemberCount += 1;
    }
    props.updateDraft({
      ...draft,
      familyData: {
        ...draft.familyData,
        countFamilyMembers: familyMemberCount,
        familyMembersList,
      },
    });
  };
  const updateMember = (value, memberField, memberIndex) => {
    if (!memberField) {
      return;
    }

    const draft = getDraft();
    setFamilyMembers(
      Object.assign([], familyMembers, {
        [memberIndex]: {
          ...familyMembers[memberIndex],
          firstParticipant: false,
          [memberField]: value,
        },
      }),
    );

    props.updateDraft({
      ...draft,
      familyData: {
        ...draft.familyData,
        familyMembersList: Object.assign(
          [],
          draft.familyData.familyMembersList,
          {
            [memberIndex]: {
              ...draft.familyData.familyMembersList[memberIndex],
              firstParticipant: false,
              [memberField]: value,
            },
          },
        ),
      },
    });
  };
  useEffect(() => {
    const draft = getDraft();
    var familyMembers = [];

    for (var member in draft.familyData.familyMembersList) {
      draft.familyData.familyMembersList[member].uuid = uuid();

      familyMembers.push(draft.familyData.familyMembersList[member]);
    }

    for (var memberIndex in familyMembers) {
      familyMembers[memberIndex].uuid = uuid();
    }
    var haveMoreMembers =
      draft.familyData.familyMembersList.length >
      draft.familyData.countFamilyMembers;
    setFamilyMembers(familyMembers);
    setIsOpen(haveMoreMembers);

    if (!readOnly && draft.progress.screen !== 'FamilyMembersNames') {
      props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'FamilyMembersNames',
          total: getTotalScreens(survey),
        },
      });
    }

    props.navigation.setParams({
      onPressBack: onPressBack,
    });
  }, []);

  const {t} = props;

  const draft = getDraft();
  const {familyMembersList} = draft.familyData;

  return (
    <StickyFooter
      onContinue={validateForm}
      continueLabel={t('general.continue')}
      readOnly={!!readOnly}
      progress={2 / draft.progress.total}>
      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <View style={{paddingVertical: 60}}>
          <View>
            <View>
              <Text style={styles.paragraph}>
                {deleteMembersContinue
                  ? t('views.family.membersDontMatch')
                  : t('views.family.deleteMembers')}
              </Text>
            </View>

            <Button
              outlined
              borderColor={colors.palegreen}
              text={t('general.gotIt')}
              style={styles.closeButton}
              handleClick={() => setIsOpen(false)}
            />
          </View>
        </View>
      </Popup>

      <Decoration variation="familyMemberNamesHeader">
        <View style={styles.circleContainer}>
          <Text style={styles.circle}>+{familyMembersList.length}</Text>
          <Icon name="face" color={colors.grey} size={61} style={styles.icon} />
        </View>
        <Text style={[globalStyles.h2Bold, styles.heading]}>
          {t('views.family.familyMembersHeading')}
        </Text>
      </Decoration>

      {familyMembers.map((item, i) => {
        if (!item.firstParticipant) {
          return (
            <View style={{marginBottom: 20}} key={`${item.uuid}`}>
              {/*  {i % 2 ? (
            <Decoration variation="familyMemberNamesBody" />
          ) : null} */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingHorizontal: 20,
                  marginBottom: 15,
                }}>
                <Icon name="face" color={colors.grey} size={22} />
                <Text
                  style={{
                    ...globalStyles.h2Bold,
                    fontSize: 16,
                    color: colors.grey,
                    marginLeft: 5,
                  }}>
                  {`${t('views.family.familyMember')} ${i + 1}`}
                </Text>

                <TouchableHighlight
                  underlayColor={'transparent'}
                  activeOpacity={1}
                  onPress={() => deleteMember(i)}
                  accessible={true}
                  style={{marginLeft: 'auto'}}>
                  <View
                    style={{
                      borderColor: colors.palered,
                      borderRadius: 100,
                      borderWidth: 1.5,
                    }}>
                    <Icon name="remove" color={colors.palered} size={26} />
                  </View>
                </TouchableHighlight>
              </View>
              <TextInput
                id={item.uuid}
                autoFocus={i === 0 && !item.firstName}
                upperCase
                //validation="string"
                onChangeText={(value) => updateMember(value, 'firstName', i)}
                placeholder={`${t('views.family.firstName')}`}
                initialValue={item.firstName || ''}
                required={setValidationSchema(
                  requiredFields,
                  'firstName',
                  true,
                )}
                readOnly={!!readOnly}
                showErrors={showErrors}
                setError={(isError) =>
                  setError(isError, 'firstName', item.uuid)
                }
              />
              <Select
                onChange={(value) => updateMember(value, 'gender', i)}
                label={t('views.family.gender')}
                placeholder={t('views.family.selectGender')}
                initialValue={item.gender || ''}
                options={survey.surveyConfig.gender}
                required={setValidationSchema(requiredFields, 'gender', false)}
                otherField={`${item.customGender}`}
                otherPlaceholder={t('views.family.specifyGender')}
                initialOtherValue={item.customGender || ''}
                readOnly={!!readOnly}
                showErrors={showErrors}
              />

              <DateInput
                id={item.uuid}
                label={t('views.family.dateOfBirth')}
                onValidDate={(value) => updateMember(value, 'birthDate', i)}
                initialValue={item.birthDate}
                required={setValidationSchema(
                  requiredFields,
                  'birthDate',
                  false,
                )}
                readOnly={!!readOnly}
                showErrors={showErrors}
              />
            </View>
          );
        }
      })}

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 25,
        }}>
        <View
          style={{
            borderColor: colors.green,
            borderRadius: 120,
            borderWidth: 2,
            marginBottom: 5,
          }}>
          <Icon
            onPress={() => addMember()}
            name="add"
            color={colors.green}
            size={22}
          />
        </View>
        <Text
          onPress={() => addMember()}
          style={{
            ...globalStyles.h2Bold,
            fontSize: 16,
            color: colors.green,
            marginLeft: 5,
          }}>
          Add new member
        </Text>
      </View>
    </StickyFooter>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 22,
    color: `${colors.grey}`,
    marginBottom: 40,
    fontFamily: 'Poppins Medium',
  },
  icon: {
    alignSelf: 'center',
  },
  closeButton: {
    width: 120,
    alignSelf: 'center',
  },
  circleContainer: {
    // marginBottom: 10,
    marginTop: 20,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    width: 22,
    height: 22,
    lineHeight: 22,
    left: '50%',
    textAlign: 'center',
    fontSize: 10,
    transform: [{translateX: 3}, {translateY: -3}],
    borderRadius: 50,
    backgroundColor: colors.lightgrey,
    zIndex: 1,
  },
  heading: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 25,
    paddingHorizontal: 20,
    color: colors.grey,
  },
});

FamilyMembersNames.propTypes = {
  drafts: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  updateDraft: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updateDraft,
};

const mapStateToProps = ({drafts}) => ({drafts});

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(FamilyMembersNames),
);
