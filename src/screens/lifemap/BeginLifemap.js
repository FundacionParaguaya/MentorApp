import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import Decoration from '../../components/decoration/Decoration'
import globalStyles from '../../globalStyles'
import RoundImage from '../../components/RoundImage'
import StickyFooter from '../../components/StickyFooter'
import { addDraftProgress } from '../../redux/actions'
import { getTotalEconomicScreens } from './helpers'

export class BeginLifemap extends Component {
  survey = this.props.navigation.getParam('survey')
  draft = this.props.navigation.getParam('draft')
  readOnly = this.props.navigation.getParam('readOnly')

  componentDidMount() {
    this.props.navigation.setParams({
      getCurrentDraftState: () => this.draft
    })

    this.props.addDraftProgress(this.draft.draftId, {
      screen: 'BeginLifemap'
    })

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    this.props.navigation.replace('SocioEconomicQuestion', {
      fromBeginLifemap: true,
      survey: this.survey,
      draft: this.draft
    })
  }

  handleClick = () => {
    this.props.navigation.navigate('Question', {
      step: 0,
      survey: this.survey,
      draft: this.draft
    })
  }

  render() {
    const { t } = this.props
    return (
      <StickyFooter
        handleClick={this.handleClick}
        continueLabel={t('general.continue')}
        progress={
          this.draft
            ? ((this.draft.familyData.countFamilyMembers > 1 ? 4 : 3) +
                getTotalEconomicScreens(this.survey)) /
              this.draft.progress.total
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
  navigation: PropTypes.object.isRequired,
  addDraftProgress: PropTypes.func.isRequired
}

const mapDispatchToProps = {
  addDraftProgress
}

const mapStateToProps = ({ nav }) => ({
  nav
})

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BeginLifemap)
)
