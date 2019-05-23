import React, { Component } from 'react'
import { StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import uuid from 'uuid/v1'
import {
  createDraft,
  addSurveyFamilyMemberData,
  addDraftProgress,
  addSurveyData,
  removeFamilyMembers,
  updateNav,
  updateDraft
} from '../../redux/actions'
import { withNamespaces } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'
import StickyFooter from '../../components/StickyFooter'
import Select from '../../components/Select'
import TextInput from '../../components/TextInput'
import DateInput from '../../components/DateInput'
import Decoration from '../../components/decoration/Decoration'
import colors from '../../theme.json'
import globalStyles from '../../globalStyles'
import { getTotalScreens } from './helpers'
export class FamilyParticipant extends Component {
  gender = this.props.nav.survey.surveyConfig.gender

  documentType = this.props.nav.survey.surveyConfig.documentType

  errorsDetected = []

  state = {
    errorsDetected: [],
    showErrors: false,
    draft: this.props.navigation.getParam('draft') ||
      this.props.navigation.getParam('family') || {
        surveyId: this.props.nav.survey.id,
        surveyVersionId: this.props.nav.survey['surveyVersionId'],
        created: Date.now(),
        draftId: uuid(),
        economicSurveyDataList: [],
        indicatorSurveyDataList: [],
        priorities: [],
        achievements: [],
        progress: {
          screen: 'FamilyParticipant',
          total: getTotalScreens(this.props.nav.survey)
        },
        familyData: {
          familyMembersList: [
            {
              firstParticipant: true,
              socioEconomicAnswers: []
            }
          ]
        }
      }
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

  handleClick = () => {
    const { countFamilyMembers } = this.state.draft.familyData
    // check if form is valid
    if (this.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      const { draft } = this.state
      // if this is a new draft, add it to the store
      if (!this.props.navigation.getParam('draft')) {
        this.props.createDraft(draft)
      } else {
        this.props.updateDraft(draft.draftId, draft)
      }
      if (countFamilyMembers && countFamilyMembers > 1) {
        // if multiple family members navigate to members screens
        this.props.navigation.navigate('FamilyMembersNames')
      } else {
        // if only one family member, navigate directly to location
        this.props.navigation.navigate('Location')
      }
    }
  }

  addFamilyCount = (text, field) => {
    const { countFamilyMembers } = this.state.draft.familyData

    // if reducing the number of family members remove the rest
    if (text && countFamilyMembers && countFamilyMembers > text) {
      const index = text === -1 ? 1 : text
      this.props.removeFamilyMembers(this.draftId, index)

      this.setState({
        errorsDetected: this.errorsDetected
      })
    }

    this.setState({
      showErrors: false
    })

    this.props.addSurveyData(this.draftId, 'familyData', {
      [field]: text
    })
  }

  getFamilyMembersCountArray = t => [
    { text: t('views.family.onlyPerson'), value: 1 },
    ...Array.from(new Array(24), (val, index) => ({
      value: index + 2,
      text: `${index + 2}`
    })),

    {
      text: t('views.family.preferNotToSay'),
      value: -1
    }
  ]

  getFieldValue = (draft, field) => {
    if (!draft) {
      return
    } else if (typeof draft !== 'undefined' && draft !== 'null') {
      if (
        typeof draft.familyData !== 'undefined' &&
        draft.familyData !== 'null'
      ) {
        return draft.familyData.familyMembersList[0][field]
      }
    }
  }

  addSurveyData = (text, field) => {
    let draft = this.props.drafts.find(draft => draft.draftId === this.draftId)
    if (typeof draft !== 'undefined' && draft !== 'null') {
      if (
        typeof draft.familyData !== 'undefined' &&
        draft.familyData !== 'null'
      ) {
        let primaryParticipantDraft = draft.familyData.familyMembersList[0]
        const { survey } = this.props.nav
        let genderValues = survey.surveyConfig.gender
        if (field === 'gender') {
          let otherTypeGender
          genderValues.forEach(ele => {
            if (typeof ele.otherOption !== undefined) {
              if (ele.otherOption) {
                otherTypeGender = ele.value
              }
            }
          })

          if (
            otherTypeGender === this.getFieldValue(draft, 'gender') &&
            text !== 'O'
          ) {
            delete primaryParticipantDraft.customGender
          }
        }

        if (field === 'documentType') {
          let otherTypeDocumentNumber
          let docValues = survey.surveyConfig.documentType
          docValues.forEach(ele => {
            if (typeof ele.otherOption !== undefined) {
              if (ele.otherOption) {
                otherTypeDocumentNumber = ele.value
              }
            }
          })

          if (
            otherTypeDocumentNumber ===
              this.getFieldValue(draft, 'documentType') &&
            text !== this.getFieldValue(draft, 'documentType')
          ) {
            delete primaryParticipantDraft.customDocumentType
          }
        }

        this.props.addSurveyFamilyMemberData({
          id: this.draftId,
          index: 0,
          payload: {
            [field]: text
          }
        })
      }
    }
  }

  updateParticipant = (value, field) => {
    const { draft } = this.state

    this.setState({
      draft: {
        ...draft,
        familyData: {
          ...draft.familyData,
          familyMembersList: [
            {
              ...draft.familyData.familyMembersList[0],
              ...{
                [field]: value
              }
            },
            ...draft.familyData.familyMembersList.slice(1)
          ]
        }
      }
    })
  }

  componentDidMount() {
    const { navigation } = this.props
    const { draft } = this.state

    // if this is a new draft state it in navigation so the exit modal knows
    if (!navigation.getParam('draft')) {
      navigation.setParams({ isNewDraft: true })
    }

    if (
      !this.props.nav.readonly &&
      draft.progress.screen !== 'FamilyParticipant'
    ) {
      // set progrtess
      this.props.addDraftProgress(draft.draftId, {
        screen: 'FamilyParticipant',
        total: getTotalScreens(this.props.nav.survey)
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // update nav draft param if the data changes
    // so the exit modal can access it
    if (prevState.draft.familyData !== this.state.draft.familyData) {
      this.props.navigation.setParams({ draft: this.state.draft })
    }
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  render() {
    const { t } = this.props
    const { survey, readonly } = this.props.nav
    const { showErrors, draft } = this.state

    const participant = draft.familyData.familyMembersList[0]

    let otherTypeDocumentNumber = 0
    let otherTypeGender = 0
    let docValues = survey.surveyConfig.documentType
    let genderValues = survey.surveyConfig.gender
    docValues.forEach(ele => {
      if (typeof ele.otherOption !== undefined) {
        if (ele.otherOption) {
          otherTypeDocumentNumber = ele.value
        }
      }
    })

    genderValues.forEach(ele => {
      if (typeof ele.otherOption !== undefined) {
        if (ele.otherOption) {
          otherTypeGender = ele.value
        }
      }
    })

    return (
      <StickyFooter
        handleClick={this.handleClick}
        continueLabel={t('general.continue')}
        readonly={readonly}
        progress={!readonly && draft ? 1 / draft.progress.total : 0}
      >
        <Decoration variation="primaryParticipant">
          <Icon name="face" color={colors.grey} size={61} style={styles.icon} />
          {readonly !== true ? (
            <Text
              readonly={readonly}
              style={[globalStyles.h2Bold, styles.heading]}
            >
              {t('views.family.primaryParticipantHeading')}
            </Text>
          ) : null}
        </Decoration>

        <TextInput
          autoFocus={!participant.firstName}
          validation="string"
          field="firstName"
          readonly={readonly}
          onChangeText={this.updateParticipant}
          placeholder={t('views.family.firstName')}
          value={participant.firstName || ''}
          required
          detectError={this.detectError}
          showErrors={showErrors}
        />
        <TextInput
          field="lastName"
          validation="string"
          onChangeText={this.updateParticipant}
          readonly={readonly}
          placeholder={t('views.family.lastName')}
          value={participant.lastName || ''}
          required
          detectError={this.detectError}
          showErrors={showErrors}
        />
        <Select
          id="gender"
          required
          onChange={this.addSurveyData}
          readonly={readonly}
          label={t('views.family.gender')}
          placeholder={t('views.family.selectGender')}
          field="gender"
          value={participant.gender || ''}
          detectError={this.detectError}
          showErrors={showErrors}
          options={this.gender}
        />
        {otherTypeGender === this.getFieldValue(draft, 'gender') ? (
          <TextInput
            field="customGender"
            validation="string"
            onChangeText={this.addSurveyData}
            readonly={readonly}
            placeholder={t('views.family.specifyGender')}
            value={participant.customGender || ''}
            required
            detectError={this.detectError}
            showErrors={showErrors}
          />
        ) : null}
        <DateInput
          required
          label={t('views.family.dateOfBirth')}
          field="birthDate"
          detectError={this.detectError}
          showErrors={showErrors}
          onValidDate={this.addSurveyData}
          value={participant.birthDate}
          readonly={readonly}
        />

        <Select
          required
          onChange={this.addSurveyData}
          readonly={readonly}
          label={t('views.family.documentType')}
          placeholder={t('views.family.documentType')}
          field="documentType"
          value={participant.documentType || ''}
          detectError={this.detectError}
          showErrors={showErrors}
          options={this.documentType}
        />
        {otherTypeDocumentNumber ===
        this.getFieldValue(draft, 'documentType') ? (
          <TextInput
            field="customDocumentType"
            validation="string"
            onChangeText={this.addSurveyData}
            readonly={readonly}
            placeholder={t('views.family.customDocumentType')}
            value={participant.customDocumentType || ''}
            required
            detectError={this.detectError}
            showErrors={showErrors}
          />
        ) : null}

        <TextInput
          onChangeText={this.addSurveyData}
          readonly={readonly}
          field="documentNumber"
          required
          value={participant.documentNumber}
          placeholder={t('views.family.documentNumber')}
          detectError={this.detectError}
          showErrors={showErrors}
        />
        <Select
          id="country"
          required
          onChange={this.addSurveyData}
          readonly={readonly}
          label={t('views.family.countryOfBirth')}
          countrySelect
          country={survey.surveyConfig.surveyLocation.country}
          placeholder={t('views.family.countryOfBirth')}
          field="birthCountry"
          value={
            participant.birthCountry ||
            survey.surveyConfig.surveyLocation.country
          }
          detectError={this.detectError}
          showErrors={showErrors}
        />
        <Select
          id="familyMembersCount"
          required
          onChange={this.addFamilyCount}
          readonly={readonly}
          label={t('views.family.peopleLivingInThisHousehold')}
          placeholder={t('views.family.peopleLivingInThisHousehold')}
          field="countFamilyMembers"
          value={draft.familyData.countFamilyMembers || ''}
          detectError={this.detectError}
          showErrors={showErrors}
          options={this.getFamilyMembersCountArray(t)}
        />
        <TextInput
          onChangeText={this.addSurveyData}
          readonly={readonly}
          field="email"
          value={participant.email}
          placeholder={t('views.family.email')}
          validation="email"
          detectError={this.detectError}
          showErrors={showErrors}
        />
        <TextInput
          onChangeText={this.addSurveyData}
          readonly={readonly}
          field="phoneNumber"
          value={participant.phoneNumber}
          placeholder={t('views.family.phone')}
          validation="phoneNumber"
          detectError={this.detectError}
          showErrors={showErrors}
        />
      </StickyFooter>
    )
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
  t: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired,
  nav: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  createDraft: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  addSurveyFamilyMemberData: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired,
  addSurveyData: PropTypes.func.isRequired,
  removeFamilyMembers: PropTypes.func.isRequired,
  updateNav: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  createDraft,
  updateDraft,
  addSurveyFamilyMemberData,
  addDraftProgress,
  addSurveyData,
  removeFamilyMembers,
  updateNav
}

const mapStateToProps = ({ drafts, nav }) => ({
  drafts,
  nav
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyParticipant)
)
