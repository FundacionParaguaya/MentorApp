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

  handleClick = () => {
    if (this.state.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.props.navigation.navigate('FamilyGendersBirthdates', {
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
      >
        <View style={styles.circleContainer}>
          <Text style={styles.circle}>+{familyMembersCount.length}</Text>
          <Icon name="face" color={colors.grey} size={61} style={styles.icon} />
        </View>

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
    transform:[{ translateX: 3 },{ translateY: -3 }],
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
