import React, { Component } from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Divider } from 'react-native-elements'
import { withNamespaces } from 'react-i18next'
import { addSurveyPriorityAcheivementData } from '../../redux/actions'

import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import Counter from '../../components/Counter'

export class AddPriority extends Component {
  state = {
    reason: '',
    action: '',
    estimatedDate: 0,
    validationError: false,
    indicator: this.props.navigation.getParam('indicator')
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
    const draft = this.getDraft()
    const priority = this.getPriorityValue(draft)

    this.setState(priority)
  }

  getDraft = () =>
    this.props.drafts.filter(
      draft => draft.draftId === this.props.navigation.getParam('draftId')
    )[0]

  addPriority = () => {
    if (!this.state.estimatedDate) {
      this.setState({
        validationError: true
      })
    } else {
      const { reason, action, estimatedDate, indicator } = this.state
      this.props.addSurveyPriorityAcheivementData({
        id: this.props.navigation.getParam('draftId'),
        category: 'priorities',
        payload: { reason, action, estimatedDate, indicator }
      })
      this.props.navigation.goBack()
    }
  }

  getPriorityValue = draft => {
    const priority = draft.priorities.filter(
      priority =>
        priority.indicator === this.props.navigation.getParam('indicator')
    )
    return priority[0] ? priority[0] : this.state
  }

  render() {
    const { t } = this.props
    const { validationError, reason, action, estimatedDate } = this.state
    const draft = this.getDraft()
    const priority = this.getPriorityValue(draft)

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View>
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
          />
          <TextInput
            label={t('views.lifemap.whatWillYouDoToGetIt')}
            onChangeText={text => this.setState({ action: text })}
            placeholder={action ? '' : t('views.lifemap.writeYourAnswerHere')}
            value={priority ? priority.action : ''}
            multiline
          />
          <View style={{ padding: 15 }}>
            <Counter
              editCounter={this.editCounter}
              count={estimatedDate}
              text={t('views.lifemap.howManyMonthsWillItTake')}
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
        </View>
        <View style={{ height: 50 }}>
          <Button
            colored
            text={t('general.save')}
            handleClick={() => this.addPriority()}
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

AddPriority.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  drafts: PropTypes.array.isRequired,
  addSurveyPriorityAcheivementData: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addSurveyPriorityAcheivementData
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddPriority)
)
