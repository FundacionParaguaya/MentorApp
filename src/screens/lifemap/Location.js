import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableHighlight,
  NetInfo
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import MapboxGL from '@mapbox/react-native-mapbox-gl'
import StickyFooter from '../../components/StickyFooter'
import { addSurveyData, addDraftProgress } from '../../redux/actions'
import TextInput from '../../components/TextInput'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import SearchBar from '../../components/SearchBar'
import Select from '../../components/Select'
import marker from '../../../assets/images/marker.png'
import center from '../../../assets/images/centerMap.png'
import happy from '../../../assets/images/happy.png'
import sad from '../../../assets/images/sad.png'
import { getDraft } from './helpers'

export class Location extends Component {
  state = {
    showErrors: false,
    latitude: null,
    longitude: null,
    accuracy: null,
    searchAddress: '',
    showSearch: true,
    errorsDetected: [],
    centeringMap: false, // while map is centering we show a different spinner
    loading: true,
    showForm: false
  }

  errorsDetected = []
  locationCheckTimer

  detectError = (error, field) => {
    if (error && !this.errorsDetected.includes(field)) {
      this.errorsDetected.push(field)
    } else if (!error) {
      this.errorsDetected = this.errorsDetected.filter(item => item !== field)
    }

    this.setState({
      errorsDetected: this.errorsDetected
    })
  }

  addSurveyData = (text, field) => {
    this.props.addSurveyData(this.props.nav.draftId, 'familyData', {
      [field]: text
    })
  }
  getFieldValue = (draft, field) => {
    if (!draft) {
      return
    }
    return draft.familyData[field]
  }

