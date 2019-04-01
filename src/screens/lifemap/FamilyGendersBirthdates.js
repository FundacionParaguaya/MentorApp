import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../../theme.json'
import StickyFooter from '../../components/StickyFooter'
import {
  addSurveyFamilyMemberData,
  addDraftProgress
} from '../../redux/actions'
import globalStyles from '../../globalStyles'
import Select from '../../components/Select'
import DateInput from '../../components/DateInput'

export class FamilyGendersBirthdates extends Component {
  draftId = this.props.navigation.getParam('draftId')
  survey = this.props.navigation.getParam('survey')

  errorsDetected = []

  state = { errorsDetected: [] }

  componentDidMount() {
    const draft = this.getDraft() 

    this.props.addDraftProgress(this.draftId, {
      screen: 'FamilyGendersBirthdates'
    })

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    const draft = this.getDraft()
    
    this.props.addDraftProgress(this.draftId, {
      current: draft.progress.current - 1
    });

    this.props.navigation.navigate('FamilyMembersNames', {
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

  handleClick = () => {
    const draft = this.getDraft()
    
    if (this.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.props.addDraftProgress(this.draftId, {
        current: draft.progress.current + 1
      });

      this.props.navigation.navigate('Location', {
        draftId: this.draftId,
        survey: this.survey
      })
    }
  }

  getFieldValue = (draft, field) => {
    if (!draft) {
      return
    }
    return draft.familyData[field]
  }

  addFamilyMemberGender(gender, index) {
    this.props.addSurveyFamilyMemberData({
      id: this.draftId,
      index,
      payload: {
        gender
      }
    })
  }

  addFamilyMemberBirthdate(birthDate, index) {
    this.props.addSurveyFamilyMemberData({
      id: this.draftId,
      index,
      payload: {
        birthDate
      }
    })
  }

  getDraft = () => this.props.drafts.find(
    draft => draft.draftId === this.draftId
  )

  gender = this.survey.surveyConfig.gender
  render() {
    const { t } = this.props
    const draft = this.getDraft() 

    return (
      <StickyFooter
        handleClick={this.handleClick}
        continueLabel={t('general.continue')}
        progress={draft ? draft.progress.current / draft.progress.total : 0}
      >
        {draft.familyData.familyMembersList.slice(1).map((item, i) => (
          <View key={i}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingHorizontal: 20,
                marginTop: 15,
                marginBottom: 5
              }}
            >
              <Icon name="face" color={colors.grey} size={22} />
              <Text
                style={{
                  ...globalStyles.h2Bold,
                  color: colors.grey,
                  marginLeft: 5
                }}
              >
                {item.firstName}
              </Text>
            </View>
            <Select
              field={i.toString()}
              onChange={text => this.addFamilyMemberGender(text, i + 1)}
              label={t('views.family.gender')}
              placeholder={t('views.family.selectGender')}
              value={
                (this.getFieldValue(draft, 'familyMembersList')[i + 1] || {})
                  .gender || ''
              }
              detectError={this.detectError}
              options={this.gender}
            />

            <DateInput
              field={i.toString()}
              detectError={this.detectError}
              showErrors={this.state.showErrors}
              onValidDate={date => this.addFamilyMemberBirthdate(date, i + 1)}
              value={
                (this.getFieldValue(draft, 'familyMembersList')[i + 1] || {})
                  .birthDate
              }
            />
          </View>
        ))}
      </StickyFooter>
    )
  }
}

FamilyGendersBirthdates.propTypes = {
  t: PropTypes.func.isRequired,
  drafts: PropTypes.array,
  navigation: PropTypes.object.isRequired,
  addSurveyFamilyMemberData: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addSurveyFamilyMemberData,
  addDraftProgress
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyGendersBirthdates)
)
