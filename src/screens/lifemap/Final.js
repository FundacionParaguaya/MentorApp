import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import RoundImage from '../../components/RoundImage'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'
import globalStyles from '../../globalStyles'
import { updateDraft, submitDraft } from '../../redux/actions'
import { url } from '../../config'
import { prepareDraftForSubmit } from '../utils/helpers'
import { buildPDFOptions } from '../utils/pdfs'
import RNHTMLtoPDF from 'react-native-html-to-pdf'

export class Final extends Component {
  survey = this.props.navigation.getParam('survey')
  draft = this.props.navigation.getParam('draft')
  state = {
    loading: false,
    downloadingPDF: false,
    printingLifemap: false
  }
  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  componentDidMount() {
    this.props.updateDraft(this.draft.draftId, this.draft)
    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    this.props.navigation.replace('Overview', {
      resumeDraft: false,
      draft: this.draft,
      survey: this.survey
    })
  }

  saveDraft = () => {
    this.setState({
      loading: true
    })

    const draft = prepareDraftForSubmit(this.draft, this.surveys)

    this.props.submitDraft(
      url[this.props.env],
      this.props.user.token,
      draft.draftId,
      draft
    )
    this.props.navigation.popToTop()
    this.props.navigation.navigate('Dashboard')
  }

  exportPDF = () => {
    this.setState({ downloadingPDF: true })
    const options = buildPDFOptions(this.draft, this.survey)
    RNHTMLtoPDF.convert(options)
      .then(() => this.setState({ downloadingPDF: false }))
      .catch(() => {})
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
              style={{ width: '49%', alignSelf: 'center', marginTop: 20 }}
              handleClick={this.exportPDF}
              icon="cloud-download"
              outlined
              text="Download"
              loading={this.state.downloadingPDF}
            />
            <Button
              style={{ width: '49%', alignSelf: 'center', marginTop: 20 }}
              handleClick={this.exportPDF}
              icon="print"
              outlined
              text="Print"
              loading={this.state.printingLifemap}
            />
          </View>
        </View>
        <View style={{ height: 50 }}>
          <Button
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
  user: PropTypes.object.isRequired
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
