import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../../theme.json'
import { withNamespaces } from 'react-i18next'
import {
  addSurveyFamilyMemberData,
  addDraftProgress
} from '../../redux/actions'
import StickyFooter from '../../components/StickyFooter'
import TextInput from '../../components/TextInput'
import Decoration from '../../components/decoration/Decoration'
import globalStyles from '../../globalStyles'
import Select from '../../components/Select'
import DateInput from '../../components/DateInput'

export class FamilyMembersNames extends Component {
  draftId = this.props.navigation.getParam('draftId')
  survey = this.props.navigation.getParam('survey')
  gender = this.survey.surveyConfig.gender
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
    const draft = this.getDraft()

    this.props.addDraftProgress(this.draftId, {
      current: draft.progress.current - 1,
      total: draft.progress.total - 1
    })

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

  handleClick = () => {
    const draft = this.getDraft()

    if (this.state.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.props.addDraftProgress(this.draftId, {
        current: draft.progress.current + 1
      })

      this.props.navigation.navigate('Location', {
        draftId: this.draftId,
        survey: this.survey
      })
    }
  }
  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  getFieldValue = field => {
    const draft = this.getDraft()
    if (!draft) {
      return
    }

    return draft.familyData[field]
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
      <StickyFooter
        handleClick={() => this.handleClick(draft)}
        continueLabel={t('general.continue')}
        progress={draft ? draft.progress.current / draft.progress.total : 0}
      >
        <Decoration variation="familyMemberNamesHeader">
          <View style={styles.circleContainer}>
            <Text style={styles.circle}>+{familyMembersCount.length}</Text>
            <Icon
              name="face"
              color={colors.grey}
              size={61}
              style={styles.icon}
            />
          </View>
        </Decoration>

        {familyMembersCount.map((item, i) => (
          <View key={i} style={{ marginBottom: 20 }}>
            {i % 2 ? <Decoration variation="familyMemberNamesBody" /> : null}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingHorizontal: 20,
                marginBottom: 15
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
                {`${t('views.family.familyMember')} ${i + 1}`}
              </Text>
            </View>
            <TextInput
              key={i}
              validation="string"
              field={i.toString()}
              onChangeText={text => this.addFamilyMemberName(text, i + 1)}
              placeholder={`${t('views.family.firstName')}`}
              value={
                (this.getFieldValue('familyMembersList')[i + 1] || {})
                  .firstName || ''
              }
              required
              detectError={this.detectError}
              showErrors={showErrors}
            />
            <Select
              field={i.toString()}
              onChange={text => this.addFamilyMemberGender(text, i + 1)}
              label={t('views.family.gender')}
              placeholder={t('views.family.selectGender')}
              value={
                (this.getFieldValue('familyMembersList')[i + 1] || {}).gender ||
                ''
              }
              detectError={this.detectError}
              options={this.gender}
            />

            <DateInput
              field={i.toString()}
              label={t('views.family.dateOfBirth')}
              detectError={this.detectError}
              showErrors={this.state.showErrors}
              required
              onValidDate={date => this.addFamilyMemberBirthdate(date, i + 1)}
              value={
                (this.getFieldValue('familyMembersList')[i + 1] || {}).birthDate
              }
            />
          </View>
        ))}
      </StickyFooter>
    )
  }
}

FamilyMembersNames.propTypes = {
  drafts: PropTypes.array,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  addSurveyFamilyMemberData: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center'
  },
  circleContainer: {
    marginBottom: 10,
    marginTop: 20,
    position: 'relative'
  },
  circle: {
    position: 'absolute',
    width: 22,
    height: 22,
    lineHeight: 22,
    left: '50%',
    textAlign: 'center',
    fontSize: 10,
    transform: [{ translateX: 3 }, { translateY: -3 }],
    borderRadius: 50,
    backgroundColor: colors.lightgrey,
    zIndex: 1
  }
})

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
  )(FamilyMembersNames)
)
