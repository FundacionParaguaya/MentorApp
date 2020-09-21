import React, {useState} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import i18n from '../i18n';
import IconButton from '../components/IconButton';

import ExitDraftModal from '../screens/modals/ExitDraftModal';

function CloseButton(props) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <IconButton
        style={props.style}
        onPress={() => setOpen(true)}
        icon="close"
        size={25}
        accessible={true}
        accessibilityLabel={i18n.t('general.exit')}
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
  );
}

CloseButton.propTypes = {
  style: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export const mapStateToProps = ({user}) => ({
  user,
});
export default connect(mapStateToProps)(CloseButton);
