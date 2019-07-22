import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StackActions, NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { Text, StyleSheet, View, Platform } from 'react-native'
import { updateDraft, deleteDraft } from '../../redux/actions'
import Popup from '../../components/Popup'
import Button from '../../components/Button'
import i18n from '../../i18n'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'

const demoDrafts = [
  { id: 19, title: 'Stoplight Demo - Spanish' },
  { id: 20, title: 'Stoplight Demo - English' },
  { id: 22, title: 'UK - SHORT DEMO' }
]

export class ExitDraftModal extends Component {
  handleClickOnYes = () => {
    const { navigation } = this.props
    const draft = navigation.getParam('draft')
    const isNewDraft = navigation.getParam('isNewDraft')
    const screen = navigation.getParam('screen')
    const survey = navigation.getParam('survey')
    const isDemoDraft = demoDrafts.some(
      d => d.id === draft.surveyId && d.title === survey.title
    )

    // update draft in store on exit if it's not demo else delete it
    if (draft && !isNewDraft && !isDemoDraft) {
      this.props.updateDraft(draft.draftId, draft)
    } else if (isDemoDraft) {
      this.props.deleteDraft(draft.draftId)
    }

    // reset stack
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'drawerStack' })]
    })

    this.props.navigation.dispatch(resetAction)

    // navigate to appropriate screen if present in params
    if (screen) {
      this.props.navigation.navigate(screen)
    }
  }

  onClose = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { navigation } = this.props

    const draft = navigation.getParam('draft')
    const isNewDraft = navigation.getParam('isNewDraft')

    return (
      <Popup isOpen onClose={this.onClose}>
        {!draft || isNewDraft ? (
          <View>
            <Text style={[globalStyles.centerText, globalStyles.h3]}>
              {isNewDraft
                ? i18n.t('views.modals.lifeMapWillNotBeSaved')
                : i18n.t('views.modals.weCannotContinueToCreateTheLifeMap')}
            </Text>
            <Text style={[globalStyles.centerText, styles.subline]}>
              {i18n.t('views.modals.areYouSureYouWantToExit')}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={[globalStyles.centerText, globalStyles.h3]}>
              {i18n.t('views.modals.yourLifemapIsNotComplete')}
            </Text>
            <Text style={[globalStyles.centerText, styles.subline]}>
              {i18n.t('views.modals.thisWillBeSavedAsADraft')}
            </Text>
          </View>
        )}

        <View style={styles.buttonBar}>
          <Button
            outlined
            text={i18n.t('general.yes')}
            style={{ width: 107 }}
            handleClick={this.handleClickOnYes}
          />
          <Button
            outlined
            text={i18n.t('general.no')}
            style={{ width: 107 }}
            handleClick={this.onClose}
          />
        </View>
      </Popup>
    )
  }
}

ExitDraftModal.propTypes = {
  navigation: PropTypes.object.isRequired,
  updateDraft: PropTypes.func.isRequired,
  deleteDraft: PropTypes.func.isRequired,
  routeName: PropTypes.string
}

const styles = StyleSheet.create({
  subline: {
    marginTop: 15,
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins',
        fontWeight: '500'
      },
      android: {
        fontFamily: 'Poppins Medium'
      }
    }),
    fontSize: 16,
    lineHeight: 20,
    color: colors.grey
  },
  buttonBar: {
    flexDirection: 'row',
    marginTop: 33,
    justifyContent: 'space-between'
  }
})

const mapDispatchToProps = {
  updateDraft,
  deleteDraft
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(ExitDraftModal)
