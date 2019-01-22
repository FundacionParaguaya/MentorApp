import React, { Component } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import {
  addSurveyData,
  addSurveyFamilyMemberData,
  removeFamilyMembers,
  addDraftProgress
} from '../../redux/actions'

import globalStyles from '../../globalStyles'
import Button from '../../components/Button'
import Select from '../../components/Select'
import TextInput from '../../components/TextInput'

export class FamilyMembersNames extends Component {
  draftId = this.props.navigation.getParam('draftId')
  survey = this.props.navigation.getParam('survey')

  errorsDetected = []

  state = { errorsDetected: [], showErrors: false }

  componentDidMount() {
    this.props.addDraftProgress(this.draftId, {
      screen: 'FamilyMembersNames'
    })
    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    this.props.navigation.navigate('FamilyParticipant', {
      draftId: this.draftId,
      survey: this.survey
    })
  }
  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
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

  handleClick() {
    if (this.state.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.getFieldValue('countFamilyMembers') > 1
        ? this.props.navigation.navigate('FamilyMembersGender', {
            draftId: this.draftId,
            survey: this.survey
          })
        : this.props.navigation.navigate('Location', {
            draftId: this.draftId,
            survey: this.survey
          })
    }
  }
  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.draftId)[0]

  getFieldValue = field => {
    const draft = this.getDraft()
    if (!draft) {
      return
    }

    return draft.familyData[field]
  }

  addFamilyCount = (text, field) => {
    // if reducing the number of family members remove the rest
    if (
      text &&
      text !== -1 &&
      this.getFieldValue('countFamilyMembers') > text
    ) {
      this.props.removeFamilyMembers(this.draftId, text)

      // also remove these from the errors array
      for (
        var i = text - 1;
        i < this.getFieldValue('countFamilyMembers') - 1;
        i++
      ) {
        this.errorsDetected = this.errorsDetected.filter(
          item => item !== `${i}`
        )
      }

      this.setState({
        errorsDetected: this.errorsDetected
      })
    } else if (text === -1) {
      this.props.removeFamilyMembers(this.draftId, 1)
      this.errorsDetected = []
      this.setState({
        errorsDetected: []
      })
    }

    this.setState({
      showErrors: false
    })

    this.props.addSurveyData(this.draftId, 'familyData', {
      [field]: text
    })
  }

  addFamilyMemberName(name, index) {
    this.props.addSurveyFamilyMemberData({
      id: this.draftId,
      index,
      payload: {
        firstName: name,
        firstParticipant: false
      }
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

  render() {
    const { t } = this.props
    const { showErrors } = this.state
    const draft = this.getDraft()

    const familyMembersCount =
      draft.familyData.countFamilyMembers &&
      draft.familyData.countFamilyMembers !== -1
        ? Array(draft.familyData.countFamilyMembers - 1)
            .fill()
            .map((item, index) => index)
        : []

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={{ ...globalStyles.container, padding: 0 }}>
          <Select
            id="familyMembersCount"
            required
            onChange={this.addFamilyCount}
            label={t('views.family.peopleLivingInThisHousehold')}
            placeholder={t('views.family.peopleLivingInThisHousehold')}
            field="countFamilyMembers"
            value={this.getFieldValue('countFamilyMembers') || ''}
            detectError={this.detectError}
            showErrors={showErrors}
            options={this.getFamilyMembersCountArray(t)}
          />
          <TextInput
            validation="string"
            field=""
            onChangeText={() => {}}
            placeholder={`${t('views.family.familyMember')} 1 - ${t(
              'views.family.participant'
            )}`}
            value={draft.familyData.familyMembersList[0].firstName}
            required
            readonly
            detectError={this.detectError}
            showErrors={showErrors}
          />
          {familyMembersCount.map((item, i) => (
            <TextInput
              key={i}
              validation="string"
              field={i.toString()}
              onChangeText={text => this.addFamilyMemberName(text, i + 1)}
              placeholder={`${t('views.family.familyMember')} ${i + 2}`}
              value={
                (this.getFieldValue('familyMembersList')[i + 1] || {})
                  .firstName || ''
              }
              required
              detectError={this.detectError}
              showErrors={showErrors}
            />
          ))}
        </View>

        <View style={{ height: 50, marginTop: 30 }}>
          <Button
            colored
            text={t('general.continue')}
            handleClick={() => this.handleClick(draft)}
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
  }
})

FamilyMembersNames.propTypes = {
  drafts: PropTypes.array,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  addSurveyData: PropTypes.func.isRequired,
  addSurveyFamilyMemberData: PropTypes.func.isRequired,
  removeFamilyMembers: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addSurveyData,
  addSurveyFamilyMemberData,
  removeFamilyMembers,
  addDraftProgress
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyMembersNames)
)
