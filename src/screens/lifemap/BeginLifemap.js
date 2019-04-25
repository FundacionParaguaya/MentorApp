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
import { getDraft } from './helpers'

export class BeginLifemap extends Component {
  numberOfQuestions = this.props.nav.survey.surveyStoplightQuestions.length

  componentDidMount() {
    this.props.addDraftProgress(this.props.nav.draftId, {
      screen: 'BeginLifemap'
    })

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    const draft = getDraft()

    this.props.addDraftProgress(this.props.nav.draftId, {
      current: draft.progress.current - 1
    })

    this.props.navigation.replace('SocioEconomicQuestion', {
      fromBeginLifemap: true
    })
  }

  handleClick = () => {
    const draft = getDraft()

    this.props.addDraftProgress(this.props.nav.draftId, {
      current: draft.progress.current + 1
    })

    this.props.navigation.navigate('Question', {
      step: 0
    })
  }

  render() {
    const { t } = this.props
    const draft = getDraft()
    return (
      <StickyFooter
        handleClick={this.handleClick}
        continueLabel={t('general.continue')}
        progress={draft ? draft.progress.current / draft.progress.total : 0}
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
              this.numberOfQuestions
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
  nav: PropTypes.object.isRequired,
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
