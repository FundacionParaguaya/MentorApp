import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

import Orb from '../../components/decoration/Orb';
import Select from '../../components/form/Select';
import TextInput from '../../components/form/TextInput';
import Popup from '../../components/Popup';
import StickyFooter from '../../components/StickyFooter';
import globalStyles from '../../globalStyles';
import {updateDraft} from '../../redux/actions';
import colors from '../../theme.json';

function AddPriorityAndAchievementModal(props) {
  let draftId = props.draftId;
  const [allOptionsNums, setAllOpetionsNums] = useState([]);
  const [colorRBG, setColorRBG] = useState('');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [indicator, setIndicator] = useState(props.indicator || '');
  const [estimatedDate, setEstimatedDate] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const setError = (error, field) => {
    if (error && !errors.includes(field)) {
      setErrors([...errors, field]);
    } else if (!error) {
      setErrors(errors.filter((item) => item !== field));
    }
  };
  const validateForm = () => {
    if (errors.length) {
      setShowErrors(true);
    } else {
      onContinue();
    }
  };
  const editCounter = (action) => {
    setValidationError(false);
    setEstimatedDate(action);
  };
  const getDraft = () => {
    if (draftId) {
      return props.drafts.find((draft) => draft.draftId === draftId);
    } else {
      return props.draft;
    }
  };
  const addPriority = () => {
    const draft = getDraft();

    const priorities = draft.priorities;
    const item = priorities.find((item) => item.indicator === indicator);
    let updatedDraft = draft;
    // If item exists update it
    if (item) {
      const index = priorities.indexOf(item);
      updatedDraft = {
        ...draft,
        priorities: [
          ...priorities.slice(0, index),
          {reason, action, estimatedDate, indicator},
          ...priorities.slice(index + 1),
        ],
      };
    } else {
      // If item does not exist create it
      updatedDraft = {
        ...draft,
        priorities: [...priorities, {reason, action, estimatedDate, indicator}],
      };
    }

    //Updating the draft
    props.updateDraft(updatedDraft);

    //closing the modal
    props.onClose();
  };
  const addAchievement = () => {
    const draft = getDraft();
    const achievements = draft.achievements;
    const item = achievements.find((item) => item.indicator === indicator);

    let updatedDraft = draft;

    // If item exists update it
    if (item) {
      const index = achievements.indexOf(item);
      updatedDraft = {
        ...draft,
        achievements: [
          ...achievements.slice(0, index),
          {action, roadmap, indicator},
          ...achievements.slice(index + 1),
        ],
      };
    } else {
      // If item does not exist create it
      updatedDraft = {
        ...draft,
        achievements: [...achievements, {action, roadmap, indicator}],
      };
    }
    //Updating the draft
    props.updateDraft(updatedDraft);
    //closing the modal
    props.onClose();
  };
  useEffect(() => {
    const draft = getDraft();
    if (props.color === 3) {
      const achievement = getAchievementValue(draft);
      setColorRBG(colors.palegreen);
      setAction(achievement.action);
      setRoadmap(achievement.roadmap);
      setIndicator(achievement.indicator);
    } else {
      const priority = getPriorityValue(draft);
      let allOptionsNums = [];
      for (let x = 1; x < 25; x++) {
        allOptionsNums.push({value: x, text: String(x)});
      }
      setEstimatedDate(priority.estimatedDate);
      setColorRBG(props.color === 1 ? colors.palered : colors.palegold);
      setAllOpetionsNums(allOptionsNums);
      setAction(priority.action);
      setReason(priority.reason);
      setIndicator(priority.indicator);
    }
  }, []);
  const getPriorityValue = (data) => {
    const priority = data.priorities.find(
      (priority) => priority.indicator === indicator,
    );
    return priority;
  };
  const getAchievementValue = (data) => {
    const achievement = data.achievements.find(
      (achievement) => achievement.indicator === indicator,
    );

    return achievement;
  };
  const onContinue = () => {
    props.color !== 3 ? addPriority() : addAchievement();
  };
  const draft = getDraft();
  const {t} = props;

  var isReadOnly = false;

  if (draft.status) {
    isReadOnly = draft.status === 'Synced';
  } else {
    isReadOnly = true;
  }

  //i cound directly use action for the values below but
  // it just doesnt work.Thats why i use the old way from the old components
  let priority;
  let achievement;
  if (props.color !== 3) {
    priority = getPriorityValue(draft);
  } else {
    achievement = getAchievementValue(draft);
  }

  return (
    <Popup isOpen modifiedPopUp onClose={props.onClose}>
      <StickyFooter
        onContinue={validateForm}
        continueLabel={
          props.color !== 3
            ? t('views.lifemap.makePriority')
            : t('views.lifemap.makeAchievement')
        }
        type="button"
        visible={true}
        readOnly={isReadOnly}>
        <View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20,
              }}>
              <Orb size={55} color={colorRBG} position={{x: 0, y: 0}} />
              <View style={styles.blueIcon}>
                <Icon2
                  name={props.color === 3 ? 'star' : 'pin'}
                  color={colors.white}
                  size={20}
                />
              </View>
            </View>
            <View style={styles.subheading}>
              <Text style={globalStyles.h2}>{props.indicatorText}</Text>
            </View>
          </View>
          {/* load the qustions for priorities if 3 or 2 and achievemnt if 1*/}
          {props.color !== 3 ? (
            <React.Fragment>
              <TextInput
                id="whyDontYouHaveIt"
                onChangeText={(text) => setReason(text)}
                placeholder={t('views.lifemap.whyDontYouHaveIt')}
                initialValue={priority ? priority.reason : ''}
                multiline
                readOnly={isReadOnly}
                showErrors={showErrors}
                setError={(isError) => setError(isError, 'whyDontYouHaveIt')}
              />
              <TextInput
                id="whatWillYouDoToGetIt"
                onChangeText={(text) => setAction(text)}
                placeholder={t('views.lifemap.whatWillYouDoToGetIt')}
                initialValue={priority ? priority.action : ''}
                multiline
                readOnly={isReadOnly}
                showErrors={showErrors}
                setError={(isError) =>
                  setError(isError, 'whatWillYouDoToGetIt')
                }
              />
              <View>
                <Select
                  id="howManyMonthsWillItTake"
                  required
                  onChange={editCounter}
                  placeholder={t('views.lifemap.howManyMonthsWillItTake')}
                  initialValue={priority ? priority.estimatedDate : ''}
                  options={allOptionsNums}
                  readOnly={isReadOnly}
                  showErrors={showErrors}
                  setError={(isError) =>
                    setError(isError, 'howManyMonthsWillItTake')
                  }
                />
              </View>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TextInput
                id="howDidYouGetIt"
                onChangeText={(text) => setAction(text)}
                placeholder={t('views.lifemap.howDidYouGetIt')}
                initialValue={achievement ? achievement.action : ''}
                required
                multiline
                readOnly={isReadOnly}
                showErrors={showErrors}
                setError={(isError) => setError(isError, 'howDidYouGetIt')}
              />

              <TextInput
                id="whatDidItTakeToAchieveThis"
                onChangeText={(text) => setRoadmap(text)}
                placeholder={t('views.lifemap.whatDidItTakeToAchieveThis')}
                initialValue={achievement ? achievement.roadmap : ''}
                multiline
                readOnly={isReadOnly}
                showErrors={showErrors}
                setError={(isError) =>
                  setError(isError, 'whatDidItTakeToAchieveThis')
                }
              />
            </React.Fragment>
          )}

          {validationError ? (
            <Text style={styles.validationText}>
              {t('validation.fieldIsRequired')}
            </Text>
          ) : (
            <View />
          )}
        </View>
      </StickyFooter>
    </Popup>
  );
}

AddPriorityAndAchievementModal.propTypes = {
  t: PropTypes.func.isRequired,
  indicatorText: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  draft: PropTypes.object,
  color: PropTypes.number,
  onClose: PropTypes.func,
  updateDraft: PropTypes.func.isRequired,
  draftId: PropTypes.number,
  drafts: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
};

const styles = StyleSheet.create({
  blueIcon: {
    borderRadius: 100,
    zIndex: 10,
    backgroundColor: colors.blue,
    width: 30,
    height: 30,
    marginLeft: 35,
    marginBottom: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subheading: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  validationText: {
    paddingHorizontal: 15,
    color: colors.red,
  },
});

const mapDispatchToProps = {
  updateDraft,
};

const mapStateToProps = ({drafts}) => ({drafts});

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(AddPriorityAndAchievementModal),
);
