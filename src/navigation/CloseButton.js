import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import i18n from '../i18n';
import IconButton from '../components/IconButton';

import ExitDraftModal from '../screens/modals/ExitDraftModal';

class CloseButton extends Component {
  state = {
    open: false,
  };

  render() {
    return (
      <View>
        <IconButton
          style={this.props.style}
          onPress={() => this.setState({open: true})}
          icon="close"
          size={25}
          accessible={true}
          accessibilityLabel={i18n.t('general.exit')}
        />
        <ExitDraftModal
          isOpen={this.state.open}
          navigation={this.props.navigation}
          route={this.props.route}
          close={() => {
            this.setState({open: false});
          }}
        />
      </View>
    );
  }
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
