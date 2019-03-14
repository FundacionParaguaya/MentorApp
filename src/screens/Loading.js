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
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import { loadFamilies, loadSurveys, setSyncedState } from '../redux/actions'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import { url } from '../config'
import { initImageCaching } from '../cache'

export class Loading extends Component {
  state = {
    loadingData: false, // know when to show that data is synced
    cachingImages: false, // know when image caching is running
    offlineRegionStatus: null
  }

  loadData = () => {
    // mark that loading has stated to show the progress
    this.setState({
      loadingData: true
    })

    // get the data from the database and store it in redux
    this.props.loadFamilies(url[this.props.env], this.props.user.token)
    this.props.loadSurveys(url[this.props.env], this.props.user.token)
  }

  setSyncedState = () => {
    // if the user has no token redirect to the login page
    if (!this.props.user.token) {
      this.props.setSyncedState('login')
    } else {
      // otherwise sync the data
      this.props.setSyncedState('no')
      this.loadData()
    }
  }

  onMapDownloadProgress(offlineRegionStatus) {
    console.log('sasdfas')
    this.setState({
      offlineRegionStatus
    })
  }

  async componentDidUpdate(prevProps) {
    // if store is hydrated
    if (!prevProps.hydration && this.props.hydration) {
      this.setSyncedState()
    }

    if (this.state.loadingData) {
      const options = {
        name: 'Sofia',
        styleURL: 'mapbox://...',
        minZoom: 14,
        maxZoom: 17,
        bounds: [[42.7159553, 23.2769621], [42.6754659, 23.3447338]]
      }

      // start download
      MapboxGL.offlineManager.createPack(options, this.onMapDownloadProgress)
    }

    const { total, synced } = this.props.sync.images

    // if all data is loaded, start image caching
    // if (
    //   this.props.surveys.length &&
    //   !this.props.offline.outbox.lenght &&
    //   !this.state.cachingImages
    // ) {
    //   this.setState({
    //     cachingImages: true
    //   })
    //   setTimeout(() => {
    //     initImageCaching()
    //   }, 1000)
    // }

    // after all images are cached redirect to dashboard
    if (this.state.cachingImages && total && total === synced) {
      this.props.setSyncedState('yes')
    }
  }

  render() {
    const { sync, surveys, families } = this.props
    const { offlineRegionStatus } = this.state

    console.log(surveys)

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
          <Text style={globalStyles.subline}>We will be ready soon.</Text>
          {this.state.loadingData ? (
            <View style={styles.sync}>
              <Text>
                Syncing families: {families.length} / {families.length}
              </Text>
              <Text>
                Syncing surveys: {surveys.length} / {surveys.length}
              </Text>
              <Text>
                Syncing survey images: {sync.images.synced} /{' '}
                {sync.images.total}
              </Text>
              {offlineRegionStatus && (
                <Text>
                  Downloading offline maps {offlineRegionStatus.percentage}
                </Text>
              )}
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
  setSyncedState: PropTypes.func.isRequired,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  sync: PropTypes.object.isRequired,
  surveys: PropTypes.array.isRequired,
  families: PropTypes.array.isRequired,
  offline: PropTypes.object.isRequired,
  hydration: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: colors.white,
    borderRadius: 85,
    marginBottom: 45,
    marginTop: 22,
    padding: 55
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  sync: {
    alignItems: 'center',
    marginTop: 10
  },
  view: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
})

const mapStateToProps = ({
  sync,
  surveys,
  env,
  user,
  offline,
  families,
  hydration
}) => ({
  sync,
  surveys,
  env,
  user,
  offline,
  families,
  hydration
})

const mapDispatchToProps = {
  loadFamilies,
  loadSurveys,
  setSyncedState
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
