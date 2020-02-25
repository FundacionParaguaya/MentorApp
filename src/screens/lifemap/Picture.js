import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import {
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'

import Button from '../../components/Button'
import Decoration from '../../components/decoration/Decoration'
import RoundImage from '../../components/RoundImage'
import StickyFooter from '../../components/StickyFooter'
import globalStyles from '../../globalStyles'
import { updateDraft } from '../../redux/actions'
import colors from '../../theme.json'
import { getTotalEconomicScreens } from './helpers'

let options = {
  storageOptions: { skipBackup: true, path: 'images', multiple: true }
}
export class Picture extends Component {
  state = {
    pictures: [],
    showCamera: false
  }

  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')

  // the draft is not mutated in this screen (only its progress),
  // we need it for progress bar
  draft = this.props.drafts.find(draft => draft.draftId === this.draftId)

  isEmpty = true

  onPressBack = () => {
    this.props.navigation.navigate('BeginLifemap', {
      survey: this.survey,
      draftId: this.draftId
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })

    this.setState({ pictures: this.draft.pictures })
  }

  openGallery = async function() {
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        this.setState({
          pictures: [
            ...this.state.pictures,
            {
              // content: 'data:image/jpeg;base64,' + response.data,
              name: response.fileName,
              type: response.type,
              source: response.uri
            }
          ]
        })

        let updatedDraft = this.draft
        let newArr = updatedDraft.pictures

        newArr.push({
          // content: 'data:image/jpeg;base64,' + response.data,
          source: response.uri,
          name: response.fileName,
          type: response.type
        })
        updatedDraft.pictures = newArr
        this.props.updateDraft(updatedDraft)
      }
    })
  }
  removePicture = function(elem) {
    //remove picture from state

    let newState = this.state.pictures.filter(e => e.name != elem.name)

    this.setState({ pictures: newState })

    //i use this weird method of updating the state on removal because it dosent update other way, i suppost this is because of the redux setup
    let updatedDraft = this.draft
    let newArr = updatedDraft.pictures
    newArr = this.state.pictures.filter(e => e.name != elem.name)
    updatedDraft.pictures = newArr
    this.props.updateDraft(updatedDraft)
    //remove picture from draft
  }

  onContinue = function() {
    let survey = this.props.navigation.getParam('survey')

    if (survey.surveyConfig.signSupport) {
      this.props.navigation.navigate('Signin', {
        step: 0,
        survey: survey,
        draftId: this.draftId
      })
    } else {
      this.props.navigation.navigate('Final', {
        fromBeginLifemap: true,
        survey: survey,
        draftId: this.draftId,
        draft: this.draft
      })
    }
  }

  takePicture = async function() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera(options, response => {
          if (response.didCancel) {
            console.log('User cancelled photo picker')
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error)
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton)
          } else {
            this.setState({
              pictures: [
                ...this.state.pictures,
                {
                  // content: 'data:image/jpeg;base64,' + response.data,
                  name: response.fileName,
                  type: response.type,
                  source: response.uri
                }
              ]
            })

            let updatedDraft = this.draft
            let newArr = updatedDraft.pictures

            newArr.push({
              // content: 'data:image/jpeg;base64,' + response.data,
              source: response.uri,
              name: response.fileName,
              type: response.type
            })
            updatedDraft.pictures = newArr
            this.props.updateDraft(updatedDraft)
          }
        })
      } else {
        alert('Location permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    const { t } = this.props

    return (
      <StickyFooter
        onContinue={() => this.onContinue(this.draft)}
        continueLabel={t('general.continue')}
        progress={
          ((this.draft.familyData.countFamilyMembers > 1 ? 4 : 3) +
            getTotalEconomicScreens(this.survey)) /
          this.draft.progress.total
        }
      >
        <View
          style={{
            ...globalStyles.container,
            padding: 0
          }}
        >
          <View style={styles.container}>
            <ScrollView
              style={styles.scrollViewStyle}
              contentContainerStyle={styles.contentContainer}
            >
              {this.state.pictures.length ? (
                <View style={styles.mainImageContent}>
                  {this.state.pictures.map(e => (
                    <View
                      key={e.name}
                      style={styles.imageContainer}
                      onPress={() => this.removePicture(e)}
                    >
                      <Image
                        key={e.content}
                        style={styles.picture}
                        source={{ uri: e.source }}
                      />
                      <Text style={styles.centerText}>
                        {t('views.pictures.uploadedPicture')}
                      </Text>
                      {/* <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{e.fileName}</Text>
                  </View> */}
                      <View style={styles.closeImageContainer}>
                        <Icon
                          style={styles.closeIconStyle}
                          onPress={() => this.removePicture(e)}
                          name="close"
                          size={20}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.ballsAndImageContainer}>
                  <Decoration variation="lifemap">
                    <RoundImage source="picture" />
                  </Decoration>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <Button
                  id="camera_alt"
                  style={styles.button}
                  handleClick={() => this.takePicture()}
                  outlined
                  text={t('views.pictures.takeAPicture')}
                />

                <TouchableHighlight
                  id="location-not-listed-above"
                  underlayColor={'transparent'}
                  onPress={() => this.openGallery()}
                >
                  {/* "pictures": {
      "uploadPictures": "Subir imágenes",
      "takeAPicture": "Tomar una foto",
      "orUploadFromGalery": "O subir de la galería",
      "uploadingImage": "Subiendo imagen..."
    }, */}

                  <Text style={styles.locationLink}>
                    {t('views.pictures.orUploadFromGalery')}
                  </Text>
                </TouchableHighlight>
              </View>
            </ScrollView>
          </View>
        </View>
      </StickyFooter>
    )
  }
}

const styles = StyleSheet.create({
  closeImageContainer: {
    backgroundColor: 'rgba(225, 80, 77, 0.3)',
    borderRadius: 50,
    height: 30,
    width: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeIconStyle: {
    color: colors.error,

    fontSize: 25
  },
  centerText: { fontSize: 20 },

  mainImageContent: {
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 20
  },
  ballsAndImageContainer: {
    marginTop: 25,
    marginBottom: 25
  },

  scrollViewStyle: {
    flex: 2
  },
  container: {
    flex: 2
  },
  picture: {
    width: 110,
    height: 110,
    borderRadius: 20
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  button: { width: '49%', alignSelf: 'center', marginTop: 20 },
  buttonContainer: {
    marginBottom: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center'
  },

  locationLink: {
    color: colors.green,
    textDecorationLine: 'underline',
    backgroundColor: 'transparent',
    marginTop: 35,
    fontSize: 17
  }
})

Picture.propTypes = {
  t: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired
}

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = ({ drafts }) => ({ drafts })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Picture)
)
