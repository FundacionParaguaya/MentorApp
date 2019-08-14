import { FlatList, Image, StyleSheet } from 'react-native'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import SkippedListItem from '../../components/SkippedListItem'
import StickyFooter from '../../components/StickyFooter'
import { connect } from 'react-redux'
import { getTotalScreens } from './helpers'
import { updateDraft } from '../../redux/actions'
import { withNamespaces } from 'react-i18next'

export class Skipped extends Component {
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')
  readOnly = this.props.navigation.getParam('readOnly')

  indicatorsArray = this.props.navigation
    .getParam('survey')
    .surveyStoplightQuestions.map(item => item.codeName)

  state = { tipIsVisible: true }

  getDraft = () =>
    this.props.drafts.find(draft => draft.draftId === this.draftId)

  navigateToSkipped = item => {
    this.props.navigation.replace('Question', {
      draftId: this.draftId,
      survey: this.survey,
      step: this.indicatorsArray.indexOf(item.codeName),
      answeringSkipped: true
    })
  }

  onPressBack = () => {
    this.props.navigation.navigate('Question', {
      step: this.survey.surveyStoplightQuestions.length - 1,
      draftId: this.draftId,
      survey: this.survey
    })
  }

  handleClick = () => {
    this.props.navigation.navigate('Overview', {
      draftId: this.draftId,
      survey: this.survey,
      resumeDraft: false
    })
  }

  onTipClose = () => {
    this.setState({
      tipIsVisible: false
    })
  }

  componentDidMount() {
    const draft = this.getDraft()

    if (draft.progress.screen !== 'Skipped') {
      this.props.updateDraft({
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'Skipped',
          total: getTotalScreens(this.survey)
        }
      })
    }

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }

  render() {
    const { t } = this.props
    const draft = this.getDraft()

    const skippedQuestions =
      (draft &&
        draft.indicatorSurveyDataList &&
        draft.indicatorSurveyDataList.filter(
          question => question.value === 0
        )) ||
      []

    return (
      <StickyFooter
        onContinue={this.handleClick}
        continueLabel={t('general.continue')}
        type={this.state.tipIsVisible ? 'tip' : 'button'}
        tipTitle={t('views.lifemap.youSkipped')}
        tipDescription={t('views.lifemap.whyNotTryAgain')}
        onTipClose={this.onTipClose}
        progress={draft ? (draft.progress.total - 2) / draft.progress.total : 0}
      >
        <Image
          style={styles.image}
          source={require('../../../assets/images/skipped.png')}
        />

        <FlatList
          style={{ ...styles.background }}
          data={skippedQuestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <SkippedListItem
              item={this.survey.surveyStoplightQuestions.find(
                question => question.codeName === item.key
              )}
              handleClick={this.navigateToSkipped}
            />
          )}
        />
      </StickyFooter>
    )
  }
}

const styles = StyleSheet.create({
  image: { alignSelf: 'center', marginVertical: 50 }
})

Skipped.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  updateDraft: PropTypes.func.isRequired,
  drafts: PropTypes.array.isRequired
}

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = ({ drafts }) => ({ drafts })

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Skipped)
)
