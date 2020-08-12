import {get} from 'lodash';
import React, {useEffect} from 'react';
import InputWithFormik from '../../components/formik/InputWithFormik';
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
  onChange,
  question,
  label,
}) => {
  const otherOption = getOtherOption(fieldOptions);
  const value = getFieldValue(from, dep, index, isEconomic);

  if (
    (otherOption !== value && !!get(formik.values, target)) ||
    (otherOption !== value && !!get(formik.values, `forFamily.${target}`)) ||
    (otherOption !== value && !!get(formik.values, `forFamilyMember.${target}`))
  ) {
    cleanUp(value);
  }

  if (otherOption && value && otherOption === value) {
    return (
      <InputWithFormik
        label={label}
        lng={lng}
        t={t}
        formik={formik}
        readOnly={readOnly}
        question={question}
        name={name}
        onChange={(e) => onChange(e)}
      />
    );
  }

  return <React.Fragment />;
};

const getOtherOption = (options) => {
  if (!options.some((e) => e.otherOption)) {
    return null;
  }

  return options.filter((e) => e.otherOption)[0].value;
};

const getFieldValue = (draft, field, index, isEconomic) => {
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
      return draft.familyData.familyMembersList[
        index
      ].socioEconomicAnswers.find((e) => e.key === field).value;
    }

    if (
      !draft ||
      !draft.economicSurveyDataList ||
      !draft.economicSurveyDataList.find((e) => e.key === field)
    ) {
      return null;
    }

    return draft.economicSurveyDataList.find((e) => e.key === field).value;
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

export default InputWithDep;
