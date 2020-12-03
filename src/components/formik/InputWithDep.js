import { get } from 'lodash';
import React from 'react';
import InputWithFormik from '../../components/formik/InputWithFormik';

const getOtherOption = (options) => {
  if (!options.some((e) => e.otherOption)) {
    return null;
  }

  return options.filter((e) => e.otherOption)[0].value;
};

const getFieldValue = (draft, field, index, isEconomic, isMultiValue) => {
  if (isEconomic) {
    if (
      index >= 0 &&
      draft &&
      index >= 0 &&
      draft.familyData &&
      index >= 0 &&
      draft.familyData.familyMembersList[index].socioEconomicAnswers.find(
        (e) => e.key === field,
      )
    ) {
      const question = draft.familyData.familyMembersList[
        index
      ].socioEconomicAnswers.find((e) => e.key === field)
      return !isMultiValue ? question.value : question.multipleValue;
    }
    if (
      !draft ||
      !draft.economicSurveyDataList ||
      !draft.economicSurveyDataList.find((e) => e.key === field)
    ) {
      return null;
    }
    const question = draft.economicSurveyDataList.find((e) => e.key === field);

    return !isMultiValue ? question.value : question.multipleValue;
  }

  const innerIndex = index || 0;
  if (
    !draft ||
    !draft.familyData ||
    !draft.familyData.familyMembersList[innerIndex][field]
  ) {
    return null;
  }

  return draft.familyData.familyMembersList[innerIndex][field];
};

const InputWithDep = ({
  dep,
  fieldOptions,
  from,
  t,
  lng,
  index,
  readOnly,
  target,
  cleanUp,
  formik,
  name,
  isEconomic,
  isMultiValue,
  onChange,
  question,
  label,
}) => {
  const otherOption = getOtherOption(fieldOptions);
  if (!isMultiValue) {
    const value = getFieldValue(from, dep, index, isEconomic, isMultiValue);
    if (
      (otherOption !== value && !!get(formik.values, target)) ||
      (otherOption !== value && !!get(formik.values, `forFamily.${target}`)) ||
      (otherOption !== value && !!get(formik.values, `forFamilyMember.${target}`))
    ) {
      cleanUp(value);
    }
    if (otherOption && value && otherOption === value) {
      return <InputWithFormik
        label={label}
        lng={lng}
        t={t}
        formik={formik}
        readOnly={readOnly}
        question={question}
        name={name}
        onChange={(e) => onChange(e)}
      />;
    }
  } else {
    const values =
      getFieldValue(from, dep, index, isEconomic, isMultiValue) || [];

    if (
      (!values.find(v => v === otherOption) && !!get(formik.values, target)) ||
      (!values.find(v => v === otherOption) &&
        !!get(formik.values, `forFamily.${target}`)) ||
      (!values.find(v => v === otherOption) &&
        !!get(formik.values, `forFamilyMember.${target}`))
    ) {
      cleanUp();
    } else {
      if (otherOption && !!values.find(v => v === otherOption)) {
        return <InputWithFormik
          label={label}
          lng={lng}
          t={t}
          formik={formik}
          readOnly={readOnly}
          question={question}
          name={name}
          onChange={(e) => onChange(e)}
        />;
      }
    }
    return <React.Fragment />;
  };
  return null
}
export default InputWithDep;
