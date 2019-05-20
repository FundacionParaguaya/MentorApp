import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DeviceInfo from 'react-native-device-info'
import {
  loadFamilies,
  loadSurveys,
  logout,
  setAppVersion,
  resetSyncState
} from '../redux/actions'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import { url } from '../config'
import { initImageCaching } from '../cache'

export class Loading extends Component {
  state = {
    syncingServerData: false, // know when to show that data is synced
    cachingImages: false,
    downloadingMap: false,
    offlineRegionStatus: null,
    mapDownloadError: null
  }

  syncSurveys = resync => {
    // mark that loading has stated to show the progress
    this.setState({
      syncingServerData: true
    })

    // if surveys are synced skip to syncing families
    if (!resync && this.props.sync.surveys) {
      this.syncFamilies()
    } else {
      this.props.loadSurveys(url[this.props.env], this.props.user.token)
    }
  }

  handleImageCaching = () => {
    if (
      !!this.props.sync.images.total &&
      this.props.sync.images.total === this.props.sync.images.synced
    ) {
      this.props.navigation.navigate('DrawerStack')
    } else {
      this.setState({
        cachingImages: true
      })
      initImageCaching()
    }
  }

  syncFamilies = () => {
    // if families are synced skip to caching images
    if (this.props.sync.families) {
      this.downloadMapData()
    } else {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
    }
  }

  isSurveyInSynced = title =>
    this.props.surveys.some(survey => survey.title && survey.title === title)

  downloadOfflineMapPack = (options, name) => {
    MapboxGL.offlineManager.getPack(name).then(pack => {
      if (!pack) {
        MapboxGL.offlineManager.createPack(
          {
            name,
            styleURL: MapboxGL.StyleURL.Street,
            ...options
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

  downloadMapData = () => {
    this.setState({
      downloadingMap: true
    })

    // download GECO map is that survey is in the synced ones
    if (
      this.isSurveyInSynced('Chile - Geco') ||
      this.isSurveyInSynced('Paraguay - Activate, FUPA')
    ) {
      // check for the GECO pack
      if (this.isSurveyInSynced('Chile - Geco')) {
        const options = {
          minZoom: 10,
          maxZoom: 13,
          bounds: [[-70.6626, -24.1093], [-69.7407, -22.7571]]
        }
        this.downloadOfflineMapPack(options, 'GECO')
      }

      // check for Cerrito pack
      if (this.isSurveyInSynced('Paraguay - Activate, FUPA')) {
        const options = {
          minZoom: 10,
          maxZoom: 13,
          bounds: [[-70.6626, -24.1093], [-69.7407, -22.7571]]
        }
        this.downloadOfflineMapPack(options, 'Cerrito')
      }
    } else {
      this.handleImageCaching()
    }
  }

  // update map download progress
  onMapDownloadProgress = (offlineRegion, offlineRegionStatus) => {
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
    const { families, surveys, images, appVersion } = this.props.sync

    if (!this.props.user.token) {
      // if user hasn't logged in, navigate to login
      this.props.navigation.navigate('Login')
    } else if (!appVersion || appVersion !== DeviceInfo.getVersion()) {
      // if there is no app version in store or version has changed
      // clear sync state and sync again
      this.props.resetSyncState()
      this.props.setAppVersion(DeviceInfo.getVersion())
      this.syncSurveys('re-sync')
    } else if (
      families &&
      surveys &&
      !!images.total &&
      images.total === images.synced
    ) {
      // if everything is synced navigate to Dashboard
      this.props.navigation.navigate('DrawerStack')
    } else {
      this.syncSurveys()
    }
  }

  componentDidUpdate(prevProps) {
    // if user logs in
    if (!prevProps.user.token && this.props.user.token) {
      this.syncSurveys()
    }

    // start syncing families once surveys are synced
    if (!prevProps.sync.surveys && this.props.sync.surveys) {
      this.syncFamilies()
    }

    // if families are synced check for map data
    if (!prevProps.sync.families && this.props.sync.families) {
      this.downloadMapData()
    }

    if (
      this.props.surveys.length &&
      !this.props.offline.outbox.lenght &&
      this.state.offlineRegionStatus &&
      this.state.offlineRegionStatus.percentage === 100 &&
      !this.state.cachingImages
    ) {
      this.setState({ cachingImages: true })
      setTimeout(() => {
        this.handleImageCaching()
      }, 1000)
    }

    // if everything is synced navigate to home
    if (
      !!this.props.sync.images.total &&
      prevProps.sync.images.total !== prevProps.sync.images.synced &&
      this.props.sync.images.total === this.props.sync.images.synced
    ) {
      this.props.navigation.navigate('DrawerStack')
    }
  }

  render() {
    const { sync, surveys, families } = this.props
    const {
      syncingServerData,
      offlineRegionStatus,
      cachingImages,
      downloadingMap
    } = this.state

    return (
      <View style={[globalStyles.container, styles.view]}>
        <View style={styles.loadingContainer}>
          <Text style={globalStyles.h3}>We are preparing the app …</Text>
          <ActivityIndicator
            size="large"
            color={colors.palered}
            style={styles.indicator}
          />

          <Text style={globalStyles.h3}>Yes!</Text>
          <Text style={globalStyles.subline}>We will be ready soon.</Text>

          {syncingServerData && (
            <View style={styles.sync} testID="syncing-surveys">
              <View style={{ flexDirection: 'row' }}>
                {sync.surveys && (
                  <Icon name="check" color={colors.palegreen} size={18} />
                )}
                <Text style={sync.surveys ? { color: colors.palegreen } : {}}>
                  {sync.surveys
                    ? ` ${surveys.length} Surveys Synced`
                    : 'Syncing surveys...'}
                </Text>
              </View>

              {sync.surveys && (
                <View style={{ flexDirection: 'row' }}>
                  {sync.families && (
                    <Icon name="check" color={colors.palegreen} size={18} />
                  )}
                  <Text
                    style={sync.families ? { color: colors.palegreen } : {}}
                  >
                    {sync.families
                      ? ` ${families.length} Families Synced`
                      : 'Syncing families...'}
                  </Text>
                </View>
              )}

              {downloadingMap && (
                <View style={{ flexDirection: 'row' }}>
                  {cachingImages && (
                    <Icon name="check" color={colors.palegreen} size={18} />
                  )}
                  <Text
                    style={cachingImages ? { color: colors.palegreen } : {}}
                  >
                    {offlineRegionStatus
                      ? `Downloading offline maps ${
                          cachingImages
                            ? 100
                            : offlineRegionStatus.percentage.toFixed(0)
                        } %`
                      : 'Checking for offline maps'}
                  </Text>
                </View>
              )}

              {cachingImages && (
                <Text>
                  {sync.images.synced && sync.images.total
                    ? `Syncing survey images: ${sync.images.synced} / ${
                        sync.images.total
                      }`
                    : 'Calculating total images to cache...'}
                </Text>
              )}
            </View>
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
  resetSyncState: PropTypes.func,
  setAppVersion: PropTypes.func,
  env: PropTypes.oneOf(['production', 'demo', 'testing', 'development']),
  user: PropTypes.object.isRequired,
  sync: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
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

export const mapStateToProps = ({
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
  logout,
  setAppVersion,
  resetSyncState
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
