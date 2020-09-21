import PropTypes from 'prop-types';
import React from 'react';
import {withNamespaces} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import Button from '../../components/Button';
import Popup from '../../components/Popup';
import i18n from '../../i18n';
import colors from '../../theme.json';

function WhatsappSentModal(props) {
  const {close, isOpen} = props;
  return (
    <Popup isOpen={isOpen} onClose={close}>
      <View style={{paddingVertical: 60}}>
        <View>
          <View>
            <Text style={styles.paragraph}>
              {i18n.t('views.final.yourLifeMaWillBeSentWithWhatSurveySync')}
            </Text>
          </View>

          <Button
            outlined
            borderColor={colors.palegreen}
            text={i18n.t('general.gotIt')}
            style={styles.closeButton}
            handleClick={close}
          />
        </View>
      </View>
    </Popup>
  );
}

WhatsappSentModal.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  userIsOnline: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  paragraph: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: `${colors.grey}`,
    marginBottom: 40,
    fontFamily: 'Poppins Medium',
  },
  closeButton: {
    width: 120,
    alignSelf: 'center',
  },
});

export default withNamespaces()(WhatsappSentModal);
