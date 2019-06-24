import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import DeviceInfo from 'react-native-device-info'
import {
  loadFamilies,
  loadSurveys,
  logout,
  setAppVersion,
  resetSyncState
} from '../redux/actions'
import Button from '../components/Button'
import colors from '../theme.json'
import globalStyles from '../globalStyles'
import { url } from '../config'
import { initImageCaching } from '../cache'

export class Loading extends Component {
  unsubscribeNetChange
  state = {
    syncingServerData: false, // know when to show that data is synced
    cachingImages: false,
    downloadingMap: false,
    maps: [],
    error: null
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
      !this.props.navigation.getParam('syncImages') ||
      (!!this.props.sync.images.total &&
        this.props.sync.images.total === this.props.sync.images.synced)
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
      this.checkOfflineMaps()
    } else {
      this.props.loadFamilies(url[this.props.env], this.props.user.token)
    }
  }

  isSurveyInSynced = title =>
    this.props.surveys.some(survey => survey.title && survey.title === title)

  downloadOfflineMapPack = (options, name) => {
    MapboxGL.offlineManager.getPack(name).then(async pack => {
      // if pack exists delete it and re-download it
      if (pack) {
        await MapboxGL.offlineManager.deletePack(name)
      }

      MapboxGL.offlineManager.createPack(
        {
          name,
          styleURL: MapboxGL.StyleURL.Street,
          ...options
        },
        this.onMapDownloadProgress,
        this.onMapDownloadError
      )
    })
  }

  checkOfflineMaps = () => {
    if (!this.props.navigation.getParam('syncMaps')) {
      this.handleImageCaching()
    }
    const mapsArray = []

    const surveysWithOfflineMaps = this.props.surveys.filter(
      survey => survey.surveyConfig.offlineMaps
    )

    if (
      surveysWithOfflineMaps ||
      this.isSurveyInSynced('Paraguay - Activate, FUPA')
    ) {
      if (surveysWithOfflineMaps) {
        surveysWithOfflineMaps.forEach(survey => {
          survey.surveyConfig.offlineMaps.forEach(map => {
            const options = {
              minZoom: 10,
              maxZoom: 13,
              bounds: [map.from, map.to]
            }
            mapsArray.push({ name: map.name, statue: 0, options })
          })
        })
      }

      // check for Cerrito pack
      if (this.isSurveyInSynced('Paraguay - Activate, FUPA')) {
        const options = {
          minZoom: 10,
          maxZoom: 13,
          bounds: [[-70.6626, -24.1093], [-69.7407, -22.7571]]
        }
        mapsArray.push({ name: 'Cerrito', statue: 0, options })
      }

      this.setState({ maps: mapsArray }, this.downloadMapData)
    } else {
      this.handleImageCaching()
    }

    this.setState({
      downloadingMap: true
    })
  }

  // update map download progress
  onMapDownloadProgress = (offlineRegion, offlineRegionStatus) => {
    const updatedMaps = this.state.maps

    updatedMaps.find(
      map => map.name === offlineRegionStatus.name
    ).status = Math.trunc(offlineRegionStatus.percentage)

    this.setState({
      maps: updatedMaps
    })
  }

  onMapDownloadError = () => {
    this.showError()
  }

  reload = () => {
    this.setState({
      error: null
    })
    this.checkState()
  }

  showError(msg) {
    this.setState({
      error: msg
    })
  }

  downloadMapData() {
    this.state.maps.forEach(map =>
      this.downloadOfflineMapPack(map.options, map.name)
    )
  }

  checkState() {
    // check connection state
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        this.showError('There seems to be a problem with your connetion.')
      }
    })

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

  componentDidMount() {
    this.unsubscribeNetChange = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        this.showError('There seems to be a problem with your connetion.')
      }
    })

    this.checkState()
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
      this.checkOfflineMaps()
    }

    if (
      this.props.surveys.length &&
      !this.props.offline.outbox.lenght &&
      this.state.downloadingMap &&
      this.state.maps.every(map => map.status === 100) &&
      !this.state.cachingImages
    ) {
      this.setState({ cachingImages: true })
      this.handleImageCaching()
    }

    // if everything is synced navigate to home
    if (
      !!this.props.sync.images.total &&
      prevProps.sync.images.total !== prevProps.sync.images.synced &&
      this.props.sync.images.total === this.props.sync.images.synced &&
      this.state.maps.every(map => map.status === 100)
    ) {
      this.props.navigation.navigate('DrawerStack')
    }
  }

  render() {
    const { sync, surveys, families } = this.props
    const {
      syncingServerData,
      cachingImages,
      downloadingMap,
      maps,
      error
    } = this.state

    return !error ? (
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
                <View style={styles.mapWrapper}>
                  {maps.map(map =>
                    map.status ? (
                      <Text
                        key={map.name}
                        style={
                          map.status === 100 ? { color: colors.palegreen } : {}
                        }
                      >
                        {`${map.name} map (${map.status}%)`}
                      </Text>
                    ) : null
                  )}
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
    ) : (
      <View style={[globalStyles.container, styles.view]}>
        <View style={styles.loadingContainer}>
          <CommunityIcon
            name="emoticon-sad-outline"
            color={colors.palered}
            size={60}
          />
          <Text style={[globalStyles.h1, { color: colors.palered }]}>Hmm…</Text>
          <Text style={[globalStyles.h2, { textAlign: 'center' }]}>
            {error}
          </Text>
          <Button
            outlined
            text="Retry"
            style={{ paddingHorizontal: 30, marginTop: 30 }}
            borderColor={colors.palered}
            handleClick={this.reload}
          />
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
  },
  mapWrapper: {
    alignItems: 'center',
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
