import React, { Component } from 'react'
import { StyleSheet, Image, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import StickyFooter from '../../components/StickyFooter'
import SkippedListItem from '../../components/SkippedListItem'
import { getTotalScreens } from './helpers'

export class Skipped extends Component {
  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')
  indicatorsArray = this.props.navigation
    .getParam('survey')
    .surveyStoplightQuestions.map(item => item.codeName)
  state = { tipIsVisible: true, draft: this.props.navigation.getParam('draft') }

  componentDidMount() {
    const { draft } = this.state

    this.setState({
      draft: {
        ...draft,
        progress: {
          ...draft.progress,
          screen: 'Skipped',
          total: getTotalScreens(this.survey)
        }
      }
    })

    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft,
      onPressBack: this.onPressBack
    })
  }

  navigateToSkipped = item => {
    this.props.navigation.push('Question', {
      draft: this.state.draft,
      survey: this.survey,
      step: this.indicatorsArray.indexOf(item.codeName),
      skipped: true
    })
  }

  onPressBack = () => {
    this.props.navigation.navigate('Question', {
      step: this.survey.surveyStoplightQuestions.length - 1,
      draft: this.state.draft,
      survey: this.survey
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  handleClick = () => {
    this.props.navigation.replace('Overview', {
      draft: this.state.draft,
      survey: this.survey,
      resumeDraft: false
    })
  }

  onTipClose = () => {
    this.setState({
      tipIsVisible: false
    })
  }

  render() {
    const { t } = this.props
    const { draft } = this.state

    const skippedQuestions = draft.indicatorSurveyDataList.filter(
      question => question.value === 0
    )

    return (
      <StickyFooter
        handleClick={this.handleClick}
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
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(Skipped)
