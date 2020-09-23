import NetInfo from '@react-native-community/netinfo';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, {useRef, useState, useEffect} from 'react';
import {withNamespaces} from 'react-i18next';
import {
  AppState,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';

import logo from '../../assets/images/logo.png';
import Button from '../components/Button';
import {url} from '../config';
import globalStyles from '../globalStyles';
import {
  login,
  setDimensions,
  setDownloadMapsAndImages,
  setEnv,
} from '../redux/actions';
import colors from '../theme.json';
import {getDeviceLanguage} from '../utils';
import InternalStorageFullModal, {
  MINIMUM_REQUIRED_STORAGE_SPACE_500_MB,
} from './modals/InternalStorageFullModal';

// get env

function Login(props) {
  let unsubscribeNetChange = null;
  const nodeEnv = process.env;
  const [formData, setFormDate] = useState({username: '', password: ''});
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [isConnected, setConnection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [devOptions, setDevOptions] = useState({
    syncMaps: true,
    syncImages: true,
  });
  const [appState, setAppState] = useState(AppState.currentState);
  const [notEnoughStorageSpace, setNotEnoughStorageSpace] = useState(false);

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      const lng = getDeviceLanguage();
      i18n.changeLanguage(lng);
    });

    // if use has logged in navigate to Loading
    if (props.user.token) {
      console.log('NAVIGATE');
      props.navigation.navigate('Loading');
    } else {
      AppState.addEventListener('change', handleAppStateChange);
      setDimensions();

      // check connection
      NetInfo.fetch().then((state) => setConnectivityState(isConnected));
      unsubscribeNetChange = NetInfo.addEventListener((state) => {
        setConnectivityState(isConnected);
      });
    }
    return () => {
      if (unsubscribeNetChange) {
        unsubscribeNetChange();
      }
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const setConnectivityState = (isConnected) => {
    if (isConnected) {
      setConnection(true);
      setError(false);
    } else {
      setConnection(false);
      setError('No connection');
    }
  };
  const setDimensions = () => {
    const {width, height, scale} = props.dimensions;
    const screenDimensions = Dimensions.get('window');

    if (
      width !== screenDimensions.width ||
      height !== screenDimensions.height ||
      scale !== screenDimensions.scale
    ) {
      props.setDimensions({
        height: screenDimensions.height,
        width: screenDimensions.width,
        scale: screenDimensions.scale,
      });
    }
  };
  const checkDevOption = (devProp) => {
    setDevOptions({...devOptions, [devProp]: !devOptions[devProp]});
  };
  const onLogin = async () => {
    let {password, username} = formData;
    if (!(await isStorageSpaceEnough())) {
      setNotEnoughStorageSpace(true);
      return;
    }
    setLoading(true);
    setError(false);
    setError2(false);

    props.setDownloadMapsAndImages({
      downloadMaps: devOptions.syncMaps,
      downloadImages: devOptions.syncImages,
    });
    let env = username.trim() === 'demo' ? 'demo' : 'production';
    username = username.trim();
    let envCheck = username.trim().substring(0, 2);

    if (envCheck === 't/' || envCheck === 'd/' || envCheck === 'p/') {
      if (envCheck === 't/') {
        env = 'testing';
      } else if (envCheck === 'd/') {
        env = 'demo';
      } else if (envCheck === 'p/') {
        env = 'production';
      }

      username = username.trim().substring(2, username.trim().length);
    }

    props.setEnv(env);
    props.login(username, password, url[env]).then(() => {
      if (props.user.status === 401) {
        setLoading(false);
        setError('Wrong username or password');
      } else if (
        props.user.role !== 'ROLE_SURVEY_USER' &&
        props.user.role !== 'ROLE_SURVEY_TAKER' &&
        props.user.role !== 'ROLE_SURVEY_USER_ADMIN'
      ) {
        setLoading(false);
        setError('Wrong username or password');
      } else {
        setLoading(false);
        props.navigation.navigate('Loading');
      }
    });
  };
  const handleAppStateChange = (nextAppState) => setAppState(nextAppState);
  const isStorageSpaceEnough = async () => {
    const freeSpace = await RNFetchBlob.fs.df();

    return (
      Number(freeSpace.internal_free) > MINIMUM_REQUIRED_STORAGE_SPACE_500_MB
    );
  };
  const retryLogIn = () => setNotEnoughStorageSpace(false);
  const {t} = props;

  return (
    <View key={appState} style={globalStyles.container}>
      <ScrollView style={globalStyles.content}>
        {notEnoughStorageSpace && !error ? (
          <InternalStorageFullModal
            retryLogIn={retryLogIn}
            isOpen={!!notEnoughStorageSpace}
          />
        ) : (
          <View>
            <Image style={styles.logo} source={logo} />
            <Text style={globalStyles.h1}>{t('views.login.welcome')}</Text>
            <Text
              style={{
                ...globalStyles.h4,
                marginBottom: 64,
                color: colors.lightdark,
              }}>
              {t('views.login.letsGetStarted')}
            </Text>
            <View
              style={{
                width: '100%',
                maxWidth: 400,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text style={globalStyles.h5}>{t('views.login.username')}</Text>
            </View>
            <TextInput
              id="username"
              testID="username-input"
              autoCapitalize="none"
              style={{
                ...styles.input,
                borderColor: error ? colors.red : colors.palegreen,
              }}
              onChangeText={(username) => setFormDate({...formData, username})}
            />
            <View
              style={{
                width: '100%',
                maxWidth: 400,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
              <Text style={globalStyles.h5}>{t('views.login.password')}</Text>
            </View>

            <TextInput
              id="password"
              testID="password-input"
              secureTextEntry
              autoCapitalize="none"
              style={{
                ...styles.input,
                borderColor: error ? colors.red : colors.palegreen,
                marginBottom: error ? 0 : 25,
              }}
              onChangeText={(password) => setFormDate({...formData, password})}
            />
            {error ? (
              <Text
                id="error-message"
                style={{...globalStyles.tag, ...styles.error}}>
                {error}
              </Text>
            ) : (
              <View />
            )}
            {error2 ? (
              <Text
                id="error-message"
                style={{
                  ...globalStyles.tag,
                  ...styles.error,
                  marginTop: -6,
                }}>
                {error2}
              </Text>
            ) : (
              <View />
            )}
            {loading ? (
              <Button
                style={{
                  maxWidth: 400,
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                id="login-button"
                handleClick={() => onLogin()}
                text={t('views.login.loggingIn')}
                disabled={true}
                colored
              />
            ) : (
              <Button
                style={{
                  maxWidth: 400,
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                id="login-button"
                testID="login-button"
                handleClick={() => onLogin()}
                text={t('views.login.buttonText')}
                colored
                disabled={error === 'No connection' ? true : false}
              />
            )}
            {nodeEnv.NODE_ENV === 'development' && (
              <View style={{marginTop: 20}}>
                <Text>Dev options</Text>
                <CheckBox
                  containerStyle={styles.checkbox}
                  onPress={() => checkDevOption('syncMaps')}
                  title="Sync maps?"
                  checked={devOptions.syncMaps}
                  textStyle={{fontWeight: 'normal'}}
                />
                <CheckBox
                  containerStyle={styles.checkbox}
                  onPress={() => checkDevOption('syncImages')}
                  title="Sync images?"
                  checked={devOptions.syncImages}
                  textStyle={{fontWeight: 'normal'}}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

Login.propTypes = {
  setEnv: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  setDimensions: PropTypes.func.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  navigation: PropTypes.object.isRequired,
  setDownloadMapsAndImages: PropTypes.func.isRequired,
  dimensions: PropTypes.object,
  user: PropTypes.object.isRequired,
  t: PropTypes.func,
};

const styles = StyleSheet.create({
  input: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 400,
    width: '100%',
    fontSize: 16,
    fontFamily: 'Roboto',
    borderWidth: 1,
    borderRadius: 2,
    height: 48,
    marginBottom: 25,
    padding: 15,
    paddingBottom: 12,
    color: colors.lightdark,
    backgroundColor: colors.white,
  },
  checkbox: {
    marginLeft: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  logo: {width: 42, height: 42, marginBottom: 8},
  error: {
    color: colors.red,
    lineHeight: 15,
    marginBottom: 10,
    marginLeft: 'auto',
    width: 400,
    marginTop: 10,
    marginRight: 'auto',
  },
});

const mapStateToProps = ({env, user, dimensions}) => ({
  env,
  user,
  dimensions,
});

const mapDispatchToProps = {
  setEnv,
  login,
  setDimensions,
  setDownloadMapsAndImages,
};

export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(Login),
);
