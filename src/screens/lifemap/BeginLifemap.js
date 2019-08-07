import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Decoration from '../../components/decoration/Decoration'
import PropTypes from 'prop-types'
import RoundImage from '../../components/RoundImage'
import StickyFooter from '../../components/StickyFooter'
import { connect } from 'react-redux'
import { getTotalEconomicScreens } from './helpers'
import globalStyles from '../../globalStyles'
import { updateDraft } from '../../redux/actions'
import { withNamespaces } from 'react-i18next'

export class BeginLifemap extends Component {
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')

  // the draft is not mutated in this screen (only its progress),
  // we need it for progress bar
  draft = this.props.drafts.find(draft => draft.draftId === this.draftId)

  onPressBack = () => {
    const previousPage =
      this.survey.surveyEconomicQuestions &&
      this.survey.surveyEconomicQuestions.length
        ? 'SocioEconomicQuestion'
        : 'Location'

    this.props.navigation.navigate(previousPage, {
      fromBeginLifemap: true,
      survey: this.survey,
      draftId: this.draftId
    })
  }

  onContinue = () => {
    this.props.navigation.navigate('Question', {
      step: 0,
      survey: this.survey,
      draftId: this.draftId
    })
  }

  componentDidMount() {
    if (this.draft.progress.screen !== 'BeginLifemap') {
      this.props.updateDraft({
        ...this.draft,
        progress: {
          ...this.draft.progress,
          screen: 'BeginLifemap'
        }
      })
    }

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  render() {
    const { t } = this.props
    return (
      <StickyFooter
        onContinue={this.onContinue}
        continueLabel={t('general.continue')}
        progress={
          ((this.draft.familyData.countFamilyMembers > 1 ? 4 : 3) +
            getTotalEconomicScreens(this.survey)) /
          this.draft.progress.total
        }
      >
        <View
          style={{
            ...globalStyles.container,
            padding: 0
          }}
        >
          <Text id="label" style={{ ...globalStyles.h3, ...styles.text }}>
            {t('views.lifemap.thisLifeMapHas').replace(
              '%n',
              this.survey.surveyStoplightQuestions.length
            )}
          </Text>
          <Decoration variation="terms">
            <RoundImage source="stoplight" />
          </Decoration>
        </View>
        <View style={{ height: 50 }} />
      </StickyFooter>
    )
  }
}
const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 80,
    paddingBottom: 30
  }
})

BeginLifemap.propTypes = {
  t: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
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
  )(BeginLifemap)
)
