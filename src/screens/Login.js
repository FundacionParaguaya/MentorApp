import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  Image,
  StyleSheet,
  View,
  NetInfo,
  Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { setEnv, login, setDimensions } from '../redux/actions'
import logo from '../../assets/images/logo.png'
import { url } from '../config'
import globalStyles from '../globalStyles'
import colors from '../theme.json'
import Button from '../components/Button'

export class Login extends Component {
  state = {
    username: '',
    password: '',
    error: false,
    connection: false,
    loading: false
  }
  componentDidMount() {
    if (this.props.user.token) {
      this.props.navigation.navigate('Loading')
    } else {
      this.setDimensions()
      this.checkConnectivity().then(isConnected =>
        this.setConnectivityState(isConnected)
      )
      this.onConnectivityChange()
    }
  }

  checkConnectivity = () => NetInfo.isConnected.fetch()

  setConnectivityState = isConnected =>
    isConnected
      ? this.setState({ connection: true })
      : this.setState({ connection: false, error: 'No connection' })

  onConnectivityChange = () => {
    NetInfo.addEventListener('connectionChange', () =>
      this.setState({
        connection: !this.state.connection,
        error: this.state.connection ? 'No connection' : false
      })
    )
  }

  setDimensions = () => {
    this.props.setDimensions({
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      scale: Dimensions.get('window').scale
    })
  }

  onLogin = () => {
    const env = this.state.username.trim() === 'demo' ? 'demo' : 'production'

    this.props.setEnv(env)

    this.setState({
      loading: true
    })

    this.props
      .login(this.state.username.trim(), this.state.password, url[env])
      .then(() => {
        if (this.props.user.status === 401) {
          this.setState({
            loading: false
          })
          this.setState({ error: 'Wrong username or password' })
        } else {
          this.setState({
            loading: false,
            error: false
          })
          this.props.navigation.navigate('Loading')
        }
      })
  }

  render() {
    return (
      <View style={globalStyles.container}>
        <ScrollView style={globalStyles.content}>
          <Image style={styles.logo} source={logo} />
          <Text style={globalStyles.h1}>Welcome back!</Text>
          <Text
            style={{
              ...globalStyles.h4,
              marginBottom: 64,
              color: colors.lightdark
            }}
          >
            Let&lsquo;s get started...
          </Text>
          <Text style={globalStyles.h5}>USERNAME</Text>
          <TextInput
            id="username"
            autoCapitalize="none"
            style={{
              ...styles.input,
              borderColor: this.state.error ? colors.red : colors.palegreen
            }}
            onChangeText={username => this.setState({ username })}
          />
          <Text style={globalStyles.h5}>PASSWORD</Text>
          <TextInput
            id="password"
            secureTextEntry
            autoCapitalize="none"
            style={{
              ...styles.input,
              borderColor: this.state.error ? colors.red : colors.palegreen,
              marginBottom: this.state.error ? 0 : 25
            }}
            onChangeText={password => this.setState({ password })}
          />
          {this.state.error ? (
            <Text
              id="error-message"
              style={{ ...globalStyles.tag, ...styles.error }}
            >
              {this.state.error}
            </Text>
          ) : (
            <View />
          )}
          {this.state.loading ? (
            <ActivityIndicator />
          ) : (
            <Button
              id="login-button"
              handleClick={() => this.onLogin()}
              text="Login"
              colored
              disabled={this.state.error === 'No connection' ? true : false}
            />
          )}
        </ScrollView>
      </View>
    )
  }
}

Login.propTypes = {
  setEnv: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  setDimensions: PropTypes.func.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  navigation: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    fontFamily: 'Roboto',
    borderWidth: 1,
    borderRadius: 2,
    height: 48,
    marginBottom: 25,
    padding: 15,
    color: colors.lightdark,
    backgroundColor: colors.white
  },
  logo: { width: 42, height: 42, marginBottom: 8 },
  error: { color: colors.red, lineHeight: 15, marginBottom: 10 }
})

const mapStateToProps = ({ env, user }) => ({
  env,
  user
})

const mapDispatchToProps = {
  setEnv,
  login,
  setDimensions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
