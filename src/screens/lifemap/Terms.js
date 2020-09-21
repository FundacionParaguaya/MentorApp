import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {withNamespaces} from 'react-i18next';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import Button from '../../components/Button';
import Decoration from '../../components/decoration/Decoration';
import RoundImage from '../../components/RoundImage';
import globalStyles from '../../globalStyles';
import colors from '../../theme.json';
import ExitDraftModal from '../../screens/modals/ExitDraftModal';
// this describes which screen comes after which
const navigationRules = {
  terms: {
    nextPage: 'Privacy',
    param: 'privacy',
  },
  privacy: {
    nextPage: 'FamilyParticipant',
  },
};

function Terms(props) {
  const [open, setOpen] = useState(false);
  let survey = props.route.params.survey;
  let page = props.route.params.page;
  let draftId = props.route.params.draftId;

  const onClickAgree = () => {
    const {navigation} = props;

    navigation.navigate(navigationRules[page].nextPage, {
      page: navigationRules[page].param || null,
      survey: survey,
      draftId: draftId,
    });
  };
  const {t} = props;

  return (
    <View style={{flex: 1}}>
      <ExitDraftModal
        isOpen={open}
        navigation={props.navigation}
        route={props.route}
        close={() => {
          setOpen(false);
        }}
      />

      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}>
        <View style={globalStyles.container}>
          <Decoration variation="terms">
            <RoundImage source="check" />
          </Decoration>

          <Text id="title" style={[globalStyles.h3Bold, styles.heading]}>
            {page === 'terms'
              ? survey.termsConditions.title
              : survey.privacyPolicy.title}
          </Text>

          <Text id="content" style={[globalStyles.subline, styles.content]}>
            {page === 'terms' &&
              survey.termsConditions.text &&
              survey.termsConditions.text.replace(/\\n/g, '\n')}
            {page !== 'terms' &&
              survey.privacyPolicy.text &&
              survey.privacyPolicy.text.replace(/\\n/g, '\n')}
          </Text>
        </View>
        <View style={styles.buttonsBar}>
          <Button
            id="dissagree"
            text={t('general.disagree')}
            underlined
            handleClick={() => setOpen(true)}
          />
          <Button
            id="agree"
            colored
            text={t('general.agree')}
            handleClick={onClickAgree}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  heading: {
    color: colors.dark,
    textAlign: 'center',
  },
  content: {
    marginTop: 25,
    textAlign: 'justify',
  },
  buttonsBar: {
    height: 50,
    marginTop: 50,
    marginBottom: -2,
    flexDirection: 'row',
  },
});

Terms.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default withNamespaces()(Terms);
