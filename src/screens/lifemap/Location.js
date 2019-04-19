import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableHighlight
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

export class Location extends Component {
  state = {
    showErrors: false,
    latitude: null,
    longitude: null,
    accuracy: null,
    searchAddress: '',
    errorsDetected: [],
    mapsError: false, // error code (2 for location off, 3 for timeout)
    centeringMap: false, // while map is centering we show a different spinner
    showMap: false // show map even when no location is returned
  }

  readonly = !!this.props.navigation.getParam('family')
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

  getDeviceLocation = () => {
    this.setState({
      centeringMap: true
    })
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          mapsError: false,
          showMap: true,
          centeringMap: false,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
        this.addSurveyData(position.coords.latitude, 'latitude')
        this.addSurveyData(position.coords.longitude, 'longitude')
        this.addSurveyData(position.coords.accuracy, 'accuracy')
      },
      error => {
        // if error, try getting position after timeout
        if (error.code === 2) {
          this.setState({
            showMap: false
          })
          this.locationCheckTimer = setTimeout(() => {
            this.getDeviceLocation()
          }, 5000)
        } else {
          const { survey, draftId } = this.props.nav
          const draft = this.props.drafts.find(
            draft => draft.draftId === draftId
          )

          if (!this.getFieldValue(draft, 'latitude')) {
            if (survey.surveyConfig.surveyLocation.latitude) {
              this.setState({
                showMap: true,
                latitude: survey.surveyConfig.surveyLocation.latitude,
                longitude: survey.surveyConfig.surveyLocation.longitude
              })
            } else {
              this.setState({
                showMap: true,
                latitude: 0,
                longitude: 0
              })
            }
          }
        }

        this.setState({ centeringMap: false, mapsError: error.code })
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
      }
    )
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

  componentDidMount() {
    const draft = this.props.drafts.find(
      draft => draft.draftId === this.props.nav.draftId
    )

    if (!this.getFieldValue(draft, 'latitude')) {
      this.getDeviceLocation()
    } else {
      this.setState({
        latitude: parseFloat(this.getFieldValue(draft, 'latitude')),
        longitude: parseFloat(this.getFieldValue(draft, 'longitude')),
        accuracy: parseFloat(this.getFieldValue(draft, 'accuracy')),
        showMap: true
      })
    }

    this.props.addDraftProgress(draft.draftId, {
      screen: 'Location'
    })

    if (!this.readonly) {
      this.props.navigation.setParams({
        onPressBack: this.onPressBack
      })
    }
  }

  onPressBack = () => {
    const { draftId } = this.props.nav
    const draft = this.props.drafts.find(draft => draft.draftId === draftId)

    this.props.addDraftProgress(draftId, {
      current: draft.progress.current - 1
    })

    if (draft.familyData.familyMembersList.length > 1) {
      this.props.navigation.navigate('FamilyMembersNames')
    } else {
      this.props.navigation.navigate('FamilyParticipant', {
        draftId: this.props.nav.draftId
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
      const draft = this.props.drafts.find(
        draft => draft.draftId === this.props.nav.draftId
      )

      this.props.addDraftProgress(this.props.nav.draftId, {
        current: draft.progress.current + 1
      })

      this.props.navigation.replace('SocioEconomicQuestion')
    }
  }
  render() {
    const { t } = this.props
    const { survey } = this.props.nav

    const {
      mapsError,
      latitude,
      longitude,
      accuracy,
      searchAddress,
      centeringMap,
      showMap,
      showErrors
    } = this.state

    const draft = this.props.drafts.find(
      draft => draft.draftId === this.props.nav.draftId
    )

    return (
      <StickyFooter
        handleClick={this.handleClick}
        readonly={this.readonly}
        continueLabel={t('general.continue')}
        progress={
          !this.readonly && draft
            ? draft.progress.current / draft.progress.total
            : 0
        }
      >
        {(!this.readonly || (this.readonly && latitude)) && (
          <View>
            {showMap ? (
              <View>
                <View pointerEvents="none" style={styles.fakeMarker}>
                  <Image source={marker} />
                </View>
                {!this.readonly && (
                  <SearchBar
                    id="searchAddress"
                    style={styles.search}
                    placeholder={t('views.family.searchByStreetOrPostalCode')}
                    onChangeText={searchAddress =>
                      this.setState({ searchAddress })
                    }
                    onSubmit={this.searcForAddress}
                    value={searchAddress}
                  />
                )}
                <MapboxGL.MapView
                  centerCoordinate={[longitude, latitude]}
                  zoomLevel={15}
                  style={styles.map}
                  logoEnabled={false}
                  zoomEnabled={!this.readonly}
                  rotateEnabled={false}
                  scrollEnabled={!this.readonly}
                  pitchEnabled={false}
                  onRegionDidChange={this.onDragMap}
                  minZoomLevel={14}
                  maxZoomLevel={18}
                />
                {!this.readonly && (
                  <View>
                    {centeringMap ? (
                      <ActivityIndicator
                        style={styles.center}
                        size={54}
                        color={colors.palegreen}
                      />
                    ) : (
                      <TouchableHighlight
                        id="centerMap"
                        underlayColor={'transparent'}
                        activeOpacity={1}
                        style={styles.center}
                        onPress={this.getDeviceLocation}
                      >
                        <Image
                          source={center}
                          style={{ width: 21, height: 21 }}
                        />
                      </TouchableHighlight>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.placeholder, styles.map]}>
                {mapsError !== 3 && !latitude && (
                  <ActivityIndicator
                    style={styles.spinner}
                    size={80}
                    color={colors.palered}
                  />
                )}
                {!mapsError && !latitude ? (
                  <Text style={globalStyles.h2}>
                    {t('views.family.gettingYourLocation')}
                  </Text>
                ) : (
                  <View>
                    <Text style={[globalStyles.h2, styles.centerText]}>
                      Hmmm!
                    </Text>
                    <Text style={[styles.errorMsg, styles.centerText]}>
                      {mapsError === 2 &&
                        t('views.family.somethingIsNotWorking')}
                    </Text>
                    <Text style={[styles.errorSubMsg, styles.centerText]}>
                      {mapsError === 2 &&
                        t('views.family.checkLocationServicesTurnedOn')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        <View>
          <Text id="accuracy" style={styles.accuracy}>
            {accuracy
              ? `${t('views.family.gpsAccurate').replace(
                  '%n',
                  Math.round(accuracy)
                )}`
              : ' '}
          </Text>
          <Select
            id="countrySelect"
            required
            showErrors={showErrors}
            onChange={this.addSurveyData}
            label={t('views.family.country')}
            countrySelect
            placeholder={
              this.readonly
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
            readonly={this.readonly}
          />
          <TextInput
            id="postCode"
            onChangeText={this.addSurveyData}
            field="postCode"
            value={this.getFieldValue(draft, 'postCode') || ''}
            placeholder={t('views.family.postcode')}
            detectError={this.detectError}
            readonly={this.readonly}
          />
          <TextInput
            id="address"
            onChangeText={this.addSurveyData}
            field="address"
            value={this.getFieldValue(draft, 'address') || ''}
            placeholder={t('views.family.streetOrHouseDescription')}
            validation="long-string"
            detectError={this.detectError}
            readonly={this.readonly}
            multiline
          />
        </View>
      </StickyFooter>
    )
  }
}

Location.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  addSurveyData: PropTypes.func.isRequired,
  drafts: PropTypes.array,
  addDraftProgress: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addSurveyData,
  addDraftProgress
}

const mapStateToProps = ({ drafts, nav }) => ({
  drafts,
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
  accuracy: { marginLeft: 30 },
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
  },
  centerText: {
    textAlign: 'center'
  },
  errorMsg: {
    marginTop: 15,
    color: colors.palegrey
  },
  errorSubMsg: {
    marginTop: 20,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: colors.palered
  }
})
