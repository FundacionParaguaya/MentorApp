import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { withNamespaces } from 'react-i18next'
import Button from '../../components/Button'
import Select from '../../components/Select'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'
import { updateDraft } from '../../redux/actions'
import { connect } from 'react-redux'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import Popup from '../../components/Popup'
import TextInput from '../../components/TextInput'
import Orb from '../../components/decoration/Orb'

export class AddPriorityAndAchievementModal extends Component {
  errorsDetected = []
  state = {
    allOptionsNums: [],
    colorRBG: '',
    reason: '',
    action: '',
    roadmap: '',
    validationError: false,
    errorsDetected: [],
    showErrors: false,
    indicator: this.props.indicator || '',
    draft: this.props.draft || {},
    estimatedDate: null
  }
  editCounter = action => {
    this.setState({
      validationError: false
    })

    return this.setState({ estimatedDate: action })
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

      //Updating the draft
      this.props.updateDraft(updatedDraft.draftId, updatedDraft)
      //updateDraftGlobal is requered in order to immediately add the pin to the  question in Priorities.js component (it changes the state there),this way everything can be updated without refreshind the screen
      this.props.updateDraftGlobal(updatedDraft)
      //closing the modal
      this.props.onClose()
    }
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
      //Updating the draft
      this.props.updateDraft(updatedDraft.draftId, updatedDraft)
      //updateDraftGlobal is requered in order to immediately add the pin to the  question in Priorities.js component (it changes the state there),this way everything can be updated without refreshind the screen
      this.props.updateDraftGlobal(updatedDraft)
      //closing the modal
      this.props.onClose()
    }
  }

  componentDidMount() {
    if (this.props.color === 3) {
      const achievement = this.getAchievementValue(this.state.draft)
      this.setState({
        colorRBG: colors.palegreen,
        action: achievement.action,
        roadmap: achievement.roadmap,
        indicator: achievement.indicator
      })
    } else {
      const priority = this.getPriorityValue(this.state.draft)
      let allOptionsNums = []
      for (let x = 1; x < 25; x++) {
        allOptionsNums.push({ value: x, text: String(x) })
      }
      this.setState({
        estimatedDate: priority.estimatedDate,
        colorRBG: this.props.color === 1 ? colors.palered : colors.palegold,
        allOptionsNums: allOptionsNums,
        action: priority.action,
        reason: priority.reason,
        indicator: priority.indicator
      })
    }
  }
  getPriorityValue = data => {
    const priority = data.priorities.find(
      priority => priority.indicator === this.state.indicator
    )
    return priority || this.state
  }
  getAchievementValue = data => {
    const achievement = data.achievements.find(
      achievement => achievement.indicator === this.state.indicator
    )

    return achievement || this.state
  }

  render() {
    const { t } = this.props
    const { validationError, estimatedDate, draft, showErrors } = this.state

    //i cound directly use this.state.action for the values below but it just doesnt work.Thats why i use the old way from the old components
    let priority
    let achievement
    if (this.props.color === 1) {
      priority = this.getPriorityValue(draft)
    } else {
      achievement = this.getAchievementValue(draft)
    }

    return (
      <Popup isOpen priorOrAchievement onClose={this.props.onClose}>
        <View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20
              }}
            >
              <Orb
                size={55}
                color={this.state.colorRBG}
                position={{ x: 0, y: 0 }}
              />
              <View
                style={{
                  ...styles.blueIcon,
                  backgroundColor: colors.blue,
                  width: 30,
                  height: 30,
                  marginLeft: 35,
                  marginBottom: 22,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon2
                  name={this.props.color === 3 ? 'star' : 'pin'}
                  color={colors.white}
                  size={20}
                />
              </View>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20
              }}
            >
              <Text style={globalStyles.h2}>{this.props.indicatorText}</Text>
            </View>
          </View>
          {/* load the qustions for priorities if 3 or 2 and achievemnt if 1*/}
          {this.props.color !== 3 ? (
            <React.Fragment>
              <TextInput
                onChangeText={text => this.setState({ reason: text })}
                placeholder={t('views.lifemap.whyDontYouHaveIt')}
                value={priority ? priority.reason : ''}
                multiline
                readonly={draft.status !== 'Synced' ? false : true}
              />
              <TextInput
                onChangeText={text => this.setState({ action: text })}
                placeholder={t('views.lifemap.whatWillYouDoToGetIt')}
                value={priority ? priority.action : ''}
                multiline
                readonly={draft.status !== 'Synced' ? false : true}
              />
              <View>
                <Select
                  id="howManyMonthsWillItTake"
                  required
                  onChange={this.editCounter}
                  readonly={draft.status !== 'Synced' ? false : true}
                  placeholder={t('views.lifemap.howManyMonthsWillItTake')}
                  field="howManyMonthsWillItTake"
                  value={estimatedDate || ''}
                  detectError={this.detectError}
                  showErrors={showErrors}
                  options={this.state.allOptionsNums}
                />
              </View>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TextInput
                field="action"
                readonly={draft.status !== 'Synced' ? false : true}
                onChangeText={text => this.setState({ action: text })}
                placeholder={t('views.lifemap.howDidYouGetIt')}
                value={achievement ? achievement.action : ''}
                required
                detectError={this.detectError}
                showErrors={showErrors}
                multiline
              />

              <TextInput
                onChangeText={text => this.setState({ roadmap: text })}
                placeholder={t('views.lifemap.whatDidItTakeToAchieveThis')}
                readonly={draft.status !== 'Synced' ? false : true}
                value={achievement ? achievement.roadmap : ''}
                multiline
              />
            </React.Fragment>
          )}

          {validationError ? (
            <Text style={{ paddingHorizontal: 15, color: colors.red }}>
              {t('validation.fieldIsRequired')}
            </Text>
          ) : (
            <View />
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                minWidth: 230
              }}
            >
              {draft.status !== 'Synced' ? (
                <Button
                  id="save-achievementOrPriority"
                  style={{
                    marginTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10
                  }}
                  colored
                  text={
                    this.props.color !== 3
                      ? t('views.lifemap.makePriority')
                      : t('views.lifemap.makeAchievement')
                  }
                  handleClick={
                    this.props.color !== 3
                      ? this.addPriority
                      : this.addAchievement
                  }
                />
              ) : null}
            </View>
          </View>
        </View>
      </Popup>
    )
  }
}
AddPriorityAndAchievementModal.propTypes = {
  t: PropTypes.func.isRequired,
  indicatorText: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  updateDraftGlobal: PropTypes.func,
  draft: PropTypes.object,
  color: PropTypes.number,
  onClose: PropTypes.func,
  updateDraft: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  blueIcon: {
    borderRadius: 100,
    zIndex: 10
  }
})

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = () => ({})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddPriorityAndAchievementModal)
)
