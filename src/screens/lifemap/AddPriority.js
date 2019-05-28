import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-elements'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import TextInput from '../../components/TextInput'
import Counter from '../../components/Counter'

export class AddPriority extends Component {
  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')
  state = {
    reason: '',
    action: '',
    estimatedDate: 0,
    validationError: false,
    indicator: this.props.navigation.getParam('indicator'),
    draft:
      this.props.navigation.getParam('familyLifemap') ||
      this.props.navigation.getParam('draft')
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  editCounter = action => {
    this.setState({
      validationError: false
    })
    if (action === 'minus' && this.state.estimatedDate > 0) {
      return this.setState({ estimatedDate: this.state.estimatedDate - 1 })
    } else if (action === 'plus') {
      return this.setState({ estimatedDate: this.state.estimatedDate + 1 })
    }
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

  addPriority = () => {
    if (!this.state.estimatedDate) {
      this.setState({
        validationError: true
      })
    } else {
      const { reason, action, estimatedDate, indicator, draft } = this.state

      const priorities = draft.priorities

      const item = priorities.filter(
        item => item.indicator === action.payload.indicator
      )[0]

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
    const priority = data.priorities.filter(
      priority =>
        priority.indicator === this.props.navigation.getParam('indicator')
    )
    return priority[0] ? priority[0] : this.state
  }

  render() {
    const { t } = this.props
    const { validationError, reason, action, estimatedDate, draft } = this.state
    const priority = this.getPriorityValue(draft)

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
        <View style={{ padding: 15 }}>
          <Counter
            editCounter={this.editCounter}
            count={estimatedDate}
            text={t('views.lifemap.howManyMonthsWillItTake')}
            readonly={this.readonly}
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
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(AddPriority)
