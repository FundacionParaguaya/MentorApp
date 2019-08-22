import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Orb from '../../components/decoration/Orb'
import Popup from '../../components/Popup'
import PropTypes from 'prop-types'
import Select from '../../components/form/Select'
import StickyFooter from '../../components/StickyFooter'
import TextInput from '../../components/form/TextInput'
import colors from '../../theme.json'
import { connect } from 'react-redux'
import globalStyles from '../../globalStyles'
import { updateDraft } from '../../redux/actions'
import { withNamespaces } from 'react-i18next'

export class AddPriorityAndAchievementModal extends Component {
  draftId = this.props.draftId

  state = {
    allOptionsNums: [],
    colorRBG: '',
    reason: '',
    action: '',
    roadmap: '',
    validationError: false,
    indicator: this.props.indicator || '',
    estimatedDate: null,
    errors: [],
    showErrors: false
  }

  setError = (error, field) => {
    const { errors } = this.state

    if (error && !errors.includes(field)) {
      this.setState(previousState => {
        return {
          ...previousState,
          errors: [...previousState.errors, field]
        }
      })
    } else if (!error) {
      this.setState({
        errors: errors.filter(item => item !== field)
      })
    }
  }

  validateForm = () => {
    if (this.state.errors.length) {
      this.setState({
        showErrors: true
      })
    } else {
      this.onContinue()
    }
  }

  editCounter = action => {
    this.setState({
      validationError: false
    })

    return this.setState({ estimatedDate: action })
  }

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  addPriority = () => {
    const draft = this.getDraft()
    const { reason, action, estimatedDate, indicator } = this.state
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
    this.props.updateDraft(updatedDraft)

    //closing the modal
    this.props.onClose()
  }

  addAchievement = () => {
    const { action, roadmap, indicator } = this.state
    const draft = this.getDraft()
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
    this.props.updateDraft(updatedDraft)
    //closing the modal
    this.props.onClose()
  }

  componentDidMount() {
    const draft = this.getDraft()
    if (this.props.color === 3) {
      const achievement = this.getAchievementValue(draft)
      this.setState({
        colorRBG: colors.palegreen,
        action: achievement.action,
        roadmap: achievement.roadmap,
        indicator: achievement.indicator
      })
    } else {
      const priority = this.getPriorityValue(draft)
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

  onContinue = () => {
    this.props.color !== 3 ? this.addPriority() : this.addAchievement()
  }

  render() {
    const draft = this.getDraft()
    const { t } = this.props
    const { validationError, showErrors } = this.state
    const isReadOnly = draft.status === 'Synced'

    //i cound directly use this.state.action for the values below but
    // it just doesnt work.Thats why i use the old way from the old components
    let priority
    let achievement
    if (this.props.color !== 3) {
      priority = this.getPriorityValue(draft)
    } else {
      achievement = this.getAchievementValue(draft)
    }

    return (
      <Popup isOpen modifiedPopUp onClose={this.props.onClose}>
        <StickyFooter
          onContinue={this.validateForm}
          continueLabel={
            this.props.color !== 3
              ? t('views.lifemap.makePriority')
              : t('views.lifemap.makeAchievement')
          }
          type="button"
          visible={true}
          readonly={isReadOnly}
        >
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
                <View style={styles.blueIcon}>
                  <Icon2
                    name={this.props.color === 3 ? 'star' : 'pin'}
                    color={colors.white}
                    size={20}
                  />
                </View>
              </View>
              <View style={styles.subheading}>
                <Text style={globalStyles.h2}>{this.props.indicatorText}</Text>
              </View>
            </View>
            {/* load the qustions for priorities if 3 or 2 and achievemnt if 1*/}
            {this.props.color !== 3 ? (
              <React.Fragment>
                <TextInput
                  id="whyDontYouHaveIt"
                  onChangeText={text => this.setState({ reason: text })}
                  placeholder={t('views.lifemap.whyDontYouHaveIt')}
                  initialValue={priority ? priority.reason : ''}
                  multiline
                  readonly={!!this.readOnly}
                  showErrors={showErrors}
                  setError={isError =>
                    this.setError(isError, 'whyDontYouHaveIt')
                  }
                />
                <TextInput
                  id="whatWillYouDoToGetIt"
                  onChangeText={text => this.setState({ action: text })}
                  placeholder={t('views.lifemap.whatWillYouDoToGetIt')}
                  initialValue={priority ? priority.action : ''}
                  multiline
                  readonly={!!this.readOnly}
                  showErrors={showErrors}
                  setError={isError =>
                    this.setError(isError, 'whatWillYouDoToGetIt')
                  }
                />
                <View>
                  <Select
                    id="howManyMonthsWillItTake"
                    required
                    onChange={this.editCounter}
                    placeholder={t('views.lifemap.howManyMonthsWillItTake')}
                    initialValue={priority ? priority.estimatedDate : ''}
                    options={this.state.allOptionsNums}
                    readonly={!!this.readOnly}
                    showErrors={showErrors}
                    setError={isError =>
                      this.setError(isError, 'howManyMonthsWillItTake')
                    }
                  />
                </View>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <TextInput
                  id="howDidYouGetIt"
                  onChangeText={text => this.setState({ action: text })}
                  placeholder={t('views.lifemap.howDidYouGetIt')}
                  initialValue={achievement ? achievement.action : ''}
                  required
                  multiline
                  readonly={!!this.readOnly}
                  showErrors={showErrors}
                  setError={isError => this.setError(isError, 'howDidYouGetIt')}
                />

                <TextInput
                  id="whatDidItTakeToAchieveThis"
                  onChangeText={text => this.setState({ roadmap: text })}
                  placeholder={t('views.lifemap.whatDidItTakeToAchieveThis')}
                  initialValue={achievement ? achievement.roadmap : ''}
                  multiline
                  readonly={!!this.readOnly}
                  showErrors={showErrors}
                  setError={isError =>
                    this.setError(isError, 'whatDidItTakeToAchieveThis')
                  }
                />
              </React.Fragment>
            )}

            {validationError ? (
              <Text style={styles.validationText}>
                {t('validation.fieldIsRequired')}
              </Text>
            ) : (
              <View />
            )}
          </View>
        </StickyFooter>
      </Popup>
    )
  }
}
AddPriorityAndAchievementModal.propTypes = {
  t: PropTypes.func.isRequired,
  indicatorText: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  draft: PropTypes.object,
  color: PropTypes.number,
  onClose: PropTypes.func,
  updateDraft: PropTypes.func.isRequired,
  draftId: PropTypes.string,
  drafts: PropTypes.array.isRequired
}

const styles = StyleSheet.create({
  blueIcon: {
    borderRadius: 100,
    zIndex: 10,
    backgroundColor: colors.blue,
    width: 30,
    height: 30,
    marginLeft: 35,
    marginBottom: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subheading: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20
  },
  validationText: {
    paddingHorizontal: 15,
    color: colors.red
  }
})

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = ({ drafts }) => ({ drafts })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddPriorityAndAchievementModal)
)
