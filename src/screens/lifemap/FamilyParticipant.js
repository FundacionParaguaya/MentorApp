import React, { Component } from 'react'
import { StyleSheet, Text } from 'react-native'
import { createDraft, updateDraft } from '../../redux/actions'
import { getTotalScreens, setValidationSchema } from './helpers'

import DateInput from '../../components/form/DateInput'
import Decoration from '../../components/decoration/Decoration'
import Form from '../../components/form/Form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import PropTypes from 'prop-types'
import Select from '../../components/form/Select'
import TextInput from '../../components/form/TextInput'
import colors from '../../theme.json'
import { connect } from 'react-redux'
import globalStyles from '../../globalStyles'
import uuid from 'uuid/v1'
import { withNamespaces } from 'react-i18next'

export class FamilyParticipant extends Component {
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')
  readOnly = this.props.navigation.getParam('readOnly')
  familyMembersArray = [] // the options array for members count dropdown

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  onContinue = () => {
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

  createNewDraft() {
    // generate a new draft id
    const draftId = uuid()

    // and update the component and navigation with it
    this.draftId = draftId
    this.props.navigation.setParams({ draftId })

    // create the new draft in redux
    this.props.createDraft({
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
    })
  }

  componentDidMount() {
    const draft = this.getDraft()

    this.familyMembersArray = this.getFamilyMembersCountArray()

    // generate a new draft if not resuming or reviewing an old one,
    // else just set the draft progress
    if (!this.draftId) {
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

    const requiredFields =
      (this.survey.surveyConfig &&
        this.survey.surveyConfig.requiredFields &&
        this.survey.surveyConfig.requiredFields.primaryParticipant) ||
      null

    const draft = this.getDraft()

    const participant = draft ? draft.familyData.familyMembersList[0] : {}

    return draft ? (
      <Form
        onContinue={this.onContinue}
        continueLabel={t('general.continue')}
        readOnly={!!this.readOnly}
        progress={!this.readOnly && draft ? 1 / draft.progress.total : 0}
      >
        <Decoration variation="primaryParticipant">
          <Icon name="face" color={colors.grey} size={61} style={styles.icon} />
          {this.readOnly !== true ? (
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
          required={setValidationSchema(requiredFields, 'firstName', true)}
          validation="string"
          onChangeText={this.updateParticipant}
        />

        <TextInput
          id="lastName"
          upperCase
          placeholder={t('views.family.lastName')}
          initialValue={participant.lastName || ''}
          required={setValidationSchema(requiredFields, 'lastName', true)}
          validation="string"
          onChangeText={this.updateParticipant}
        />

        <Select
          id="gender"
          label={t('views.family.gender')}
          placeholder={t('views.family.selectGender')}
          initialValue={participant.gender || ''}
          required={setValidationSchema(requiredFields, 'gender', true)}
          options={this.survey.surveyConfig.gender}
          onChange={this.updateParticipant}
          otherField="customGender"
          otherPlaceholder={t('views.family.specifyGender')}
          otherValue={participant.customGender}
        />

        <DateInput
          id="birthDate"
          required={setValidationSchema(requiredFields, 'birthDate', true)}
          label={t('views.family.dateOfBirth')}
          initialValue={participant.birthDate}
          onValidDate={this.updateParticipant}
        />

        <Select
          id="documentType"
          label={t('views.family.documentType')}
          placeholder={t('views.family.documentType')}
          options={this.survey.surveyConfig.documentType}
          initialValue={participant.documentType || ''}
          required={setValidationSchema(requiredFields, 'documentType', true)}
          otherPlaceholder={t('views.family.customDocumentType')}
          otherField="customDocumentType"
          otherValue={participant.customDocumentType}
          onChange={this.updateParticipant}
        />

        <TextInput
          id="documentNumber"
          placeholder={t('views.family.documentNumber')}
          initialValue={participant.documentNumber}
          required={setValidationSchema(requiredFields, 'documentNumber', true)}
          onChangeText={this.updateParticipant}
        />

        <Select
          id="birthCountry"
          countrySelect
          label={t('views.family.countryOfBirth')}
          placeholder={t('views.family.countryOfBirth')}
          initialValue={participant.birthCountry}
          required={setValidationSchema(requiredFields, 'birthCountry', true)}
          defaultCountry={this.survey.surveyConfig.surveyLocation.country}
          countriesOnTop={this.survey.surveyConfig.countryOfBirth}
          onChange={this.updateParticipant}
        />

        <Select
          id="countFamilyMembers"
          label={t('views.family.peopleLivingInThisHousehold')}
          placeholder={t('views.family.peopleLivingInThisHousehold')}
          initialValue={draft.familyData.countFamilyMembers || ''}
          required={setValidationSchema(
            requiredFields,
            'countFamilyMembers',
            true
          )}
          options={this.familyMembersArray}
          onChange={this.addFamilyCount}
        />

        <TextInput
          id="email"
          initialValue={participant.email}
          placeholder={t('views.family.email')}
          validation="email"
          onChangeText={this.updateParticipant}
        />

        <TextInput
          id="phoneNumber"
          initialValue={participant.phoneNumber}
          placeholder={t('views.family.phone')}
          validation="phoneNumber"
          onChangeText={this.updateParticipant}
        />
      </Form>
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
