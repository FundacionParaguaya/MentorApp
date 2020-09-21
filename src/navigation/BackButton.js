import React, {useState} from 'react';

import {AndroidBackHandler} from 'react-navigation-backhandler';
import IconButton from '../components/IconButton';
import ExitDraftModal from '../screens/modals/ExitDraftModal';

import PropTypes from 'prop-types';
import i18n from '../i18n';
import {View} from 'react-native';
function BackButton(props) {
  const [open, setOpen] = useState(false);

  const handlePress = () => {
    const {params} = props.route;
    const {navigation} = props;
    if (!params) {
      navigation.goBack();
      return true;
    }
    const readOnly = params.readOnly && params.readOnly;
    let draftId = params.draftId && params.draftId;
    const deleteDraftOnExit =
      params.deleteDraftOnExit && params.deleteDraftOnExit;
    const survey = params.survey && params.survey;
    const firstLifeMapScreen =
      params.routeName && params.routeName === 'FamilyParticipant';

    // open the exit modal with the params it needs
    if (readOnly) {
      params.onPressBack ? params.onPressBack() : navigation.goBack();
    } else if (deleteDraftOnExit || firstLifeMapScreen) {
      // open exit draft modal
      setOpen(true);
    } else {
      params.onPressBack ? params.onPressBack() : navigation.goBack();
    }

    // Return true needed for the BackHanler button to denote that we have handled the event
    return true;
  };

  return (
    <AndroidBackHandler onBackPress={handlePress}>
      <View>
        <IconButton
          style={props.style}
          onPress={handlePress}
          icon="arrow-back"
          size={25}
          accessible={true}
          accessibilityLabel={i18n.t('general.goback')}
        />
        <ExitDraftModal
          isOpen={open}
          navigation={props.navigation}
          route={props.route}
          close={() => {
            setOpen(false);
          }}
        />
      </View>
    </AndroidBackHandler>
  );
}

BackButton.propTypes = {
  style: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default BackButton;
