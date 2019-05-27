import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-elements'
import { withNamespaces } from 'react-i18next'
import { addSurveyPriorityAcheivementData } from '../../redux/actions'
import StickyFooter from '../../components/StickyFooter'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import TextInput from '../../components/TextInput'
import { getDraft } from './helpers'
import Select from '../../components/Select'
export class AddPriority extends Component {
  errorsDetected = []
  state = {
    reason: '',
    action: '',
    estimatedDate: null,
    validationError: false,
    indicator: this.props.navigation.getParam('indicator'),
    showErrors: false,
    errorsDetected: []
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  editCounter = action => {
    this.setState({
      validationError: false
    })

    return this.setState({ estimatedDate: action })
  }

  componentDidMount() {
    const draft = this.getData()
    const priority = this.getPriorityValue(draft)

    this.setState(priority)

    this.props.navigation.setParams({
      withoutCloseButton: this.props.nav.draftId ? false : true
    })
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

  getData = () =>
    this.props.nav.draftId
      ? getDraft()
      : this.props.navigation.getParam('familyLifemap')

  addPriority = () => {
    if (!this.state.estimatedDate) {
      this.setState({
        validationError: true
      })
    } else {
      const { reason, action, estimatedDate, indicator } = this.state
      this.props.addSurveyPriorityAcheivementData({
        id: this.props.nav.draftId,
        category: 'priorities',
        payload: { reason, action, estimatedDate, indicator }
      })
      this.props.navigation.replace('Overview', {
        resumeDraft: false
      })
    }
  }

  getPriorityValue = data => {
    const priority = data.priorities.filter(
      priority =>
        priority.indicator === this.props.navigation.getParam('indicator')
    )
    return priority[0] ? priority[0] : this.state
  }

  render() {
    const { t } = this.props
    const { validationError, reason, action, estimatedDate } = this.state
    const data = this.getData()
    const priority = this.getPriorityValue(data)
    const { draftId, readonly } = this.props.nav
    const { showErrors } = this.state
    let allOptionsNums = []
    for (let x = 1; x < 25; x++) {
      allOptionsNums.push({ value: x, text: String(x) })
    }
    return (
      <StickyFooter
        continueLabel={t('general.save')}
        handleClick={this.addPriority}
        visible={!!draftId}
      >
        <View style={globalStyles.container}>
          <Text style={globalStyles.h2}>
            {this.props.navigation.getParam('indicatorText')}
          </Text>
          <Divider
            style={{ backgroundColor: colors.palegrey, marginVertical: 10 }}
          />
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            <Icon
              name="pin"
              color={colors.blue}
              size={17}
              style={{ marginRight: 10, marginLeft: -10 }}
            />
            <Text style={globalStyles.h3}>{t('views.lifemap.priority')}</Text>
          </View>
        </View>
        <TextInput
          onChangeText={text => this.setState({ reason: text })}
          placeholder={reason ? '' : t('views.lifemap.writeYourAnswerHere')}
          label={t('views.lifemap.whyDontYouHaveIt')}
          value={priority ? priority.reason : ''}
          multiline
          readonly={readonly}
        />
        <TextInput
          label={t('views.lifemap.whatWillYouDoToGetIt')}
          onChangeText={text => this.setState({ action: text })}
          placeholder={action ? '' : t('views.lifemap.writeYourAnswerHere')}
          value={priority ? priority.action : ''}
          multiline
          readonly={readonly}
        />
        <View>
          <Select
            id="howManyMonthsWillItTake"
            required
            onChange={this.editCounter}
            readonly={readonly}
            label={t('views.lifemap.howManyMonthsWillItTake')}
            placeholder={t('views.lifemap.howManyMonthsWillItTake')}
            field="howManyMonthsWillItTake"
            value={this.state.estimatedDate || ''}
            detectError={this.detectError}
            showErrors={showErrors}
            options={allOptionsNums}
          />
        </View>
        {/* Error message */}
        {validationError ? (
          <Text style={{ paddingHorizontal: 15, color: colors.red }}>
            {t('validation.fieldIsRequired')}
          </Text>
        ) : (
          <View />
        )}
      </StickyFooter>
    )
  }
}

AddPriority.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  addSurveyPriorityAcheivementData: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addSurveyPriorityAcheivementData
}

const mapStateToProps = ({ nav }) => ({
  nav
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddPriority)
)
