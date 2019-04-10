import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {
  loadFamilies,
  loadSurveys,
  setSyncedState,
  logout
} from '../redux/actions'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import { url } from '../config'
import { initImageCaching } from '../cache'

export class Loading extends Component {
  state = {
    loadingData: false, // know when to show that data is synced
    cachingImages: false, // know when image caching is running
    offlineRegionStatus: null,
    mapDownloadError: null
  }

  loadData = () => {
    // mark that loading has stated to show the progress
    this.setState({
      loadingData: true
    })

    if (!this.props.surveys.length) {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
      this.props.loadSurveys(url[this.props.env], this.props.user.token)
    }
  }

  setSyncedState = () => {
    // if the user has no token redirect to the login page
    if (!this.props.user.token) {
      this.props.setSyncedState('login')
    } else if (this.props.user.token && !this.props.surveys.length) {
      // if no surveys in store sync the data
      this.props.setSyncedState('no')
      this.loadData()
    } else {
      this.props.setSyncedState('yes')
    }
  }

  handleImageCaching() {
    this.setState({
      cachingImages: true
    })

    initImageCaching()
  }

  downloadMapData = () => {
    this.setState({
      dataCached: true
    })

    // check for the Sofia pack and download it if it doesn't exist
    MapboxGL.offlineManager.getPack('Sofia').then(pack => {
      if (!pack) {
        MapboxGL.offlineManager.createPack(
          {
            name: 'Sofia',
            styleURL: MapboxGL.StyleURL.Street,
            minZoom: 14,
            maxZoom: 18,
            bounds: [[23.2769621, 42.7159553], [23.3447338, 42.6754659]]
          },
          this.onMapDownloadProgress,
          this.onMapDownloadError
        )
      } else {
        this.setState({
          offlineRegionStatus: { percentage: 100 }
        })
      }
    })

    // check for the Cerrito pack
    MapboxGL.offlineManager.getPack('Cerrito').then(pack => {
      if (!pack) {
        MapboxGL.offlineManager.createPack(
          {
            name: 'Cerrito',
            styleURL: MapboxGL.StyleURL.Street,
            minZoom: 14,
            maxZoom: 18,
            bounds: [[-57.606658, -24.92751], [-57.48788, -24.997528]]
          },
          this.onMapDownloadProgress,
          this.onMapDownloadError
        )
      } else {
        this.setState({
          offlineRegionStatus: { percentage: 100 }
        })
      }
    })
  }

  // update map download progress
  onMapDownloadProgress = (offlineRegion, offlineRegionStatus) => {
    // if there is no offlineRegionStatus in the state, reset the percentage
    if (!this.state.offlineRegionStatus) {
      this.setState({
        offlineRegionStatus: { percentage: 0 }
      })
    } else if (
      offlineRegionStatus.percentage > this.state.offlineRegionStatus.percentage
    ) {
      this.setState({
        offlineRegionStatus
      })
    }
  }

  onMapDownloadError = (offlineRegion, mapDownloadError) => {
    this.setState({
      mapDownloadError
    })
  }

  componentDidMount() {
    // only when user is loging out clear the data
    if (this.props.sync.synced === 'logout') {
      // delete the cached map packs
      if (MapboxGL.offlineManager) {
        MapboxGL.offlineManager.deletePack('Sofia')
        MapboxGL.offlineManager.deletePack('Cerrito')
      }

      // clear the async storage and reset the store
      AsyncStorage.clear(() => {
        this.props.logout()
        this.props.setSyncedState('login')
      })
    } else if (this.props.user.token) {
      this.setSyncedState()
    }
  }

  componentDidUpdate(prevProps) {
    // if store is hydrated
    if (!prevProps.hydration && this.props.hydration) {
      this.setSyncedState()
    }

    if (
      this.props.surveys.length &&
      !this.props.offline.outbox.lenght &&
      !this.state.cachingImages
    ) {
      setTimeout(() => {
        this.downloadMapData()
      }, 1000)
    }

    // if map is cached start image caching
    if (
      this.props.surveys.length &&
      !this.props.offline.outbox.lenght &&
      this.state.offlineRegionStatus &&
      this.state.offlineRegionStatus.percentage === 100 &&
      !this.state.cachingImages
    ) {
      this.setState({
        cachingImages: true
      })
      setTimeout(() => {
        this.handleImageCaching()
      }, 1000)
    }

    if (
      this.state.offlineRegionStatus &&
      this.state.offlineRegionStatus.percentage === 100 &&
      this.state.cachingImages &&
      !!this.props.sync.images.total &&
      this.props.sync.images.total === this.props.sync.images.synced
    ) {
      setTimeout(() => {
        this.props.setSyncedState('yes')
      }, 1000)
    }
  }

  render() {
    const { sync, surveys, families } = this.props
    const { loadingData, cachingImages, offlineRegionStatus } = this.state

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

          {loadingData && (
            <View style={styles.sync}>
              <View style={{ flexDirection: 'row' }}>
                {cachingImages && (
                  <Icon name="check" color={colors.palegreen} size={18} />
                )}
                <Text style={cachingImages ? { color: colors.palegreen } : {}}>
                  {cachingImages
                    ? ` ${families.length} Families Synced`
                    : 'Syncing families...'}
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                {cachingImages && (
                  <Icon name="check" color={colors.palegreen} size={18} />
                )}
                <Text style={cachingImages ? { color: colors.palegreen } : {}}>
                  {cachingImages
                    ? ` ${surveys.length} Surveys Synced`
                    : 'Syncing surveys...'}
                </Text>
              </View>
            </View>
          )}

          {offlineRegionStatus && (
            <View style={{ flexDirection: 'row' }}>
              {cachingImages && (
                <Icon name="check" color={colors.palegreen} size={18} />
              )}
              <Text style={cachingImages ? { color: colors.palegreen } : {}}>
                {' '}
                Downloading offline maps{' '}
                {offlineRegionStatus.percentage.toFixed(0)}%
              </Text>
            </View>
          )}

          {cachingImages && (
            <Text>
              Syncing survey images: {sync.images.synced} / {sync.images.total}
            </Text>
          )}
        </View>
      </View>
    )
  }
}

Loading.propTypes = {
  loadFamilies: PropTypes.func.isRequired,
  loadSurveys: PropTypes.func.isRequired,
  logout: PropTypes.func,
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
  setSyncedState,
  logout
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
