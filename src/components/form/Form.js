// Unfortunately something weird and undocumented is happening when using this
// component after building in Android studio. Probably related to
// React.cloneChild. We are for now forced to use in screen view validation.

import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';

import globalStyles from '../../globalStyles';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import Tip from '../Tip';

const formTypes = ['TextInput', 'Select', 'LoadNamespace(DateInputComponent)'];

export default function Form(props) {
  const [continueVisible, setContinueVisible] = useState(true);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  const setMarginTop = () => {
    let marginTop;
    if (!!props.progress && props.currentScreen !== 'Question') {
      marginTop = -20;
    } else {
      marginTop = 0;
    }
    return marginTop;
  };
  const toggleContinue = (continueVisible) => {
    setContinueVisible(continueVisible);
  };
  const setError = (error, field, memberIndex) => {
    const {onErrorStateChange} = props;

    const fieldName = memberIndex ? `${field}-${memberIndex}` : field;

    if (error && !errors.includes(fieldName)) {
      setErrors([...errors, fieldName]);
    } else if (!error) {
      setErrors(errors.filter((item) => item !== fieldName));
    }

    if (onErrorStateChange) {
      onErrorStateChange(error || errors.length);
    }
  };

  const cleanErrorsCodenamesOnUnmount = (field, memberIndex) => {
    const fieldName = memberIndex ? `${field}-${memberIndex}` : field;
    let errorsDetected = [];
    if (fieldName) {
      errorsDetected = errors.filter((item) => item !== fieldName);
    }
    setErrors(errorsDetected);
  };

  const validateForm = () => {
    if (errors.length) {
      setShowErrors(true);
    } else {
      props.onContinue();
    }
  };
  const generateClonedChild = (child) =>
    React.cloneElement(child, {
      readOnly: props.readOnly,
      setError: (isError) =>
        setError(isError, child.props.id, child.props.memberIndex || null),
      cleanErrorsOnUnmount:
        child.type &&
        child.type.displayName &&
        child.type.displayName === 'Select'
          ? () =>
              cleanErrorsCodenamesOnUnmount(
                child.props.id,
                child.props.memberIndex || false,
              )
          : false,
      showErrors: showErrors,
    });
  const renderChildrenRecursively = (children) => {
    let that = this;

    return React.Children.map(children, (child) => {
      if (
        child &&
        child.type &&
        formTypes.some((item) => item === child.type.displayName)
      ) {
        return generateClonedChild(child);
      } else if (child && child.props && child.props.children) {
        return React.cloneElement(child, {
          children: that.renderChildrenRecursively(
            Array.isArray(child.props.children)
              ? child.props.children
              : [child.props.children],
          ),
        });
      } else {
        return child;
      }
    });
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
  const children = renderChildrenRecursively(props.children);
  return (
    <View
      style={[
        globalStyles.background,
        !!props.currentScreen && props.currentScreen === 'Question'
          ? {paddingTop: 15}
          : {...styles.contentContainer},
        {marginTop: setMarginTop()},
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
          {children}
        </View>
      ) : (
        <ScrollView>{children}</ScrollView>
      )}

      {!props.readOnly && props.visible && continueVisible ? (
        <View>
          {/* i have changed the height to 61 because there was a weird whitespace if we dont have the progress bar */}
          {props.type === 'button' ? (
            <View style={{height: 61}}>
              <Button
                id="continue"
                colored
                text={props.continueLabel}
                handleClick={validateForm}
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

Form.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  onContinue: PropTypes.func,
  onErrorStateChange: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  continueLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'tip']),
  tipTitle: PropTypes.string,
  tipIsVisible: PropTypes.bool,
  fullHeight: PropTypes.bool,
  tipDescription: PropTypes.string,
  onTipClose: PropTypes.func,
  readOnly: PropTypes.bool,
  progress: PropTypes.number,
  currentScreen: PropTypes.string,
};

Form.defaultProps = {
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
