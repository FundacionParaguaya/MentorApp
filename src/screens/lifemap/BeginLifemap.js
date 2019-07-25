import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import Decoration from '../../components/decoration/Decoration'
import globalStyles from '../../globalStyles'
import RoundImage from '../../components/RoundImage'
import StickyFooter from '../../components/StickyFooter'
import { getTotalEconomicScreens } from './helpers'
import { updateDraft } from '../../redux/actions'

export class BeginLifemap extends Component {
  survey = this.props.navigation.getParam('survey')
  readOnly = this.props.navigation.getParam('readOnly')
  state = {
    draft: this.props.navigation.getParam('draft')
  }

  componentDidMount() {
    const { draft } = this.state
    this.props.updateDraft(draft.draftId, draft)
    this.props.navigation.setParams({
      getCurrentDraftState: () => this.state.draft
    })

    if (draft.progress.screen !== 'BeginLifemap') {
      this.setState({
        draft: {
          ...draft,
          progress: {
            ...draft.progress,
            screen: 'BeginLifemap'
          }
        }
      })
    }

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    this.props.navigation.push('SocioEconomicQuestion', {
      fromBeginLifemap: true,
      survey: this.survey,
      draft: this.state.draft
    })
  }

  handleClick = () => {
    this.props.navigation.navigate('Question', {
      step: 0,
      survey: this.survey,
      draft: this.state.draft
    })
  }

  render() {
    const { draft } = this.state
    const { t } = this.props
    return (
      <StickyFooter
        handleClick={this.handleClick}
        continueLabel={t('general.continue')}
        progress={
          draft
            ? ((draft.familyData.countFamilyMembers > 1 ? 4 : 3) +
                getTotalEconomicScreens(this.survey)) /
              draft.progress.total
            : 0
        }
      >
        <View
          style={{
            ...globalStyles.container,
            padding: 0
          }}
        >
          <Text style={{ ...globalStyles.h3, ...styles.text }}>
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
  navigation: PropTypes.object.isRequired
}

const mapDispatchToProps = {
  updateDraft
}

const mapStateToProps = () => ({})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BeginLifemap)
)
