import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
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
import { updateDraft } from '../../redux/actions'
import { withNamespaces } from 'react-i18next'

export class FamilyMembersNames extends Component {
  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')
  draftId = this.props.navigation.getParam('draftId')

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  onPressBack = () => {
    this.props.navigation.navigate('FamilyParticipant', {
      draftId: this.draftId,
      survey: this.survey
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  onContinue = () => {
    this.props.navigation.navigate('Location', {
      draftId: this.draftId,
      survey: this.survey
    })
  }

  updateMember = (value, field) => {
    if (!field || !field.split.length) {
      return
    }

    const draft = this.getDraft()

    // [0] is the index, [1] is the field
    const split = field.split('.')
    const memberIndex = split[0]
    const memberField = split[1]

    this.props.updateDraft({
      ...draft,
      familyData: {
        ...draft.familyData,
        familyMembersList: Object.assign(
          [],
          draft.familyData.familyMembersList,
          {
            [memberIndex]: {
              ...draft.familyData.familyMembersList[memberIndex],
              firstParticipant: false,
              [memberField]: value
            }
          }
        )
      }
    })
  }

  componentDidMount() {
    const draft = this.getDraft()
    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft
    })

    if (!this.readonly && draft.progress.screen !== 'FamilyMembersNames') {
      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'FamilyMembersNames',
          total: getTotalScreens(this.survey)
        }
      })
    }

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  render() {
    const { t } = this.props
    const draft = this.getDraft()
    const { familyMembersList } = draft.familyData
    const familyMembersCount =
      draft.familyData.countFamilyMembers &&
      draft.familyData.countFamilyMembers !== -1
        ? Array(draft.familyData.countFamilyMembers - 1)
            .fill()
            .map((item, index) => index)
        : []

    const requiredFields =
      (this.survey.surveyConfig &&
        this.survey.surveyConfig.requiredFields &&
        this.survey.surveyConfig.requiredFields.familyMember) ||
      null

    return (
      <Form
        handleClick={() => this.handleClick(draft)}
        continueLabel={t('general.continue')}
        progress={draft ? 2 / draft.progress.total : 0}
        readOnly={!!this.readOnly}
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
          <Text style={[globalStyles.h2Bold, styles.heading]}>
            {t('views.family.familyMembersHeading')}
          </Text>
        </Decoration>

        {familyMembersCount.map((item, i) => {
          return (
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
                    fontSize: 16,
                    color: colors.grey,
                    marginLeft: 5
                  }}
                >
                  {`${t('views.family.familyMember')}`}
                </Text>
              </View>
              <TextInput
                id={`${i + 1}.firstName`}
                autoFocus={
                  i === 0 && !(familyMembersList[i + 1] || {}).firstName
                }
                upperCase
                validation="string"
                onChangeText={this.updateMember}
                placeholder={`${t('views.family.firstName')}`}
                initialValue={(familyMembersList[i + 1] || {}).firstName || ''}
                required={setValidationSchema(
                  requiredFields,
                  'firstName',
                  true
                )}
              />
              <Select
                id={`${i + 1}.gender`}
                onChange={this.updateMember}
                label={t('views.family.gender')}
                placeholder={t('views.family.selectGender')}
                initialValue={(familyMembersList[i + 1] || {}).gender || ''}
                options={this.survey.surveyConfig.gender}
                required={setValidationSchema(requiredFields, 'gender', false)}
                otherField={`${i}.customGender`}
                otherPlaceholder={t('views.family.specifyGender')}
                otherValue={(familyMembersList[i + 1] || {}).customGender || ''}
              />

              <DateInput
                id={`${i + 1}.birthDate`}
                label={t('views.family.dateOfBirth')}
                onValidDate={this.updateMember}
                initialValue={(familyMembersList[i + 1] || {}).birthDate}
                required={setValidationSchema(
                  requiredFields,
                  'birthDate',
                  false
                )}
              />
            </View>
          )
        })}
      </Form>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center'
  },
  circleContainer: {
    // marginBottom: 10,
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
  },
  heading: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 25,
    paddingHorizontal: 20,
    color: colors.grey
  }
})

FamilyMembersNames.propTypes = {
  drafts: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  updateDraft: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = ({ drafts }) => ({ drafts })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyMembersNames)
)
