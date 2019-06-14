import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import RoundImage from '../../components/RoundImage'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'
import globalStyles from '../../globalStyles'
import { updateDraft, submitDraft } from '../../redux/actions'
import { url } from '../../config'

export class Final extends Component {
  survey = this.props.navigation.getParam('survey')
  draft = this.props.navigation.getParam('draft')
  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  componentDidMount() {
    this.props.updateDraft(this.draft.draftId, this.draft)
    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    this.props.navigation.replace('Overview', {
      resumeDraft: false
    })
  }

  saveDraft = () => {
    this.props.submitDraft(
      url[this.props.env],
      this.props.user.token,
      this.draft.draftId,
      this.draft
    )
    this.props.navigation.popToTop()
    this.props.navigation.navigate('Dashboard')
  }

  render() {
    const { t } = this.props

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View
          style={{
            ...globalStyles.container
          }}
        >
          <Text style={{ ...globalStyles.h1, ...styles.text }}>
            {t('views.lifemap.great')}
          </Text>
          <Text
            style={{
              ...globalStyles.h3,
              ...styles.text,
              paddingBottom: 30
            }}
          >
            {t('views.lifemap.youHaveCompletedTheLifemap')}
          </Text>
          <RoundImage source="partner" />
          <LifemapVisual
            bigMargin
            questions={this.draft.indicatorSurveyDataList}
            questionsLength={this.survey.surveyStoplightQuestions.length}
            priorities={this.draft.priorities}
            achievements={this.draft.achievements}
          />
        </View>
        <View style={{ height: 50 }}>
          <Button
            colored
            text={t('general.close')}
            handleClick={this.saveDraft}
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
  },
  text: {
    textAlign: 'center'
  }
})

Final.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  updateDraft: PropTypes.func.isRequired,
  submitDraft: PropTypes.func.isRequired,
  env: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = ({ env, user }) => ({
  env,
  user
})
const mapDispatchToProps = {
  submitDraft,
  updateDraft
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Final)
)
