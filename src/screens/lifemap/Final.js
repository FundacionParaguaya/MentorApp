import {
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import React, { Component } from 'react'
import {
  buildPDFOptions,
  buildPrintOptions,
  getReportTitle
} from '../utils/pdfs'
import { submitDraft, updateDraft } from '../../redux/actions'

import Button from '../../components/Button'
import LifemapVisual from '../../components/LifemapVisual'
import PropTypes from 'prop-types'
import RNFetchBlob from 'rn-fetch-blob'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print'
import RoundImage from '../../components/RoundImage'
import { connect } from 'react-redux'
import globalStyles from '../../globalStyles'
import { prepareDraftForSubmit } from '../utils/helpers'
import { url } from '../../config'
import { withNamespaces } from 'react-i18next'

export class Final extends Component {
  survey = this.props.navigation.getParam('survey')
  draft = this.props.navigation.getParam('draft')
  state = {
    loading: false,
    downloading: false,
    printing: false
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
    justifyContent: 'space-between'
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
