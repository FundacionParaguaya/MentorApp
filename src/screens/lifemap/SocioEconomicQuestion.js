import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withNamespaces} from 'react-i18next';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import * as _ from 'lodash';
import {Formik, Form} from 'formik';
import * as Yup from 'yup';

import Decoration from '../../components/decoration/Decoration';
import SelectWithFormik from '../../components/formik/SelectWithFormik';
import RadioWithFormik from '../../components/formik/RadioWithFormik';
import InputWithFormik from '../../components/formik/InputWithFormik';
import InputWithDep from '../../components/formik/InputWithDep';
import CheckboxWithFormik from '../../components/formik/CheckboxWithFormik';
import StickyFooter from '../../components/StickyFooter';
import {updateDraft} from '../../redux/actions';
import colors from '../../theme.json';
import {
  getConditionalOptions,
  getConditionalQuestions,
  getDraftWithUpdatedEconomic,
  getDraftWithUpdatedFamilyEconomics,
  getDraftWithUpdatedQuestionsCascading,
  getElementsWithConditionsOnThem,
  familyMemberWillHaveQuestions,
  shouldShowQuestion,
} from '../utils/conditional_logic';
import {getTotalScreens, setScreen} from './helpers';
import i18n from '../../i18n';
const capitalize = (string) => _.startCase(string).replace(/ /g, '');
export class SocioEconomicQuestion extends Component {
  readOnlyDraft = this.props.route.params.family || [];
  readOnly = this.props.route.params.readOnly || false;
  survey = this.props.route.params.survey;
  draftId = this.props.route.params.draftId;
  state = {
    initialValues: {},
    questionsWithConditionsOnThem: [],
    conditionalQuestions: [],
  };
  fieldIsRequired = 'validation.fieldIsRequired';
  capitalize = (string) => _.startCase(string).replace(/ /g, '');

  getDraft = () =>
    this.props.drafts.find((draft) => draft.draftId === this.draftId);

