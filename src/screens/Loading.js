import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import {
  loadFamilies,
  loadSnapshots,
  loadSurveys,
  setSyncedState
} from '../redux/actions'
import { getHydrationState } from '../redux/store'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import { url } from '../config'
import { initImageCaching } from '../cache'

export class Loading extends Component {
  checkHydrationTimer
  state = {
    loadingData: false, // know when to show that data is synced
    querriesAreMade: false, // know when actual querries are made, not the same as above
    cachingImages: false
  }
  clearTimers = () => {
    clearTimeout(this.checkHydrationTimer)
    this.checkHydrationTimer = null
  }
  loadData = () => {
    this.setState({
      loadingData: true
    })
    this.props.loadSurveys(url[this.props.env], this.props.user.token)
    this.setState({
      querriesAreMade: true
    })
  }
  checkHydration = () => {
    if (getHydrationState() === false) {
      this.checkHydrationTimer = setTimeout(() => {
        this.checkHydration()
      }, 1000)
    } else {
      this.clearTimers()
      if (!this.props.user.token) {
        this.props.setSyncedState('login')
      } else {
        this.props.setSyncedState('no')
        this.loadData()
      }
    }
  }
  componentDidMount() {
    this.checkHydration()
  }

  componentDidUpdate() {
    const { total, synced } = this.props.sync.images

    if (
      this.state.querriesAreMade &&
      !this.props.offline.outbox.lenght &&
      !this.state.cachingImages
    ) {
      this.setState({
        cachingImages: true
      })
      setTimeout(() => {
        initImageCaching()
      }, 1000)
    }

    if (this.state.cachingImages && total && total === synced) {
      this.props.setSyncedState('yes')
    }
  }

  componentWillUnmount = () => {
    this.clearTimers()
  }

  render() {
    const { sync, surveys } = this.props

    return (
      <View style={[globalStyles.container, styles.view]}>
        <View style={styles.loadingContainer}>
          <Text style={globalStyles.h3}>We are preparing the app …</Text>
          <ActivityIndicator
            size={Platform.OS === 'android' ? 60 : 'large'}
            color={colors.palered}
            style={styles.indicator}
          />

          <Text style={globalStyles.h3}>Yes!</Text>
          <Text style={globalStyles.subline}>
            We will be ready soon.
            {/* {this.props.time === 'ok'
              ? 'We will be ready soon.'
            : 'This might take a while...'} */}
          </Text>
          {this.state.loadingData ? (
            <View style={styles.sync}>
              <Text>
                Syncing surveys: {surveys.length} / {surveys.length}
              </Text>
              <Text>
                Syncinc survey images: {sync.images.synced} /{' '}
                {sync.images.total}
              </Text>
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    )
  }
}

Loading.propTypes = {
  loadFamilies: PropTypes.func.isRequired,
  loadSurveys: PropTypes.func.isRequired,
  loadSnapshots: PropTypes.func.isRequired,
  setSyncedState: PropTypes.func.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  sync: PropTypes.object.isRequired,
  surveys: PropTypes.array.isRequired,
  offline: PropTypes.object
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicator: {
    backgroundColor: colors.white,
    borderRadius: 85,
    padding: 55,
    marginTop: 22,
    marginBottom: 45
  },
  sync: {
    marginTop: 10,
    alignItems: 'center'
  }
})

const mapStateToProps = ({ sync, surveys, env, user, offline }) => ({
  sync,
  surveys,
  env,
  user,
  offline
})

const mapDispatchToProps = {
  loadFamilies,
  loadSnapshots,
  loadSurveys,
  setSyncedState
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
