import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StackActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import {Text, StyleSheet, View, Platform} from 'react-native';
import {deleteDraft} from '../../redux/actions';
import Popup from '../../components/Popup';
import Button from '../../components/Button';
import i18n from '../../i18n';
import globalStyles from '../../globalStyles';
import colors from '../../theme.json';
import {exitModalAccessibleText} from '../../screens/utils/accessibilityHelpers';

export class ExitDraftModal extends Component {
  handleClickOnYes = () => {
    this.props.close();
    const {navigation} = this.props;
    const {params} = this.props.route;

    const draftId = params.draftId;
    const deleteDraftOnExit = params.deleteDraftOnExit;

    // delete draft on exit  it's not demo else delete it
    if (draftId && deleteDraftOnExit) {
      this.props.deleteDraft(draftId);
    }

    navigation.dispatch(StackActions.replace('DrawerStack'));
  };

  onClose = () => {
    this.props.close();
  };

  render() {
    const {params} = this.props.route;

    const draftId = params.draftId;
    const deleteDraftOnExit = params.deleteDraftOnExit;
    const screenAccessibilityContent = exitModalAccessibleText(
      draftId,
      deleteDraftOnExit,
    );

    return (
      <Popup isOpen={this.props.isOpen} onClose={this.onClose}>
        <View
          accessible={true}
          accessibilityLabel={screenAccessibilityContent}
          accessibilityLiveRegion="assertive">
          {!draftId || deleteDraftOnExit ? (
            <View>
              <Text style={[globalStyles.centerText, globalStyles.h3]}>
                {deleteDraftOnExit
                  ? i18n.t('views.modals.lifeMapWillNotBeSaved')
                  : i18n.t('views.modals.weCannotContinueToCreateTheLifeMap')}
              </Text>
              <Text style={[globalStyles.centerText, styles.subline]}>
                {i18n.t('views.modals.areYouSureYouWantToExit')}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={[globalStyles.centerText, globalStyles.h3]}>
                {i18n.t('views.modals.yourLifemapIsNotComplete')}
              </Text>
              <Text style={[globalStyles.centerText, styles.subline]}>
                {i18n.t('views.modals.thisWillBeSavedAsADraft')}
              </Text>
            </View>
          )}

          <View style={styles.buttonBar}>
            <Button
              outlined
              text={i18n.t('general.yes')}
              style={{width: 107}}
              handleClick={this.handleClickOnYes}
            />
            <Button
              outlined
              text={i18n.t('general.no')}
              style={{width: 107}}
              handleClick={this.onClose}
            />
          </View>
        </View>
      </Popup>
    );
  }
}

ExitDraftModal.propTypes = {
  navigation: PropTypes.object.isRequired,
  deleteDraft: PropTypes.func.isRequired,
  routeName: PropTypes.string,
};

const styles = StyleSheet.create({
  subline: {
    marginTop: 15,
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '500',
      },
      android: {
        fontFamily: 'Poppins Medium',
      },
    }),
    fontSize: 16,
    lineHeight: 20,
    color: colors.grey,
  },
  buttonBar: {
    flexDirection: 'row',
    marginTop: 33,
    justifyContent: 'space-between',
  },
});

const mapDispatchToProps = {
  deleteDraft,
};

export default connect(() => ({}), mapDispatchToProps)(ExitDraftModal);
