import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Divider } from 'react-native-elements'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import TextInput from '../../components/TextInput'

export class AddAchievement extends Component {
  errorsDetected = []
  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')
  state = {
    action: '',
    roadmap: '',
    errorsDetected: [],
    showErrors: false,
    indicator: this.props.navigation.getParam('indicator') || '',
    draft:
      this.props.navigation.getParam('familyLifemap') ||
      this.props.navigation.getParam('draft') ||
      {}
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

  componentDidMount() {
    const achievement = this.getAchievementValue(this.state.draft)
    this.setState(achievement)

    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft,
      withoutCloseButton: this.readOnly ? false : true
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  addAchievement = () => {
    if (this.errorsDetected.length) {
      this.setState({
        showErrors: true
      })
    } else {
      const { action, roadmap, indicator, draft } = this.state

      const achievements = draft.achievements

      const item = achievements.find(item => item.indicator === indicator)

      let updatedDraft = draft

      // If item exists update it
      if (item) {
        const index = achievements.indexOf(item)
        updatedDraft = {
          ...draft,
          achievements: [
            ...achievements.slice(0, index),
            { action, roadmap, indicator },
            ...achievements.slice(index + 1)
          ]
        }
      } else {
        // If item does not exist create it
        updatedDraft = {
          ...draft,
          achievements: [...achievements, { action, roadmap, indicator }]
        }
      }

      this.props.navigation.replace('Overview', {
        resumeDraft: false,
        draft: updatedDraft,
        survey: this.survey
      })
    }
  }

  getAchievementValue = data => {
    const achievement = data.achievements.find(
      achievement => achievement.indicator === this.state.indicator
    )

    return achievement || this.state
  }

  render() {
    const { t } = this.props
    const { showErrors, draft } = this.state
    const achievement = this.getAchievementValue(draft)

    return (
      <StickyFooter
        continueLabel={t('general.save')}
        handleClick={this.addAchievement}
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
              name="stars"
              color={colors.blue}
              size={17}
              style={{ marginRight: 10, marginLeft: -10 }}
            />
            <Text style={globalStyles.h3}>
              {t('views.lifemap.achievement')}
            </Text>
          </View>
        </View>
        <TextInput
          field="action"
          required
          readonly={this.readonly}
          showErrors={showErrors}
          detectError={this.detectError}
          onChangeText={text => this.setState({ action: text })}
          placeholder={
            this.state.action ? '' : t('views.lifemap.writeYourAnswerHere')
          }
          label={t('views.lifemap.howDidYouGetIt')}
          value={achievement ? achievement.action : ''}
          multiline
        />
        <TextInput
          label={t('views.lifemap.whatDidItTakeToAchieveThis')}
          onChangeText={text => this.setState({ roadmap: text })}
          placeholder={
            this.state.roadmap ? '' : t('views.lifemap.writeYourAnswerHere')
          }
          readonly={this.readonly}
          value={achievement ? achievement.roadmap : ''}
          multiline
        />
      </StickyFooter>
    )
  }
}

AddAchievement.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(AddAchievement)
