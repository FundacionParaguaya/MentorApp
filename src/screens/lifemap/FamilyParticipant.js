import React, { Component } from 'react'
import { StyleSheet, Text } from 'react-native'
import { createDraft, updateDraft } from '../../redux/actions'
import { getTotalScreens, setValidationSchema } from './helpers'

import DateInput from '../../components/form/DateInput'
import Decoration from '../../components/decoration/Decoration'
import Icon from 'react-native-vector-icons/MaterialIcons'
import PropTypes from 'prop-types'
import Select from '../../components/form/Select'
import StickyFooter from '../../components/StickyFooter'
import TextInput from '../../components/form/TextInput'
import colors from '../../theme.json'
import { connect } from 'react-redux'
import globalStyles from '../../globalStyles'
import uuid from 'uuid/v1'
import { withNamespaces } from 'react-i18next'
import { generateNewDemoDraft } from '../utils/helpers'

export class FamilyParticipant extends Component {
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')
  readOnly = this.props.navigation.getParam('readOnly')
  requiredFields =
    (this.survey.surveyConfig &&
      this.survey.surveyConfig.requiredFields &&
      this.survey.surveyConfig.requiredFields.primaryParticipant) ||
    null
  familyMembersArray = [] // the options array for members count dropdown
  readOnlyDraft = this.props.navigation.getParam('family') || []

  state = {
    errors: [],
    showErrors: false
  }

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  setError = (error, field) => {
    const { errors } = this.state

    if (error && !errors.includes(field)) {
      this.setState(previousState => {
        return {
          ...previousState,
          errors: [...previousState.errors, field]
        }
      })
    } else if (!error) {
      this.setState({
        errors: errors.filter(item => item !== field)
      })
    }

    this.onErrorStateChange(error || this.state.errors.length)
  }

  validateForm = () => {
    if (this.state.errors.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.onContinue()
    }
  }

  onContinue = () => {
    if (this.readOnly) {
      return
    }

    const draft = this.getDraft()
    const survey = this.survey

    const { draftId } = draft
    const { countFamilyMembers } = draft.familyData

    if (countFamilyMembers && countFamilyMembers > 1) {
      // if multiple family members navigate to members screens
      this.props.navigation.navigate('FamilyMembersNames', {
        draftId,
        survey
      })
    } else {
      // if only one family member, navigate directly to location
      this.props.navigation.navigate('Location', { draftId, survey })
    }
  }

  addFamilyCount = value => {
    if (this.readOnly) {
      return
    }

    const draft = this.getDraft()
    const { countFamilyMembers } = draft.familyData
    const PREFER_NOT_TO_SAY = -1

    let familyMembersList = draft.familyData.familyMembersList

    const numberOfMembers =
      countFamilyMembers === PREFER_NOT_TO_SAY ? 1 : countFamilyMembers

    if (value !== PREFER_NOT_TO_SAY && numberOfMembers > value) {
      familyMembersList.splice(value, familyMembersList.length - 1)
    } else if (
      value !== PREFER_NOT_TO_SAY &&
      (numberOfMembers < value || !numberOfMembers)
    ) {
      for (var i = 0; i < value - (numberOfMembers || 1); i++) {
        familyMembersList.push({ firstParticipant: false })
      }
    } else if (value === PREFER_NOT_TO_SAY) {
      familyMembersList.splice(1, familyMembersList.length - 1)
    }

    this.props.updateDraft({
      ...draft,
      familyData: {
        ...draft.familyData,
        countFamilyMembers: value,
        familyMembersList
      }
    })
  }

  getFamilyMembersCountArray = () => [
    { text: this.props.t('views.family.onlyPerson'), value: 1 },
    ...Array.from(new Array(24), (val, index) => ({
      value: index + 2,
      text: `${index + 2}`
    })),
    {
      text: this.props.t('views.family.preferNotToSay'),
      value: -1
    }
  ]

  updateParticipant = (value, field) => {
    if (this.readOnly) {
      return
    }

    const draft = this.getDraft()

    this.props.updateDraft({
      ...draft,
      familyData: {
        ...draft.familyData,
        familyMembersList: Object.assign(
          [],
          draft.familyData.familyMembersList,
          {
            [0]: {
              ...draft.familyData.familyMembersList[0],
              [field]: value
            }
          }
        )
      }
    })
  }

  onErrorStateChange = hasErrors => {
    const { navigation } = this.props

    // for this particular screen we need to detect if form is valid
    // in order to delete the draft on exiting
    navigation.setParams({
      deleteDraftOnExit: hasErrors
    })
  }

  createNewDraft() {
    // check if current survey is demo
    const isDemo = this.survey.surveyConfig && this.survey.surveyConfig.isDemo
    // generate a new draft id
    const draftId = uuid()

    // and update the component and navigation with it
    this.draftId = draftId
    this.props.navigation.setParams({ draftId })

    const regularDraft = {
      draftId,
      created: Date.now(),
      status: 'Draft',
      surveyId: this.survey.id,
      surveyVersionId: this.survey.surveyVersionId,
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      priorities: [],
      achievements: [],
      progress: {
        screen: 'FamilyParticipant',
        total: getTotalScreens(this.survey)
      },
      familyData: {
        familyMembersList: [
          {
            firstParticipant: true,
            socioEconomicAnswers: [],
            birthCountry: this.survey.surveyConfig.surveyLocation.country
          }
        ]
      }
    }

    // create the new draft in redux
    this.props.createDraft(
      isDemo ? generateNewDemoDraft(this.survey, draftId) : regularDraft
    )
  }

