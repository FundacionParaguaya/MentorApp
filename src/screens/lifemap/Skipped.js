import React, { Component } from 'react'
import { StyleSheet, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { addDraftProgress } from '../../redux/actions'
import StickyFooter from '../../components/StickyFooter'
import Tip from '../../components/Tip'
import SkippedListItem from '../../components/SkippedListItem'
import globalStyles from '../../globalStyles'

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
    this.props.navigation.navigate('Question', {
      draftId: this.draftId,
      survey: this.survey,
      step: this.survey.surveyStoplightQuestions.length - 1
    })
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  handleClick = () =>
    this.props.navigation.navigate('Overview', {
      draftId: this.draftId,
      survey: this.survey,
      resumeDraft: false
    })

  onTipClose = () => {
    this.setState({
      tipIsVisible: false
    })
  }

  render() {
    const { t } = this.props
    const draft = this.props.drafts.find(item => item.draftId === this.draftId)

    const skippedQuestions = draft.indicatorSurveyDataList.filter(
      question => question.value === 0
    )
    return (
      <Tip
        title={t('views.lifemap.youSkipped')}
        description={t('views.lifemap.whyNotTryAgain')}
        visible={this.state.tipIsVisible}
        onTipClose={this.onTipClose}
      >
        <StickyFooter
          handleClick={this.handleClick}
          continueLabel={t('general.continue')}
          visible={!this.state.tipIsVisible}
        >
          <Image
            style={styles.image}
            source={require('../../../assets/images/skipped.png')}
          />

          <FlatList
            style={{ ...styles.background, paddingLeft: 25 }}
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
      </Tip>
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
