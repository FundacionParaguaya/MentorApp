import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import Button from './Button';
import ProgressBar from './ProgressBar';
import PropTypes from 'prop-types';
import Tip from './Tip';
import globalStyles from '../globalStyles';

export default function StickyFooter(props) {
  const [continueVisible, setContinueVisible] = useState(true);
  const toggleContinue = (continueVisible) => {
    setContinueVisible(continueVisible);
  };
  useEffect(() => {
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      toggleContinue(false),
    );
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      toggleContinue(true),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const setMarginTop = () => {
    let marginTop;
    if (!!props.progress && props.currentScreen !== 'Question') {
      marginTop = -20;
    } else {
      marginTop = 0;
    }
    return marginTop;
  };

  return (
    <View
      style={[
        globalStyles.background,
        !!props.currentScreen && props.currentScreen === 'Question'
          ? {paddingTop: 15}
          : {...styles.contentContainer},
        {marginTop: setMarginTop()},
        {flex: 1},
      ]}>
      {!!props.progress && (
        <ProgressBar
          progress={props.progress}
          currentScreen={props.currentScreen || ''}
        />
      )}
      {props.fullHeight ? (
        <View
          style={{width: '100%', flexGrow: 2, marginTop: -15}}
          keyboardShouldPersistTaps={'handled'}>
          {props.children}
        </View>
      ) : (
        <ScrollView keyboardShouldPersistTaps="always">
          {props.children}
        </ScrollView>
      )}

      {!props.readOnly && props.visible && continueVisible ? (
        <View>
          {/* i have changed the height to 61 because there was a weird whitespace if we dont have the progress bar */}
          {props.type === 'button' ? (
            <View style={{height: 61}}>
              <Button
                id="continue"
                colored
                text={props.continueLabel || ''}
                handleClick={props.onContinue || (() => {})}
              />
            </View>
          ) : (
            <Tip
              visible={props.tipIsVisible}
              title={props.tipTitle}
              onTipClose={props.onTipClose}
              description={props.tipDescription}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

StickyFooter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  onContinue: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool,
  continueLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'tip']),
  tipTitle: PropTypes.string,
  tipIsVisible: PropTypes.bool,
  fullHeight: PropTypes.bool,
  tipDescription: PropTypes.string,
  onTipClose: PropTypes.func,
  progress: PropTypes.number,
  currentScreen: PropTypes.string,
};

StickyFooter.defaultProps = {
  type: 'button',
  visible: true,
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});