  componentDidMount() {
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft

    this.familyMembersArray = this.getFamilyMembersCountArray()
    // generate a new draft if not resuming or reviewing an old one,
    // else just set the draft progress

    if (!this.draftId && !this.readOnly) {
      this.createNewDraft()
    } else if (
      !this.readOnly &&
      draft.progress.screen !== 'FamilyParticipant'
    ) {
      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'FamilyParticipant'
        }
      })
    }
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  render() {
    const { t } = this.props
    const { showErrors } = this.state
    const draft = !this.readOnly ? this.getDraft() : this.readOnlyDraft
    let participant = draft ? draft.familyData.familyMembersList[0] : {}
    return draft ? (
      <StickyFooter
        onContinue={this.validateForm}
        continueLabel={t('general.continue')}
        readOnly={!!this.readOnly}
        progress={!this.readOnly && draft ? 1 / draft.progress.total : 0}
      >
        <Decoration variation="primaryParticipant">
          <Icon name="face" color={colors.grey} size={61} style={styles.icon} />
          {!this.readOnly ? (
            <Text
              readonly={this.readOnly}
              style={[globalStyles.h2Bold, styles.heading]}
            >
              {t('views.family.primaryParticipantHeading')}
            </Text>
          ) : null}
        </Decoration>

        <TextInput
          id="firstName"
          upperCase
          autoFocus={!participant.firstName}
          placeholder={t('views.family.firstName')}
          initialValue={participant.firstName || ''}
          required={setValidationSchema(this.requiredFields, 'firstName', true)}
          validation="string"
          readonly={!!this.readOnly}
          onChangeText={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'firstName')}
        />

        <TextInput
          id="lastName"
          upperCase
          placeholder={t('views.family.lastName')}
          initialValue={participant.lastName || ''}
          required={setValidationSchema(this.requiredFields, 'lastName', true)}
          validation="string"
          readonly={!!this.readOnly}
          onChangeText={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'lastName')}
        />

        <Select
          id="gender"
          label={t('views.family.gender')}
          placeholder={t('views.family.selectGender')}
          initialValue={participant.gender || ''}
          required={setValidationSchema(this.requiredFields, 'gender', true)}
          options={this.survey.surveyConfig.gender}
          onChange={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'gender')}
          otherField="customGender"
          otherPlaceholder={t('views.family.specifyGender')}
          readonly={!!this.readOnly}
          initialOtherValue={participant.customGender}
        />

        <DateInput
          id="birthDate"
          required={setValidationSchema(this.requiredFields, 'birthDate', true)}
          label={t('views.family.dateOfBirth')}
          initialValue={participant.birthDate}
          readonly={!!this.readOnly}
          onValidDate={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'birthDate')}
        />

        <Select
          id="documentType"
          label={t('views.family.documentType')}
          placeholder={t('views.family.documentType')}
          options={this.survey.surveyConfig.documentType}
          initialValue={participant.documentType || ''}
          required={setValidationSchema(
            this.requiredFields,
            'documentType',
            true
          )}
          otherPlaceholder={t('views.family.customDocumentType')}
          otherField="customDocumentType"
          initialOtherValue={participant.customDocumentType}
          readonly={!!this.readOnly}
          onChange={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'documentType')}
        />

        <TextInput
          id="documentNumber"
          placeholder={t('views.family.documentNumber')}
          initialValue={participant.documentNumber}
          required={setValidationSchema(
            this.requiredFields,
            'documentNumber',
            true
          )}
          readonly={!!this.readOnly}
          onChangeText={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'documentNumber')}
        />

        <Select
          id="birthCountry"
          countrySelect
          label={t('views.family.countryOfBirth')}
          placeholder={t('views.family.countryOfBirth')}
          initialValue={participant.birthCountry}
          required={setValidationSchema(
            this.requiredFields,
            'birthCountry',
            true
          )}
          defaultCountry={this.survey.surveyConfig.surveyLocation.country}
          countriesOnTop={this.survey.surveyConfig.countryOfBirth}
          readonly={!!this.readOnly}
          onChange={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'birthCountry')}
        />

        <Select
          id="countFamilyMembers"
          label={t('views.family.peopleLivingInThisHousehold')}
          placeholder={t('views.family.peopleLivingInThisHousehold')}
          initialValue={draft.familyData.countFamilyMembers || ''}
          required={setValidationSchema(
            this.requiredFields,
            'countFamilyMembers',
            true
          )}
          options={this.familyMembersArray}
          readonly={!!this.readOnly}
          onChange={this.addFamilyCount}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'countFamilyMembers')}
        />

        <TextInput
          id="email"
          initialValue={participant.email}
          placeholder={t('views.family.email')}
          validation="email"
          readonly={!!this.readOnly}
          onChangeText={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'email')}
        />

        <TextInput
          id="phoneNumber"
          initialValue={participant.phoneNumber}
          placeholder={t('views.family.phone')}
          validation="phoneNumber"
          readonly={!!this.readOnly}
          onChangeText={this.updateParticipant}
          showErrors={showErrors}
          setError={isError => this.setError(isError, 'phoneNumber')}
        />
      </StickyFooter>
    ) : null
  }
}
const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center'
  },
  heading: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    color: colors.grey
  }
})

FamilyParticipant.propTypes = {
  drafts: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  createDraft: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  createDraft,
  updateDraft
}

const mapStateToProps = ({ drafts }) => ({ drafts })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyParticipant)
)
