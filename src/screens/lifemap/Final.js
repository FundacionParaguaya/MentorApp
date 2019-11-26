import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import {
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import { connect } from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'

import Button from '../../components/Button'
import LifemapVisual from '../../components/LifemapVisual'
import RoundImage from '../../components/RoundImage'
import { url } from '../../config'
import globalStyles from '../../globalStyles'
import { submitDraft, updateDraft } from '../../redux/actions'
import { prepareDraftForSubmit } from '../utils/helpers'
import {
  buildPDFOptions,
  buildPrintOptions,
  getReportTitle
} from '../utils/pdfs'

export class Final extends Component {
  survey = this.props.navigation.getParam('survey')
  draft = this.props.navigation.getParam('draft')
  state = {
    loading: false,
    downloading: false,
    printing: false,
    sendingEmail: false
  }

  onPressBack = () => {
    this.props.navigation.replace('Priorities', {
      resumeDraft: false,
      draftId: this.draft.draftId,
      survey: this.survey
    })
  }

  saveDraft = () => {
    this.setState({
      loading: true
    })

    this.prepareDraftForSubmit()
  }

  prepareDraftForSubmit() {
    if (this.state.loading) {
      const draft = prepareDraftForSubmit(this.draft, this.survey)

      this.props.submitDraft(
        url[this.props.env],
        this.props.user.token,
        draft.draftId,
        draft
      )

      setTimeout(() => {
        this.props.navigation.popToTop()
        this.props.navigation.navigate('Dashboard')
      }, 500)
    } else {
      setTimeout(() => {
        this.prepareDraftForSubmit()
      }, 200)
    }
  }

  async exportPDF() {
    this.setState({ downloading: true })
    const permissionsGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permission to save file into the file storage',
        message:
          'The app needs access to your file storage so you can download the file',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (permissionsGranted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error()
    }

    try {
      const fileName = getReportTitle(this.draft)
      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.pdf`
      const pdfOptions = buildPDFOptions(
        this.draft,
        this.survey,
        this.props.lng || 'en',
        this.props.t
      )
      const pdf = await RNHTMLtoPDF.convert(pdfOptions)

      RNFetchBlob.fs
        .cp(pdf.filePath, filePath)
        .then(() =>
          RNFetchBlob.android.addCompleteDownload({
            title: `${fileName}.pdf`,
            description: 'Download complete',
            mime: 'application/pdf',
            path: filePath,
            showNotification: true
          })
        )
        .then(() =>
          RNFetchBlob.fs.scanFile([{ path: filePath, mime: 'application/pdf' }])
        )

      this.setState({ downloading: false, filePath: pdf.filePath })
    } catch (error) {
      alert(error)
    }
  }

  async print() {
    this.setState({ printing: true })
    const options = buildPrintOptions(
      this.draft,
      this.survey,
      this.props.lng || 'en',
      this.props.t
    )
    try {
      await RNPrint.print(options)
      this.setState({ printing: false })
    } catch (error) {
      alert(error)
    }
  }

  sendMailService(document, mail = 'vasildimitrovhristov@gmail.com') {
    const { user, env, lng } = this.props
    const formData = new FormData()

    formData.append('file', {
      ...document,
      name: 'lifemap.pdf',
      type: 'application/pdf'
    })

    // console.log('log me the incoming document ', document)
    // console.log('log me the form data ', formData)

    return fetch(`${url[env]}/api/lifemap/send?familyEmail=${mail}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'multipart/form-data',
        'X-locale': lng
      },
      data: formData
    })
  }

  async sendMailToUser(email) {
    this.setState({ sendingEmail: true })
    const permissionsGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permission to save file into the file storage',
        message:
          'The app needs access to your file storage so you can download the file',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    )

    if (permissionsGranted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error()
    }
    try {
      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/lifemap.pdf`
      const pdfOptions = buildPDFOptions(
        this.draft,
        this.survey,
        this.props.lng || 'en',
        this.props.t
      )
      const pdf = await RNHTMLtoPDF.convert(pdfOptions)

      RNFetchBlob.fs.cp(pdf.filePath, filePath).then(async () => {
        RNFetchBlob.fs.readFile(filePath, 'base64').then(async data => {
          const document = new File([data], 'lifemap.pdf', {
            type: 'application/pdf'
          })

          await this.sendMailService(document, email)
          // const mailSent = await this.sendMailService(document, email)

          //   .then(res => res.json())
          //   .then(obj => console.log('server obj : ', obj))
        })
      })
    } catch (err) {
      alert(err)
    }
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  componentDidMount() {
    this.props.updateDraft(this.draft)
    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  render() {
    const { t } = this.props
    // console.log('draft ', this.draft)
    const {
      familyData: { familyMembersList }
    } = this.draft

    const userEmail =
      !!familyMembersList &&
      familyMembersList.length &&
      familyMembersList.find(user => user.email)

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View
          style={{
            ...globalStyles.container
          }}
        >
          <Text style={{ ...globalStyles.h1, ...styles.text }}>
            {t('views.lifemap.great')}
          </Text>
          <Text
            style={{
              ...globalStyles.h3,
              ...styles.text,
              paddingBottom: 30
            }}
          >
            {t('views.lifemap.youHaveCompletedTheLifemap')}
          </Text>
          <RoundImage source="partner" />
          <LifemapVisual
            bigMargin
            questions={this.draft.indicatorSurveyDataList}
            questionsLength={this.survey.surveyStoplightQuestions.length}
            priorities={this.draft.priorities}
            achievements={this.draft.achievements}
          />
          <View style={styles.buttonBar}>
            {userEmail && (
              <Button
                id="email"
                style={{
                  width: '100%',
                  marginTop: 10
                }}
                handleClick={this.sendMailToUser.bind(this, userEmail.email)}
                icon="email"
                outlined
                text={t('general.sendEmail')}
                loading={this.state.sendingEmail}
              />
            )}
            <Button
              id="download"
              style={{ width: '49%', alignSelf: 'center', marginTop: 20 }}
              handleClick={this.exportPDF.bind(this)}
              icon="cloud-download"
              outlined
              text={t('general.download')}
              loading={this.state.downloading}
            />
            <Button
              id="print"
              style={{ width: '49%', alignSelf: 'center', marginTop: 20 }}
              handleClick={this.print.bind(this)}
              icon="print"
              outlined
              text={t('general.print')}
              loading={this.state.printing}
            />
          </View>
        </View>
        <View style={{ height: 50 }}>
          <Button
            id="save-draft"
            colored
            loading={this.state.loading}
            text={t('general.close')}
            handleClick={this.saveDraft}
          />
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  text: {
    textAlign: 'center'
  },
  buttonBar: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})

Final.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  updateDraft: PropTypes.func.isRequired,
  submitDraft: PropTypes.func.isRequired,
  env: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  lng: PropTypes.string.isRequired
}

const mapStateToProps = ({ env, user }) => ({
  env,
  user
})
const mapDispatchToProps = {
  submitDraft,
  updateDraft
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Final)
)
