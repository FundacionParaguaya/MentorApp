import React, { Component } from 'react'
import { StyleSheet, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { addDraftProgress } from '../../redux/actions'
import StickyFooter from '../../components/StickyFooter'
import SkippedListItem from '../../components/SkippedListItem'

export class Skipped extends Component {
  draftId = this.props.navigation.getParam('draftId')
  survey = this.props.navigation.getParam('survey')
  indicatorsArray = this.survey.surveyStoplightQuestions.map(
    item => item.codeName
  )
  state = { tipIsVisible: true }

  componentDidMount() {
    this.props.addDraftProgress(this.draftId, {
      screen: 'Skipped'
    })
    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    const draft = this.getDraft()
    this.props.addDraftProgress(this.draftId, {
      current: draft.progress.total - 2
    })

    this.props.navigation.navigate('Question', {
      draftId: this.draftId,
      survey: this.survey,
      step: this.survey.surveyStoplightQuestions.length - 1
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  handleClick = () => {
    this.props.navigation.replace('Overview', {
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

  getDraft = () => this.props.drafts.find(item => item.draftId === this.draftId)

  render() {
    const { t } = this.props
    const draft = this.getDraft()

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
        progress={draft ? (draft.progress.total - 1) / draft.progress.total : 0}
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
              item={
                this.survey.surveyStoplightQuestions.filter(
                  question => question.codeName === item.key
                )[0].questionText
              }
              handleClick={() =>
                this.props.navigation.push('Question', {
                  draftId: this.draftId,
                  survey: this.survey,
                  step: this.indicatorsArray.indexOf(item.key),
                  skipped: true
                })
              }
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
  drafts: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapStateToProps = ({ drafts }) => ({
  drafts
})

const mapDispatchToProps = {
  addDraftProgress
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Skipped)
)
