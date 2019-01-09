import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import RoundImage from '../../components/RoundImage'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'

import globalStyles from '../../globalStyles'
import { submitDraft } from '../../redux/actions'
import { url } from '../../config'

export class Final extends Component {
  draftId = this.props.navigation.getParam('draftId')
  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  render() {
    const { t } = this.props
    const draft = this.props.drafts.filter(
      item => item.draftId === this.draftId
    )[0]

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
            questions={draft.indicatorSurveyDataList}
            priorities={draft.priorities}
            achievements={draft.achievements}
          />
        </View>
        <View style={{ height: 50 }}>
          <Button
            colored
            text={t('general.close')}
            handleClick={() => {
              this.props.submitDraft(
                url[this.props.env],
                this.props.user.token,
                this.draftId,
                draft
              )
              this.props.navigation.popToTop()
              this.props.navigation.navigate('Dashboard')
            }}
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
  drafts: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  submitDraft: PropTypes.func.isRequired
}

const mapStateToProps = ({ drafts, env, user }) => ({
  env,
  drafts,
  user
})
const mapDispatchToProps = {
  submitDraft
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Final)
)
