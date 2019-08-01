import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-elements'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import TextInput from '../../components/form/TextInput'
import Select from '../../components/form/Select'

export class AddPriority extends Component {
  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')
  errorsDetected = []
  state = {
    reason: '',
    action: '',
    estimatedDate: null,
    validationError: false,
    showErrors: false,
    errorsDetected: [],
    indicator: this.props.navigation.getParam('indicator') || '',
    draft:
      this.props.navigation.getParam('familyLifemap') ||
      this.props.navigation.getParam('draft') ||
      {}
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
    const { draft } = this.state
    const priority = this.getPriorityValue(draft)

    this.setState(priority)

    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft,
      withoutCloseButton: this.readOnly ? false : true
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

  addPriority = () => {
    if (!this.state.estimatedDate) {
      this.setState({
        validationError: true
      })
    } else {
      const { reason, action, estimatedDate, indicator, draft } = this.state
      const priorities = draft.priorities
      const item = priorities.find(item => item.indicator === indicator)
      let updatedDraft = draft

      // If item exists update it
      if (item) {
        const index = priorities.indexOf(item)
        updatedDraft = {
          ...draft,
          priorities: [
            ...priorities.slice(0, index),
            { reason, action, estimatedDate, indicator },
            ...priorities.slice(index + 1)
          ]
        }
      } else {
        // If item does not exist create it
        updatedDraft = {
          ...draft,
          priorities: [
            ...priorities,
            { reason, action, estimatedDate, indicator }
          ]
        }
      }

      this.props.navigation.replace('Overview', {
        draft: updatedDraft,
        survey: this.survey,
        resumeDraft: false
      })
    }
  }

  getPriorityValue = data => {
    const priority = data.priorities.find(
      priority => priority.indicator === this.state.indicator
    )
    return priority ? priority : this.state
  }

  render() {
    const { t } = this.props
    const { validationError, reason, action, estimatedDate, draft } = this.state
    const priority = this.getPriorityValue(draft)
    const { showErrors } = this.state
    let allOptionsNums = []
    for (let x = 1; x < 25; x++) {
      allOptionsNums.push({ value: x, text: String(x) })
    }

    return (
      <StickyFooter
        continueLabel={t('general.save')}
        handleClick={this.addPriority}
        visible={!this.readOnly}
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
          readonly={this.readonly}
        />
        <TextInput
          label={t('views.lifemap.whatWillYouDoToGetIt')}
          onChangeText={text => this.setState({ action: text })}
          placeholder={action ? '' : t('views.lifemap.writeYourAnswerHere')}
          value={priority ? priority.action : ''}
          multiline
          readonly={this.readonly}
        />
        <View>
          <Select
            id="howManyMonthsWillItTake"
            required
            onChange={this.editCounter}
            readonly={this.readOnly}
            label={t('views.lifemap.howManyMonthsWillItTake')}
            placeholder={t('views.lifemap.howManyMonthsWillItTake')}
            field="howManyMonthsWillItTake"
            value={estimatedDate || ''}
            detectError={this.detectError}
            showErrors={showErrors}
            options={allOptionsNums}
          />
        </View>
        {/* Error message */}
        {validationError && !this.state.errorsDetected.length ? (
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
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(AddPriority)
