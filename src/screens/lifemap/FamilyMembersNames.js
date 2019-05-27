import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import colors from '../../theme.json'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import TextInput from '../../components/TextInput'
import Decoration from '../../components/decoration/Decoration'
import globalStyles from '../../globalStyles'
import Select from '../../components/Select'
import DateInput from '../../components/DateInput'
import { getTotalScreens } from './helpers'

export class FamilyMembersNames extends Component {
  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')

  errorsDetected = []
  state = {
    errorsDetected: [],
    showErrors: false,
    draft: this.props.navigation.getParam('draft') || {}
  }

  componentDidMount() {
    const { draft } = this.state

    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft
    })

    if (!this.readonly && draft.progress.screen !== 'FamilyMembersNames') {
      this.setState({
        draft: {
          ...draft,
          progress: {
            ...draft.progress,
            screen: 'FamilyMembersNames',
            total: getTotalScreens(this.survey)
          }
        }
      })
    }

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    this.props.navigation.navigate('FamilyParticipant', {
      draft: this.state.draft,
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
    if (this.state.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.props.navigation.navigate('Location', {
        draft: this.state.draft,
        survey: this.survey
      })
    }
  }

  updateMember = (value, field) => {
    const { draft } = this.state

    // [0] is the index, [1] is the field
    const split = field.split('.')

    this.setState({
      draft: {
        ...draft,
        familyData: {
          ...draft.familyData,
          familyMembersList: draft.familyData.familyMembersList.map(
            (item, index) => {
              if (parseInt(split[0], 10) + 1 === index) {
                return {
                  ...item,
                  [split[1]]: value
                }
              }
              return item
            }
          )
        }
      }
    })
  }

  render() {
    const { t } = this.props
    const { showErrors, draft } = this.state
    let onlyOneAutoFocusCheck = false

    const { familyMembersList } = draft.familyData

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
        progress={draft ? 2 / draft.progress.total : 0}
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
          let firstNameAutoFocus
          if (familyMembersList[i + 1]) {
            if (familyMembersList[i + 1].firstName) {
              firstNameAutoFocus = false
            } else {
              if (!onlyOneAutoFocusCheck) {
                onlyOneAutoFocusCheck = true
                firstNameAutoFocus = true
              }
            }
          } else {
            if (!onlyOneAutoFocusCheck) {
              onlyOneAutoFocusCheck = true
              firstNameAutoFocus = true
            }
          }
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
                autoFocus={firstNameAutoFocus}
                key={i}
                validation="string"
                field={`${i}.firstName`}
                onChangeText={this.updateMember}
                placeholder={`${t('views.family.firstName')}`}
                value={(familyMembersList[i + 1] || {}).firstName || ''}
                required
                detectError={this.detectError}
                showErrors={showErrors}
              />
              <Select
                field={`${i}.gender`}
                onChange={this.updateMember}
                label={t('views.family.gender')}
                placeholder={t('views.family.selectGender')}
                value={(familyMembersList[i + 1] || {}).gender || ''}
                detectError={this.detectError}
                options={this.survey.surveyConfig.gender}
                otherField={`${i}.customGender`}
                otherPlaceholder={t('views.family.specifyGender')}
                otherValue={(familyMembersList[i + 1] || {}).customGender || ''}
              />

              <DateInput
                field={`${i}.birthDate`}
                label={t('views.family.dateOfBirth')}
                detectError={this.detectError}
                showErrors={this.state.showErrors}
                onValidDate={this.updateMember}
                value={(familyMembersList[i + 1] || {}).birthDate}
              />
            </View>
          )
        })}
      </StickyFooter>
    )
  }
}

FamilyMembersNames.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
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

export default withNamespaces()(FamilyMembersNames)
