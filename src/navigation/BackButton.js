import React, {Component} from 'react';

import {AndroidBackHandler} from 'react-navigation-backhandler';
import IconButton from '../components/IconButton';
import PropTypes from 'prop-types';
import i18n from '../i18n';
import {View} from 'react-native';

class BackButton extends Component {
  handlePress = () => {
    console.log('backhgh here');
    const {params} = this.props.route;
    const {navigation} = this.props;
    if (!params) {
      navigation.goBack();
      return true;
    }
    const readOnly = params.readOnly && params.readOnly;
    const draftId = params.draftId && params.draftId;
    const deleteDraftOnExit =
      params.deleteDraftOnExit && params.deleteDraftOnExit;
    const survey = params.survey && params.survey;
    const firstLifeMapScreen =
      params.routeName && params.routeName === 'FamilyParticipant';

    // open the exit modal with the params it needs
    if (readOnly) {
      params.onPressBack ? params.onPressBack() : navigation.goBack();
    } else if (deleteDraftOnExit || firstLifeMapScreen) {
      this.props.navigation.navigate('ExitDraftModal', {
        draftId,
        deleteDraftOnExit,
        survey,
      });
    } else {
      params.onPressBack ? params.onPressBack() : navigation.goBack();
    }

    // Return true needed for the BackHanler button to denote that we have handled the event
    return true;
  };

  render() {
    return (
      <AndroidBackHandler onBackPress={this.handlePress}>
        <View>
          <IconButton
            style={this.props.style}
            onPress={this.handlePress}
            icon="arrow-back"
            size={25}
            accessible={true}
            accessibilityLabel={i18n.t('general.goback')}
          />
        </View>
      </AndroidBackHandler>
    );
  }
}

BackButton.propTypes = {
  style: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default BackButton;