  searcForAddress = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.searchAddress.replace(
        ' ',
        '+'
      )}&key=AIzaSyBLGYYy86_7QPT-dKgUnFMIJyhUE6AGVwM`
    )
      .then(r =>
        r
          .json()
          .then(res =>
            this.setState({
              latitude: res.results[0].geometry.location.lat,
              longitude: res.results[0].geometry.location.lng
            })
          )
          .catch()
      )
      .catch()
  }
  onDragMap = region => {
    const { coordinates } = region.geometry
    const longitude = coordinates[0]
    const latitude = coordinates[1]

    // prevent jumping of the marker by updating only when the region changes
    if (
      this.state.latitude !== latitude ||
      this.state.longitude !== longitude
    ) {
      this.setState({
        accuracy: 0
      })
      this.addSurveyData(latitude, 'latitude')
      this.addSurveyData(longitude, 'longitude')
      this.addSurveyData(0, 'accuracy')
    }
  }

  // if the user has draged the map and the draft has stored some coordinates
  setCoordinatesFromDraft = (isOnline, draft) => {
    const { survey } = this.props.nav

    this.setState({
      latitude: parseFloat(this.getFieldValue(draft, 'latitude')),
      longitude: parseFloat(this.getFieldValue(draft, 'longitude')),
      accuracy: parseFloat(this.getFieldValue(draft, 'accuracy')),
      loading: false,
      centeringMap: false
    })

    if (!isOnline) {
      if (survey.title === 'Chile - Geco') {
        this.setState({
          showSearch: false
        })
      } else {
        this.setState({
          showForm: true
        })
      }
    }
  }

  // try getting device location and set map state according to online state
  getDeviceCoordinates = isOnline => {
    const { survey } = this.props.nav

    if (isOnline) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            loading: false,
            centeringMap: false,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          this.addSurveyData(position.coords.latitude, 'latitude')
          this.addSurveyData(position.coords.longitude, 'longitude')
          this.addSurveyData(position.coords.accuracy, 'accuracy')
        },
        () => {
          const position = survey.surveyConfig.surveyLocation
          this.setState({
            loading: false,
            centeringMap: false,
            latitude: position.latitude,
            longitude: position.longitude,
            accuracy: 0
          })
          this.addSurveyData(position.latitude, 'latitude')
          this.addSurveyData(position.longitude, 'longitude')
          this.addSurveyData(0, 'accuracy')
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      if (survey.title === 'Chile - Geco') {
        const position = survey.surveyConfig.surveyLocation
        this.setState({
          showSearch: false,
          loading: false,
          centeringMap: false,
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: 0
        })
        this.addSurveyData(position.latitude, 'latitude')
        this.addSurveyData(position.longitude, 'longitude')
        this.addSurveyData(0, 'accuracy')
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.setState({
              loading: false,
              centeringMap: false,
              showForm: true,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
            this.addSurveyData(position.coords.latitude, 'latitude')
            this.addSurveyData(position.coords.longitude, 'longitude')
            this.addSurveyData(position.coords.accuracy, 'accuracy')
          },
          () => {
            this.setState({
              loading: false,
              centeringMap: false,
              showForm: true
            })
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0
          }
        )
      }
    }
  }

  componentDidMount() {
    const draft = this.props.navigation.getParam('family') || getDraft()

    // the there is no save country in the draft, set it to the survey one
    if (!this.getFieldValue(draft, 'country')) {
      this.addSurveyData(
        this.props.nav.survey.surveyConfig.surveyLocation.country,
        'country'
      )
    }

    // monitor for connection changes
    NetInfo.addEventListener('connectionChange', conncection => {
      if (!this.getFieldValue(draft, 'latitude')) {
        this.getDeviceCoordinates(conncection.type === 'none' ? false : true)
      }
    })

    // check if online first
    NetInfo.isConnected.fetch().then(isOnline => {
      if (!this.getFieldValue(draft, 'latitude')) {
        this.getDeviceCoordinates(isOnline)
      } else {
        this.setCoordinatesFromDraft(isOnline, draft)
      }
    })

    this.props.addDraftProgress(draft.draftId, {
      screen: 'Location'
    })

    if (!this.props.nav.readonly) {
      this.props.navigation.setParams({
        onPressBack: this.onPressBack
      })
    }
  }

  onPressBack = () => {
    const { draftId } = this.props.nav
    const draft = getDraft()

    this.props.addDraftProgress(draftId, {
      current: draft.progress.current - 1
    })

    if (draft.familyData.familyMembersList.length > 1) {
      this.props.navigation.navigate('FamilyMembersNames')
    } else {
      this.props.navigation.navigate('FamilyParticipant', {
        draftId
      })
    }
  }

  shouldComponentUpdate() {
    if (!this.props.navigation.isFocused()) {
      clearTimeout(this.locationCheckTimer)
      this.locationCheckTimer = null
    }
    return this.props.navigation.isFocused()
  }

  handleClick = () => {
    if (this.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      const draft = getDraft()

      this.props.addDraftProgress(this.props.nav.draftId, {
        current: draft.progress.current + 1
      })

      this.props.navigation.replace('SocioEconomicQuestion')
    }
  }
  render() {
    const { t } = this.props
    const { survey, readonly } = this.props.nav

    const {
      latitude,
      longitude,
      accuracy,
      searchAddress,
      centeringMap,
      loading,
      showErrors,
      showSearch,
      showForm
    } = this.state

    const draft = this.props.navigation.getParam('family') || getDraft()

    if (loading) {
      return (
        <View style={[globalStyles.container, styles.placeholder]}>
          <ActivityIndicator
            style={styles.spinner}
            size={80}
            color={colors.palered}
          />
          {!readonly && (
            <Text style={globalStyles.h2}>
              {t('views.family.gettingYourLocation')}
            </Text>
          )}
        </View>
      )
    } else if (!showForm) {
      return (
        <StickyFooter
          handleClick={this.handleClick}
          readonly={readonly}
          continueLabel={t('general.continue')}
          progress={
            !readonly && draft
              ? draft.progress.current / draft.progress.total
              : 0
          }
          fullHeight
        >
          <View pointerEvents="none" style={styles.fakeMarker}>
            <Image source={marker} />
          </View>
          {!readonly && showSearch && (
            <SearchBar
              id="searchAddress"
              style={styles.search}
              placeholder={t('views.family.searchByStreetOrPostalCode')}
              onChangeText={searchAddress => this.setState({ searchAddress })}
              onSubmit={this.searcForAddress}
              value={searchAddress}
            />
          )}
          <MapboxGL.MapView
            centerCoordinate={[longitude, latitude]}
            zoomLevel={15}
            style={{ width: '100%', flexGrow: 2 }}
            logoEnabled={false}
            zoomEnabled={!readonly}
            rotateEnabled={false}
            scrollEnabled={!readonly}
            pitchEnabled={false}
            onRegionDidChange={this.onDragMap}
            minZoomLevel={10}
            maxZoomLevel={15}
          />
          {!readonly && (
            <View>
              {centeringMap ? (
                <ActivityIndicator
                  style={styles.center}
                  size="small"
                  color={colors.palegreen}
                />
              ) : (
                <TouchableHighlight
                  id="centerMap"
                  underlayColor={'transparent'}
                  activeOpacity={1}
                  style={styles.center}
                  onPress={this.getDeviceCoordinates}
                >
                  <Image source={center} style={{ width: 21, height: 21 }} />
                </TouchableHighlight>
              )}
            </View>
          )}
        </StickyFooter>
      )
    } else {
      return readonly ? (
        <View
          style={[
            globalStyles.background,
            {
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center'
            }
          ]}
        >
          <Text style={[globalStyles.h2, { textAlign: 'center' }]}>
            {t('views.family.mapUnavailavleOffline')}
          </Text>
        </View>
      ) : (
        <StickyFooter
          handleClick={this.handleClick}
          readonly={readonly}
          continueLabel={t('general.continue')}
          progress={
            !readonly && draft
              ? draft.progress.current / draft.progress.total
              : 0
          }
        >
          {latitude ? (
            <View style={[styles.placeholder, styles.map]}>
              <Image
                source={happy}
                style={{ width: 50, height: 50, marginBottom: 20 }}
              />
              <Text style={[globalStyles.h2, { marginBottom: 20 }]}>
                {t('views.family.weFoundYou')}
              </Text>
              <Text style={[globalStyles.h3, { textAlign: 'center' }]}>
                lat: {latitude}, long: {longitude}
              </Text>
              <Text style={[globalStyles.h4, { marginBottom: 20 }]}>
                {`${t('views.family.gpsAccurate').replace(
                  '%n',
                  Math.round(accuracy)
                )}`}
              </Text>
              <Text style={[globalStyles.h3, { textAlign: 'center' }]}>
                {t('views.family.tellUsMore')}
              </Text>
            </View>
          ) : (
            <View style={[styles.placeholder, styles.map]}>
              <Image
                source={sad}
                style={{ width: 50, height: 50, marginBottom: 20 }}
              />
              <Text style={[globalStyles.h2, { marginBottom: 20 }]}>
                {t('views.family.weCannotLocate')}
              </Text>
              <Text style={[globalStyles.h3, { textAlign: 'center' }]}>
                {t('views.family.tellUsMore')}
              </Text>
            </View>
          )}
          <Select
            id="countrySelect"
            required
            showErrors={showErrors}
            onChange={this.addSurveyData}
            label={t('views.family.country')}
            countrySelect
            placeholder={
              readonly
                ? t('views.family.country')
                : t('views.family.selectACountry')
            }
            field="country"
            value={
              this.getFieldValue(draft, 'country') ||
              survey.surveyConfig.surveyLocation.country
            }
            detectError={this.detectError}
            country={survey.surveyConfig.surveyLocation.country}
            readonly={readonly}
          />
          <TextInput
            id="postCode"
            onChangeText={this.addSurveyData}
            field="postCode"
            value={this.getFieldValue(draft, 'postCode') || ''}
            placeholder={t('views.family.postcode')}
            detectError={this.detectError}
            readonly={readonly}
          />
          <TextInput
            id="address"
            onChangeText={this.addSurveyData}
            field="address"
            value={this.getFieldValue(draft, 'address') || ''}
            placeholder={t('views.family.streetOrHouseDescription')}
            validation="long-string"
            detectError={this.detectError}
            readonly={readonly}
            multiline
          />
        </StickyFooter>
      )
    }
  }
}

Location.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  addSurveyData: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addSurveyData,
  addDraftProgress
}

const mapStateToProps = ({ nav }) => ({
  nav
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Location)
)

const styles = StyleSheet.create({
  map: {
    height: 300,
    width: '100%'
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  fakeMarker: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 10, //raise the marker so it's point, not center, marks the location
    justifyContent: 'center',
    alignItems: 'center'
  },
  search: {
    zIndex: 2,
    position: 'absolute',
    top: 7.5,
    right: 7.5,
    left: 7.5
  },
  center: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 54,
    height: 54,
    bottom: 25,
    right: 15,
    backgroundColor: colors.white,
    borderRadius: 54,
    borderWidth: 1,
    borderColor: colors.palegreen
  },
  spinner: {
    marginBottom: 15
  }
})
