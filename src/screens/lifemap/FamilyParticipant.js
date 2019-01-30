import React, { Component } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import uuid from 'uuid/v1'
import {
  createDraft,
  addSurveyFamilyMemberData,
  addDraftProgress
} from '../../redux/actions'
import { withNamespaces } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Select from '../../components/Select'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import DateInputComponent from '../../components/DateInput'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'

export class FamilyParticipant extends Component {
  //Get draft id from Redux store if it exists else create new draft id
  draftId = this.props.navigation.getParam('draftId') || uuid()

  //Get survey if from draft if it exists else from navigation route
  surveyId =
    (this.props.drafts.filter(draft => draft.draftId === this.draftId)[0] || {})
      .surveyId || this.props.navigation.getParam('survey')

  //Get survey by id
  survey = this.props.surveys.filter(survey => survey.id === this.surveyId)[0]

  errorsDetected = []

  state = { errorsDetected: [], showErrors: false }

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

  getDraft() {
    //Get draft  from Redux store if it exists else create new draft
    if (!this.props.navigation.getParam('draftId')) {
      this.props.createDraft({
        surveyId: this.survey.id,
        surveyVersionId: this.survey['surveyVersionId'],
        created: Date.now(),
        draftId: this.draftId,
        economicSurveyDataList: [],
        indicatorSurveyDataList: [],
        priorities: [],
        achievements: [],
        familyData: {
          familyMembersList: [
            {
              firstParticipant: true,
              socioEconomicAnswers: []
            }
          ]
        }
      })
    }
  }

  componentDidMount() {
    this.getDraft()

    this.props.addDraftProgress(this.draftId, {
      screen: 'FamilyParticipant'
    })

    this.props.navigation.setParams({ draftId: this.draftId })
  }

  handleClick() {
    if (this.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.props.navigation.navigate('FamilyMembersNames', {
        draftId: this.draftId,
        survey: this.survey
      })
    }
  }

  getFieldValue = (draft, field) => {
    if (!draft) {
      return
    }
    return draft.familyData.familyMembersList[0][field]
  }

  addSurveyData = (text, field) => {
    this.props.addSurveyFamilyMemberData({
      id: this.draftId,
      index: 0,
      payload: {
        [field]: text
      }
    })
  }

  gender = this.survey.surveyConfig.gender

  documentType = this.survey.surveyConfig.documentType

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  render() {
    const { t } = this.props
    const { showErrors } = this.state
    const draft = this.props.drafts.filter(
      draft => draft.draftId === this.draftId
    )[0]

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View
          style={{
            ...globalStyles.container,
            padding: 0
          }}
        >
          <Icon name="face" color={colors.grey} size={55} style={styles.icon} />
          <TextInput
            validation="string"
            field="firstName"
            onChangeText={this.addSurveyData}
            placeholder={t('views.family.firstName')}
            value={this.getFieldValue(draft, 'firstName') || ''}
            required
            detectError={this.detectError}
            showErrors={showErrors}
          />
          <TextInput
            field="lastName"
            validation="string"
            onChangeText={this.addSurveyData}
            placeholder={t('views.family.lastName')}
            value={this.getFieldValue(draft, 'lastName') || ''}
            required
            detectError={this.detectError}
            showErrors={showErrors}
          />
          <Select
            id="gender"
            required
            onChange={this.addSurveyData}
            label={t('views.family.gender')}
            placeholder={t('views.family.selectGender')}
            field="gender"
            value={this.getFieldValue(draft, 'gender') || ''}
            detectError={this.detectError}
            showErrors={showErrors}
            options={this.gender}
          />

          <DateInputComponent
            required
            label={t('views.family.dateOfBirth')}
            field="birthDate"
            detectError={this.detectError}
            showErrors={showErrors}
            onValidDate={this.addSurveyData}
            value={this.getFieldValue(draft, 'birthDate')}
          />

          <Select
            required
            onChange={this.addSurveyData}
            label={t('views.family.documentType')}
            placeholder={t('views.family.documentType')}
            field="documentType"
            value={this.getFieldValue(draft, 'documentType') || ''}
            detectError={this.detectError}
            showErrors={showErrors}
            options={this.documentType}
          />
          <TextInput
            onChangeText={this.addSurveyData}
            field="documentNumber"
            required
            value={this.getFieldValue(draft, 'documentNumber')}
            placeholder={t('views.family.documentNumber')}
            detectError={this.detectError}
            showErrors={showErrors}
          />
          <Select
            id="country"
            required
            onChange={this.addSurveyData}
            label={t('views.family.countryOfBirth')}
            countrySelect
            country={this.survey.surveyConfig.surveyLocation.country}
            placeholder={t('views.family.selectACountry')}
            field="birthCountry"
            value={
              this.getFieldValue(draft, 'birthCountry') ||
              this.survey.surveyConfig.surveyLocation.country
            }
            detectError={this.detectError}
            showErrors={showErrors}
          />
          <TextInput
            onChangeText={this.addSurveyData}
            field="email"
            value={this.getFieldValue(draft, 'email')}
            placeholder={t('views.family.email')}
            validation="email"
            detectError={this.detectError}
            showErrors={showErrors}
          />
          <TextInput
            onChangeText={this.addSurveyData}
            field="phoneNumber"
            value={this.getFieldValue(draft, 'phoneNumber')}
            placeholder={t('views.family.phone')}
            validation="phoneNumber"
            detectError={this.detectError}
            showErrors={showErrors}
          />
        </View>
        <View style={{ height: 50, marginTop: 50 }}>
          <Button
            colored
            text={t('general.continue')}
            handleClick={() => this.handleClick()}
          />
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center'
  },
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})

FamilyParticipant.propTypes = {
  t: PropTypes.func.isRequired,
  surveys: PropTypes.array.isRequired,
  drafts: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  createDraft: PropTypes.func.isRequired,
  addSurveyFamilyMemberData: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  createDraft,
  addSurveyFamilyMemberData,
  addDraftProgress
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyParticipant)
)
