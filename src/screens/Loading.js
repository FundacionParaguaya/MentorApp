import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { loadFamilies, loadSurveys, logout } from '../redux/actions'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import { url } from '../config'
import { initImageCaching } from '../cache'

export class Loading extends Component {
  state = {
    syncingServerData: false, // know when to show that data is synced
    cachingImages: false, // know when image caching is running
    downloadingMap: false,
    offlineRegionStatus: null,
    mapDownloadError: null
  }

  syncSurveys = () => {
    // mark that loading has stated to show the progress
    this.setState({
      syncingServerData: true
    })

    // if surveys are synced skip to syncing families
    if (this.props.sync.surveys) {
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
      initImageCaching()
    }
  }

  syncFamilies = () => {
    // if families are synced skip to caching images
    if (this.props.sync.families) {
      this.handleImageCaching()
    } else {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
    }
  }

  downloadMapData = () => {
    this.setState({
      dataCached: true,
      downloadingMap: true
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

  // async componentDidMount() {
  //   // only when user is loging out clear the data
  //   if (this.props.sync.synced === 'logout') {
  //     // delete the cached map packs
  //     if (MapboxGL.offlineManager) {
  //       await MapboxGL.offlineManager.deletePack('Sofia')
  //       await MapboxGL.offlineManager.deletePack('Cerrito')
  //     }
  //
  //     // clear the async storage and reset the store
  //     AsyncStorage.clear(() => {
  //       this.props.logout()
  //       this.props.setSyncedState('login')
  //     })
  //   } else if (this.props.user.token) {
  //     this.setSyncedState()
  //   }
  // }

  componentDidMount() {
    // if user has logged in initiate sync
    if (this.props.user.token) {
      this.syncSurveys()
    } else {
      this.props.navigation.navigate('Login')
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

    // start caching indicator images once families are synced
    if (!prevProps.sync.surveys && this.props.sync.surveys) {
      this.handleImageCaching()
    }

    // if everything is synced navigate to drawer stack
    if (
      !!this.props.sync.images.total &&
      this.props.sync.images.total === this.props.sync.images.synced
    ) {
      this.props.navigation.navigate('DrawerStack')
    }
  }

  // componentDidUpdate() {
  //   if (
  //     this.props.surveys.length &&
  //     !this.props.offline.outbox.lenght &&
  //     !this.state.cachingImages &&
  //     !this.state.downloadingMap
  //   ) {
  //     setTimeout(() => {
  //       this.downloadMapData()
  //     }, 1000)
  //   }
  //
  //   // if map is cached start image caching
  //   if (
  //     this.props.surveys.length &&
  //     !this.props.offline.outbox.lenght &&
  //     this.state.offlineRegionStatus &&
  //     this.state.offlineRegionStatus.percentage === 100 &&
  //     !this.state.cachingImages
  //   ) {
  //     this.setState({
  //       cachingImages: true
  //     })
  //     setTimeout(() => {
  //       this.handleImageCaching()
  //     }, 1000)
  //   }
  //
  //   if (
  //     this.state.offlineRegionStatus &&
  //     this.state.offlineRegionStatus.percentage === 100 &&
  //     this.state.cachingImages &&
  //     !!this.props.sync.images.total &&
  //     this.props.sync.images.total === this.props.sync.images.synced
  //   ) {
  //     setTimeout(() => {
  //       this.props.setSyncedState('yes')
  //     }, 1000)
  //   }
  // }

  render() {
    const { sync, surveys, families } = this.props
    const { syncingServerData, cachingImages, offlineRegionStatus } = this.state

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
            <View style={styles.sync}>
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

              {sync.families && (
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
        </View>
      </View>
    )
  }
}

Loading.propTypes = {
  loadFamilies: PropTypes.func.isRequired,
  loadSurveys: PropTypes.func.isRequired,
  logout: PropTypes.func,
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
  logout
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading)
