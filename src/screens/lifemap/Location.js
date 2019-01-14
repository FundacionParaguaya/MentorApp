import React, { Component } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  NetInfo
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MapView from 'react-native-maps'
import { withNamespaces } from 'react-i18next'

import { addSurveyData, addDraftProgress } from '../../redux/actions'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import SearchBar from '../../components/SearchBar'
import Select from '../../components/Select'
import marker from '../../../assets/images/marker.png'
import center from '../../../assets/images/centerMap.png'

export class Location extends Component {
  state = {
    latitude: null,
    longitude: null,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
    accuracy: null,
    searchAddress: '',
    errorsDetected: [],
    mapsError: false, // error code (2 for location off, 3 for timeout)
    centeringMap: false, // while map is centering we show a different spinner
    isOnline: true,
    showMap: false // show map even when no location is returned
  }

  mapIsDraggable = false
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')

  errorsDetected = []
  locationCheckTimer
  constructor(props) {
    super(props)
    NetInfo.isConnected.fetch().then(isConnected =>
      this.setState({
        isOnline: isConnected
      })
    )
  }

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
    this.props.addSurveyData(this.draftId, 'familyData', {
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
          showMap: true,
          centeringMap: false,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
        this.addSurveyData(position.coords.latitude, 'latitude')
        this.addSurveyData(position.coords.longitude, 'longitude')
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
          const draft = this.getDraft()

          if (!this.getFieldValue(draft, 'latitude')) {
            if (this.survey.surveyConfig.surveyLocation.latitude) {
              this.setState({
                showMap: true,
                latitude: this.survey.surveyConfig.surveyLocation.latitude,
                longitude: this.survey.surveyConfig.surveyLocation.longitude,
                latitudeDelta: 1,
                longitudeDelta: 1
              })
            } else {
              this.setState({
                showMap: true,
                latitude: 0,
                longitude: 0,
                latitudeDelta: 100,
                longitudeDelta: 100
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
    if (!this.mapIsDraggable) {
      this.mapIsDraggable = true
    } else {
      const { latitude, longitude } = region

      // prevent jumping of the marker
      if (
        this.state.latitude !== latitude ||
        this.state.longitude !== longitude
      ) {
        this.mapIsDraggable = false
        this.setState({
          latitude,
          longitude,
          accuracy: 0
        })
        this.addSurveyData(latitude, 'latitude')
        this.addSurveyData(longitude, 'longitude')
      }
    }
  }
  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  componentDidMount() {
    const draft = this.getDraft()

    if (!this.getFieldValue(draft, 'latitude')) {
      this.getDeviceLocation()
    } else {
      this.setState({
        latitude: this.getFieldValue(draft, 'latitude'),
        longitude: this.getFieldValue(draft, 'longitude'),
        showMap: true
      })
    }

    this.props.addDraftProgress(draft.draftId, {
      screen: 'Location'
    })

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    const draft = this.getDraft()
    if (draft.familyData.familyMembersList.length > 1) {
      this.props.navigation.navigate('FamilyMembersBirthdates', {
        draftId: this.draftId,
        survey: this.survey
      })
    } else
      this.props.navigation.navigate('FamilyMembersNames', {
        draftId: this.draftId,
        survey: this.survey
      })
  }

  shouldComponentUpdate() {
    if (!this.props.navigation.isFocused()) {
      clearTimeout(this.locationCheckTimer)
      this.locationCheckTimer = null
    }
    return this.props.navigation.isFocused()
  }

  handleClick = () => {
    this.addSurveyData(this.state.accuracy, 'accuracy')
    this.addSurveyData(this.state.latitude, 'latitude')
    this.addSurveyData(this.state.longitude, 'longitude')
    this.props.navigation.navigate('SocioEconomicQuestion', {
      draftId: this.draftId,
      survey: this.survey
    })
  }
  render() {
    const { t } = this.props
    const {
      mapsError,
      latitude,
      longitudeDelta,
      latitudeDelta,
      longitude,
      accuracy,
      searchAddress,
      centeringMap,
      isOnline,
      showMap
    } = this.state

    const draft = this.getDraft()

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
          <View>
            {isOnline ? (
              <View>
                {showMap ? (
                  <View>
                    <View pointerEvents="none" style={styles.fakeMarker}>
                      <Image source={marker} />
                    </View>
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
                    <MapView
                      ref={ref => {
                        this.map = ref
                      }}
                      style={styles.map}
                      initialRegion={{
                        latitude,
                        longitude,
                        latitudeDelta,
                        longitudeDelta
                      }}
                      region={{
                        latitude,
                        longitude,
                        latitudeDelta,
                        longitudeDelta
                      }}
                      onRegionChangeComplete={this.onDragMap}
                    />
                    {centeringMap ? (
                      <ActivityIndicator
                        style={styles.center}
                        size={54}
                        color={colors.palegreen}
                      />
                    ) : (
                      <TouchableOpacity
                        id="centerMap"
                        style={styles.center}
                        onPress={this.getDeviceLocation}
                      >
                        <Image
                          source={center}
                          style={{ width: 21, height: 21 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View style={[styles.placeholder, styles.map]}>
                    <ActivityIndicator
                      style={styles.spinner}
                      size={80}
                      color={colors.palered}
                    />
                    {!mapsError ? (
                      <Text style={globalStyles.h2}>
                        {t('views.family.gettingYourLocation')}
                      </Text>
                    ) : (
                      <View>
                        <Text style={[globalStyles.h2, styles.centerText]}>
                          Hmmm!
                        </Text>
                        <Text style={[styles.errorMsg, styles.centerText]}>
                          {mapsError === 2
                            ? t('views.family.somethingIsNotWorking')
                            : t('views.family.cannotFindLocation')}
                        </Text>
                        <Text style={[styles.errorSubMsg, styles.centerText]}>
                          {mapsError === 2
                            ? t('views.family.checkLocationServicesTurnedOn')
                            : t('views.family.giveDetailInTheFormBelow')}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.offlineMsg}>
                <Text>Map is not available while offline</Text>
              </View>
            )}
          </View>

          <View>
            <Text id="accuracy" style={styles.container}>
              {isOnline && accuracy
                ? `${t('views.family.gpsAccurate').replace(
                    '%n',
                    Math.round(accuracy)
                  )}`
                : ' '}
            </Text>
            <Select
              id="countrySelect"
              required
              onChange={this.addSurveyData}
              label={t('views.family.country')}
              countrySelect
              placeholder={t('views.family.selectACountry')}
              field="country"
              value={this.getFieldValue(draft, 'country') || ''}
              detectError={this.detectError}
              country={this.survey.surveyConfig.surveyLocation.country}
            />
            <TextInput
              id="postCode"
              onChangeText={this.addSurveyData}
              field="postCode"
              value={this.getFieldValue(draft, 'postCode') || ''}
              placeholder={t('views.family.postcode')}
              detectError={this.detectError}
            />
            <TextInput
              id="address"
              onChangeText={this.addSurveyData}
              field="address"
              value={this.getFieldValue(draft, 'address') || ''}
              placeholder={t('views.family.streetOrHouseDescription')}
              validation="long-string"
              detectError={this.detectError}
              multiline
            />
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Button
            id="continue"
            disabled={!!this.errorsDetected.length}
            colored
            text={t('general.continue')}
            handleClick={this.handleClick}
          />
        </View>
      </ScrollView>
    )
  }
}

Location.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  addSurveyData: PropTypes.func.isRequired,
  drafts: PropTypes.array,
  addDraftProgress: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addSurveyData,
  addDraftProgress
}

const mapStateToProps = ({ drafts }) => ({
  drafts
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
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    paddingHorizontal: 16
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
  },
  offlineMsg: {
    paddingTop: 20,
    alignItems: 'center'
  }
})
