import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {Platform, StyleSheet, Text, View} from 'react-native';

import DateInput from '../../components/form/DateInput';
import Select from '../../components/form/Select';
import TextInput from '../../components/form/TextInput';
import globalStyles from '../../globalStyles';
import colors from '../../theme.json';

function FamilyMember(props) {
  const setTitle = () => {
    props.navigation.setParams({
      title: props.route.params.member.firstName,
    });
  };
  useEffect(() => {
    if (props.route.params.member) {
      setTitle();
    }
  }, []);
  const {t} = props;
  const member = props.route.params.member;
  return (
    <View style={[globalStyles.background, styles.contentContainer]}>
      <TextInput
        id="readOnlyTextInput"
        placeholder={t('views.family.firstName')}
        initialValue={member.firstName}
        readOnly
        onChangeText={() => {}}
        setError={() => {}}
      />

      <Select
        onChange={() => {}}
        readOnly
        placeholder={t('views.family.gender')}
        initialValue={member.gender}
        options={[
          {text: 'Male', value: 'M'},
          {text: 'Female', value: 'F'},
          {text: 'Other', value: 'O'},
          {text: 'I prefer not to answer', value: 'N'},
        ]}
        setError={() => {}}
      />
      <DateInput
        label={t('views.family.dateOfBirth')}
        initialValue={member.birthDate}
        readOnly
        detectError={() => {}}
        onValidDate={() => {}}
        setError={() => {}}
      />
    </View>
  );
}

FamilyMember.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column',
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

export default withNamespaces()(FamilyMember);