  onPressBack = () => {
    const socioEconomics = this.props.route.params.socioEconomics;

    const STEP_BACK = -1;

    if (
      (socioEconomics && socioEconomics.currentScreen === 1) ||
      !socioEconomics
    ) {
      this.props.navigation.navigate('Location', {
        survey: this.survey,
        draftId: this.draftId,
      });
    } else {
      const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft;
      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          socioEconomics: {
            currentScreen: setScreen(
              socioEconomics,
              this.getDraft(),
              STEP_BACK,
            ),
            questionsPerScreen: socioEconomics.questionsPerScreen,
            totalScreens: socioEconomics.totalScreens,
          },
        },
      });
      this.props.navigation.replace('SocioEconomicQuestion', {
        socioEconomics: {
          currentScreen: setScreen(socioEconomics, this.getDraft(), STEP_BACK),
          questionsPerScreen: socioEconomics.questionsPerScreen,
          totalScreens: socioEconomics.totalScreens,
        },
        survey: this.survey,
        draftId: this.draftId,
      });
    }
  };

  onContinue = () => {
    const socioEconomics = this.props.route.params.socioEconomics;
    const STEP_FORWARD = 1;
    const NEXT_SCREEN_NUMBER = setScreen(
      socioEconomics,
      this.getDraft(),
      STEP_FORWARD,
    );

    if (
      !socioEconomics ||
      (socioEconomics &&
        socioEconomics.currentScreen === socioEconomics.totalScreens) ||
      (socioEconomics && NEXT_SCREEN_NUMBER > socioEconomics.totalScreens)
    ) {
      this.props.navigation.navigate('BeginLifemap', {
        survey: this.survey,
        draftId: this.draftId,
      });
    } else {
      const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft;
      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          socioEconomics: {
            currentScreen: NEXT_SCREEN_NUMBER,
            questionsPerScreen: socioEconomics.questionsPerScreen,
            totalScreens: socioEconomics.totalScreens,
          },
        },
      });
      this.props.navigation.replace('SocioEconomicQuestion', {
        survey: this.survey,
        draftId: this.draftId,
        socioEconomics: {
          currentScreen: NEXT_SCREEN_NUMBER,
          questionsPerScreen: socioEconomics.questionsPerScreen,
          totalScreens: socioEconomics.totalScreens,
        },
      });
    }
  };

  isQuestionInCurrentScreen = (question) => {
    const socioEconomics = this.props.route.params.socioEconomics;

    const questions = socioEconomics
      ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
      : null;
    console.log('QUESTION HERE');
    console.log(question);
    const {forFamily = [], forFamilyMember = []} = questions;
    let isPresent = false;
    const lookIn = question.forFamilyMember ? forFamilyMember : forFamily;
    console.log('lookin');
    console.log(lookIn);
    for (const q of lookIn) {
      if (q.codeName === question.codeName) {
        isPresent = true;
        break;
      }
    }
    return isPresent;
  };

  updateEconomicAnswerCascading = (
    question,
    value,
    setFieldValue,
    memberIndex,
  ) => {
    console.log('srtart');
    console.log(question);
    console.log(value);
    console.log(setFieldValue);
    console.log(memberIndex);
    console.log('end shit');
    const draftFromProps = !this.readOnly
      ? this.getDraft()
      : this.readOnlyDraft;

    const {conditionalQuestions, questionsWithConditionsOnThem} = this.state;

    const hasOtherOption = question.codeName.match(/^custom/g);

    // // We get a draft with updated answer
    let key = question.codeName;
    let currentDraft;
    const keyName = !Array.isArray(value) ? 'value' : 'multipleValue';
    let newAnswer = {
      key,
      [keyName]: value,
    };
    if (hasOtherOption) {
      key = _.camelCase(question.codeName.replace(/^custom/g, ''));
      newAnswer = {
        key,
        [keyName]: question.options.find((o) => o.otherOption).value,
        other: value,
      };
    }
    if (question.forFamilyMember) {
      currentDraft = getDraftWithUpdatedFamilyEconomics(
        draftFromProps,
        newAnswer,
        memberIndex,
      );
    } else {
      currentDraft = getDraftWithUpdatedEconomic(draftFromProps, newAnswer);
    }
    const cleanUpHook = (conditionalQuestion, index) => {
      // Cleanup value from form that won't be displayed
      if (conditionalQuestion.forFamilyMember) {
        console.log('ok1');
        if (this.isQuestionInCurrentScreen(conditionalQuestion)) {
          setFieldValue(
            `forFamilyMember.[${index}].[${conditionalQuestion.codeName}]`,
            '',
          );
        }
      } else if (this.isQuestionInCurrentScreen(conditionalQuestion)) {
        console.log('ok2');
        setFieldValue(`forFamily.[${conditionalQuestion.codeName}]`, '');
      }
    };
    // If the question has some conditionals on it,
    // execute function that builds a new draft with cascaded clean up
    // applied
    if (questionsWithConditionsOnThem.includes(question.codeName)) {
      currentDraft = getDraftWithUpdatedQuestionsCascading(
        currentDraft,
        conditionalQuestions.filter(
          (conditionalQuestion) =>
            conditionalQuestion.codeName !== question.codeName,
        ),
        cleanUpHook,
      );
    }
    // Updating formik value for the question that triggered everything
    if (question.forFamilyMember) {
      setFieldValue(
        `forFamilyMember.[${memberIndex}].[${question.codeName}]`,
        value,
      );
    } else {
      setFieldValue(`forFamily.[${question.codeName}]`, value);
    }
    this.props.updateDraft(currentDraft);
  };

  setSocioEconomicsParam() {
    const {navigation} = this.props;
    const {params} = this.props.route;
    // If this is the first socio economics screen set the whole process
    // in the navigation. On every next screen it will know which questions
    // to ask and if it is done.
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft;
    if (!params.socioEconomics) {
      let currentDimension = '';
      let questionsPerScreen = [];
      let totalScreens = 0;

      // go trough all questions and separate them by screen
      // filter method - checks if family members meet the conditions based on age
      this.survey.surveyEconomicQuestions.forEach((question) => {
        // if the dimention of the questions change, change the page
        if (question.topic !== currentDimension) {
          currentDimension = question.topic;
          totalScreens += 1;
        }

        // if there is object for n screen create one
        if (!questionsPerScreen[totalScreens - 1]) {
          questionsPerScreen[totalScreens - 1] = {
            forFamilyMember: [],
            forFamily: [],
          };
        }

        if (question.forFamilyMember) {
          questionsPerScreen[totalScreens - 1].forFamilyMember.push(question);
        } else {
          questionsPerScreen[totalScreens - 1].forFamily.push(question);
        }
      });

      if (params.fromBeginLifemap) {
        navigation.setParams({
          socioEconomics: {
            currentScreen: totalScreens,
            questionsPerScreen,
            totalScreens,
          },
          title: questionsPerScreen[totalScreens - 1].forFamily[0]
            ? questionsPerScreen[totalScreens - 1].forFamily[0].topic
            : questionsPerScreen[totalScreens - 1].forFamilyMember[0].topic,
        });
      } else {
        const page = params.page || 0;
        navigation.setParams({
          socioEconomics: {
            currentScreen: page ? page + 1 : 1,
            questionsPerScreen,
            totalScreens,
          },
          title: questionsPerScreen[page].forFamily[0]
            ? questionsPerScreen[page].forFamily[0].topic
            : questionsPerScreen[page].forFamilyMember[0].topic,
        });
      }
      const socioEconomics = {
        currentScreen: 1,
        questionsPerScreen,
        totalScreens,
      };
      const questionsForThisScreen = socioEconomics
        ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
        : [];

      this.setState({
        initialValues: this.buildInitialValuesForForm(
          questionsForThisScreen,
          draft,
        ),
      });
      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          socioEconomics,
        },
      });
    } else {
      const socioEconomics = params.socioEconomics;
      const questionsForThisScreen = socioEconomics
        ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
        : [];

      navigation.setParams({
        title: questionsForThisScreen.forFamily[0]
          ? questionsForThisScreen.forFamily[0].topic
          : questionsForThisScreen.forFamilyMember[0].topic,
      });

      this.setState({
        initialValues: this.buildInitialValuesForForm(
          questionsForThisScreen,
          draft,
        ),
      });
    }
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused();
  }

  componentDidMount() {
    this.setSocioEconomicsParam();
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft;

    if (!this.readOnly) {
      const conditionalQuestions = getConditionalQuestions(this.survey);
      const elementsWithConditionsOnThem = getElementsWithConditionsOnThem(
        conditionalQuestions,
      );

      this.setState({
        conditionalQuestions,
        questionsWithConditionsOnThem:
          elementsWithConditionsOnThem.questionsWithConditionsOnThem,
      });

      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'SocioEconomicQuestion',
          total: getTotalScreens(this.survey),
        },
      });

      this.props.navigation.setParams({
        onPressBack: this.onPressBack,
      });
    }
  }
  buildValidationForField = (question) => {
    let validation = Yup.string();
    if (question.required) {
      validation = validation.required(this.fieldIsRequired);
    }
    return validation;
  };

  buildValidationSchemaForQuestions = (questions, currentDraft) => {
    const forFamilySchema = {};
    const familyQuestions = (questions && questions.forFamily) || [];

    familyQuestions.forEach((question) => {
      if (shouldShowQuestion(question, currentDraft)) {
        forFamilySchema[question.codeName] = this.buildValidationForField(
          question,
        );
      }
    });

    const forFamilyMemberSchema = {};
    const familyMemberQuestions =
      (questions && questions.forFamilyMember) || [];
    const familyMembersList = _.get(
      currentDraft,
      'familyData.familyMembersList',
      [],
    );

    familyMembersList.forEach((_member, index) => {
      const memberScheme = {};
      familyMemberQuestions.forEach((question) => {
        if (shouldShowQuestion(question, currentDraft, index)) {
          memberScheme[question.codeName] = this.buildValidationForField(
            question,
          );
        }
      });

      forFamilyMemberSchema[index] = Yup.object().shape({
        ...memberScheme,
      });
    });
    const validationSchema = Yup.object().shape({
      forFamily: Yup.object().shape(forFamilySchema),
      forFamilyMember: Yup.object().shape(forFamilyMemberSchema),
    });

    return validationSchema;
  };

  buildInitialValuesForForm = (questions, currentDraft) => {
    const forFamilyInitial = {};
    const familyQuestions = (questions && questions.forFamily) || [];

    familyQuestions.forEach((question) => {
      const draftQuestion =
        currentDraft.economicSurveyDataList.find(
          (e) => e.key === question.codeName,
        ) || {};

      if (question.options.find((o) => o.otherOption)) {
        forFamilyInitial[
          `custom${this.capitalize(question.codeName)}`
        ] = Object.prototype.hasOwnProperty.call(draftQuestion, 'other')
          ? draftQuestion.other
          : '';
      }

      forFamilyInitial[question.codeName] =
        (Object.prototype.hasOwnProperty.call(draftQuestion, 'value')
          ? draftQuestion.value
          : draftQuestion.multipleValue) || '';
    });

    const forFamilyMemberInitial = {};
    const familyMemberQuestions =
      (questions && questions.forFamilyMember) || [];
    const familyMembersList = _.get(
      currentDraft,
      'familyData.familyMembersList',
      [],
    );
    familyMembersList.forEach((familyMember, index) => {
      const memberInitial = {};
      const socioEconomicAnswers = familyMember.socioEconomicAnswers || [];
      familyMemberQuestions.forEach((question) => {
        const draftQuestion =
          socioEconomicAnswers.find((e) => e.key === question.codeName) || {};

        memberInitial[question.codeName] =
          (Object.prototype.hasOwnProperty.call(draftQuestion, 'value')
            ? draftQuestion.value
            : draftQuestion.multipleValue) || '';
      });
      forFamilyMemberInitial[index] = memberInitial;
    });
    return {
      forFamily: forFamilyInitial,
      forFamilyMember: forFamilyMemberInitial,
    };
  };

  render() {
    const {t} = this.props;

    const socioEconomics = this.props.route.params.socioEconomics;

    const questions = socioEconomics
      ? socioEconomics.questionsPerScreen[socioEconomics.currentScreen - 1]
      : null;

    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft;

    if (
      !questions ||
      !this.state.initialValues.forFamily ||
      !this.state.initialValues.forFamilyMember
    ) {
      return null;
    }
    console.log('state');
    console.log(this.state);
    return (
      <Formik
        enableReinitialize
        initialValues={this.state.initialValues}
        validationSchema={this.buildValidationSchemaForQuestions(
          questions,
          draft,
        )}
        noValidate={true}
        onSubmit={this.onContinue}>
        {(formik) => (
          <StickyFooter
            onContinue={() => {
              for (let item of questions.forFamily) {
                formik.setFieldTouched(`forFamily.[${item.codeName}]`);
              }
              for (
                let i = 0;
                i < draft.familyData.familyMembersList.length;
                i++
              ) {
                for (let item of questions.forFamilyMember) {
                  formik.setFieldTouched(
                    `forFamilyMember.[${i}].[${item.codeName}]`,
                  );
                }
              }

              formik.handleSubmit();
            }}
            continueLabel={i18n.t('general.continue')}
            readOnly={!!this.readOnly}
            progress={
              !this.readOnly && draft
                ? ((draft.familyData.countFamilyMembers > 1 ? 3 : 2) +
                    (socioEconomics ? socioEconomics.currentScreen : 1)) /
                  draft.progress.total
                : 0
            }>
            <Decoration variation="socioEconomicQuestion" />

            {/* questions for entire family */}
            {questions &&
              questions.forFamily &&
              questions.forFamily.length > 0 &&
              questions.forFamily.map((question) => {
                const hasOtherOption = question.options.find(
                  (o) => o.otherOption,
                );
                const modifiedQuestion = hasOtherOption
                  ? {
                      ...question,
                      codeName: `custom${this.capitalize(question.codeName)}`,
                    }
                  : null;
                const cleanUp = (value) => {
                  this.updateEconomicAnswerCascading(
                    modifiedQuestion,
                    '',
                    formik.setFieldValue,
                  );
                  this.updateEconomicAnswerCascading(
                    question,
                    value,
                    formik.setFieldValue,
                  );
                };

                if (!shouldShowQuestion(question, draft)) {
                  return <React.Fragment key={question.codeName} />;
                }

                if (question.answerType === 'select') {
                  return (
                    <React.Fragment key={question.codeName}>
                      <SelectWithFormik
                        t={t}
                        name={`forFamily.[${question.codeName}]`}
                        formik={formik}
                        readOnly={this.readOnly}
                        value={
                          !!formik.values.forFamily
                            ? formik.values.forFamily[question.codeName]
                            : ''
                        }
                        question={question}
                        onChange={(value) => {
                          this.updateEconomicAnswerCascading(
                            question,
                            value ? value.value : '',
                            formik.setFieldValue,
                          );
                        }}
                      />
                    </React.Fragment>
                  );
                }
                if (question.answerType === 'radio') {
                  return (
                    <React.Fragment>
                      <RadioWithFormik
                        rawOptions={getConditionalOptions(question, draft)}
                        t={t}
                        formik={formik}
                        question={question}
                        key={question.codeName}
                        name={`forFamily.[${question.codeName}]`}
                        onChange={(e) => {
                          this.updateEconomicAnswerCascading(
                            question,
                            e,
                            formik.setFieldValue,
                          );
                        }}
                      />

                      <InputWithDep
                        formik={formik}
                        key={`custom${capitalize(question.codeName)}`}
                        dep={question.codeName}
                        from={draft}
                        fieldOptions={question.options}
                        target={`custom${capitalize(question.codeName)}`}
                        isEconomic
                        t={t}
                        readOnly={this.readOnly}
                        lng={this.props.language || 'en'}
                        question={question}
                        name={`forFamily.custom${capitalize(
                          question.codeName,
                        )}`}
                        onChange={(e) => {
                          this.updateEconomicAnswerCascading(
                            question,
                            e,
                            formik.setFieldValue,
                          );
                        }}
                        cleanUp={cleanUp}
                      />
                    </React.Fragment>
                  );
                }
                if (question.answerType === 'checkbox') {
                  return (
                    <CheckboxWithFormik
                      rawOptions={getConditionalOptions(question, draft)}
                      t={t}
                      formik={formik}
                      readOnly={this.readOnly}
                      question={question}
                      key={question.codeName}
                      name={`forFamily.[${question.codeName}]`}
                      onChange={(e) => {
                        console.log('multi shit');
                        console.log(e);
                        this.updateEconomicAnswerCascading(
                          question,
                          e,
                          formik.setFieldValue,
                        );
                      }}
                    />
                  );
                }
                return (
                  <InputWithFormik
                    lng={this.props.language || 'en'}
                    t={t}
                    formik={formik}
                    readOnly={this.readOnly}
                    question={question}
                    key={question.codeName}
                    name={`forFamily.[${question.codeName}]`}
                    onChange={(e) =>
                      this.updateEconomicAnswerCascading(
                        question,
                        e,
                        formik.setFieldValue,
                      )
                    }
                  />
                );
              })}

            {questions &&
              questions.forFamilyMember &&
              questions.forFamilyMember.length > 0 &&
              draft.familyData.familyMembersList.map((familyMember, index) => {
                const willShowQuestions = familyMemberWillHaveQuestions(
                  questions,
                  draft,
                  index,
                );
                if (!willShowQuestions) {
                  return <React.Fragment key={familyMember.firstName} />;
                }
                return (
                  <React.Fragment key={familyMember.firstName}>
                    <Text id={familyMember.firstName} style={styles.memberName}>
                      {familyMember.firstName}{' '}
                      {familyMember.lastName && familyMember.lastName}
                    </Text>
                    <React.Fragment>
                      {questions.forFamilyMember.map((question) => {
                        const hasOtherOption = question.options.find(
                          (o) => o.otherOption,
                        );
                        const modifiedQuestion = hasOtherOption
                          ? {
                              ...question,
                              codeName: `custom${capitalize(
                                question.codeName,
                              )}`,
                            }
                          : null;
                        const cleanUp = (value) => {
                          this.updateEconomicAnswerCascading(
                            modifiedQuestion,
                            '',
                            formik.setFieldValue,
                            index,
                          );
                          this.updateEconomicAnswerCascading(
                            question,
                            value,
                            formik.setFieldValue,
                            index,
                          );
                        };

                        if (!shouldShowQuestion(question, draft, index)) {
                          return <React.Fragment key={question.codeName} />;
                        }
                        if (question.answerType === 'select') {
                          return (
                            <React.Fragment key={question.codeName}>
                              <SelectWithFormik
                                t={t}
                                name={`forFamilyMember.[${index}].[${question.codeName}]`}
                                formik={formik}
                                readOnly={this.readOnly}
                                value={
                                  !!formik.values.forFamilyMember
                                    ? formik.values.forFamilyMember[index][
                                        question.codeName
                                      ]
                                    : ''
                                }
                                question={question}
                                onChange={(value) => {
                                  this.updateEconomicAnswerCascading(
                                    question,
                                    value ? value.value : '',
                                    formik.setFieldValue,
                                    index,
                                  );
                                }}
                              />

                              {/* <AutocompleteWithFormik
                                label={question.questionText}
                                name={`forFamilyMember.[${index}].[${question.codeName}]`}
                                rawOptions={getConditionalOptions(
                                  question,
                                  draft,
                                  index
                                )}
                                labelKey="text"
                                valueKey="value"
                                required={question.required}
                                isClearable={!question.required}
                                onChange={value =>
                                  this.updateEconomicAnswerCascading(
                                    question,
                                    value ? value.value : '',
                                    setFieldValue,
                                    index
                                  )
                                }
                              />
                              <InputWithDep
                                key={`custom${capitalize(
                                  question.codeName
                                )}`}
                                dep={question.codeName}
                                index={index || 0}
                                from={draft}
                                fieldOptions={question.options}
                                isEconomic
                                target={`forFamilyMember.[${index}].[custom${capitalize(
                                  question.codeName
                                )}]`}
                                cleanUp={cleanUp}
                              >
                                {(otherOption, value) =>
                                  otherOption === value && (
                                    <InputWithFormik
                                      type="text"
                                      label={t(
                                        'views.survey.specifyOther'
                                      )}
                                      name={`forFamilyMember.[${index}].[custom${capitalize(
                                        question.codeName
                                      )}]`}
                                      required
                                      onChange={e => {
                                        this.updateEconomicAnswerCascading(
                                          modifiedQuestion,
                                          _.get(
                                            e,
                                            'target.value',
                                            ''
                                          ),
                                          setFieldValue,
                                          index
                                        );
                                      }}
                                    />
                                  )
                                }
                              </InputWithDep> */}
                            </React.Fragment>
                          );
                        }
                        if (question.answerType === 'radio') {
                          return <Text>Radio1</Text>;
                          // return (
                          //   <RadioWithFormik
                          //     formik={props}
                          //     label={question.questionText}
                          //     rawOptions={getConditionalOptions(
                          //       question,
                          //       draft,
                          //     )}
                          //     key={question.codeName}
                          //     name={`forFamily.[${question.codeName}]`}
                          //     required={question.required}
                          //     onChange={(e) => {
                          //       this.updateEconomicAnswerCascading(
                          //         question,
                          //         _.get(e, 'target.value', ''),
                          //         formik.setFieldValue,
                          //       );
                          //     }}
                          //   />
                          // );
                          // return (
                          //   <React.Fragment key={question.codeName}>
                          //     <RadioWithFormik
                          //       label={question.questionText}
                          //       name={`forFamilyMember.[${index}].[${question.codeName}]`}
                          //       rawOptions={getConditionalOptions(
                          //         question,
                          //         draft,
                          //         index,
                          //       )}
                          //       required={question.required}
                          //       onChange={(e) => {
                          //         this.updateEconomicAnswerCascading(
                          //           question,
                          //           _.get(e, 'target.value', ''),
                          //           setFieldValue,
                          //           index,
                          //         );
                          //       }}
                          //     />
                          //     <InputWithDep
                          //       key={`custom${capitalize(question.codeName)}`}
                          //       dep={question.codeName}
                          //       index={index || 0}
                          //       from={draft}
                          //       fieldOptions={question.options}
                          //       isEconomic
                          //       target={`forFamilyMember.[${index}].[custom${capitalize(
                          //         question.codeName,
                          //       )}]`}
                          //       cleanUp={cleanUp}>
                          //       {(otherOption, value) =>
                          //         otherOption === value && (
                          //           <InputWithFormik
                          //             type="text"
                          //             label={t('views.survey.specifyOther')}
                          //             name={`forFamilyMember.[${index}].[custom${capitalize(
                          //               question.codeName,
                          //             )}]`}
                          //             required
                          //             onChange={(e) => {
                          //               this.updateEconomicAnswerCascading(
                          //                 modifiedQuestion,
                          //                 _.get(e, 'target.value', ''),
                          //                 setFieldValue,
                          //                 index,
                          //               );
                          //             }}
                          //           />
                          //         )
                          //       }
                          //     </InputWithDep>
                          //   </React.Fragment>
                          // );
                        }
                        if (question.answerType === 'checkbox') {
                          return <Text>CheckBox1</Text>;
                          // return (
                          //   <CheckboxWithFormik
                          //     key={question.codeName}
                          //     label={question.questionText}
                          //     name={`forFamilyMember.[${index}].[${question.codeName}]`}
                          //     rawOptions={getConditionalOptions(
                          //       question,
                          //       draft,
                          //       index,
                          //     )}
                          //     required={question.required}
                          //     onChange={(multipleValue) =>
                          //       this.updateEconomicAnswerCascading(
                          //         question,
                          //         multipleValue,
                          //         setFieldValue,
                          //         index,
                          //       )
                          //     }
                          //   />
                          // );
                        }
                        return <Text>Input1</Text>;
                        // return (
                        //   <InputWithFormik
                        //     key={question.codeName}
                        //     label={question.questionText}
                        //     type={
                        //       question.answerType === 'string'
                        //         ? 'text'
                        //         : question.answerType
                        //     }
                        //     name={`forFamilyMember.[${index}].[${question.codeName}]`}
                        //     required={question.required}
                        //     onChange={(e) =>
                        //       this.updateEconomicAnswerCascading(
                        //         question,
                        //         _.get(e, 'target.value', ''),
                        //         setFieldValue,
                        //         index,
                        //       )
                        //     }
                        //   />
                        // );
                      })}
                    </React.Fragment>
                  </React.Fragment>
                );
              })}
          </StickyFooter>
        )}
      </Formik>
    );
  }
}

const styles = StyleSheet.create({
  memberName: {
    marginHorizontal: 20,
    fontWeight: 'normal',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 20,
  },
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
      },
      android: {
        fontFamily: 'Poppins SemiBold',
      },
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    color: colors.black,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

SocioEconomicQuestion.propTypes = {
  t: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array,
  language: PropTypes.string,
};

const mapDispatchToProps = {
  updateDraft,
};

const mapStateToProps = ({drafts, language}) => ({
  drafts,
  language,
});

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(SocioEconomicQuestion),
);
