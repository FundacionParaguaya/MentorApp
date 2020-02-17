import React, { Component } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import SignatureCanvas from 'react-native-signature-canvas'
import { connect } from 'react-redux'
import { getTotalEconomicScreens } from './helpers'
import { updateDraft } from '../../redux/actions'
import { withNamespaces } from 'react-i18next'
import ProgressBar from '../../components/ProgressBar'

export class SigIn extends Component {
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')

  // the draft is not mutated in this screen (only its progress),
  // we need it for progress bar
  draft = this.props.drafts.find(draft => draft.draftId === this.draftId)

  isEmpty = true

  onPressBack = () => {
    this.props.navigation.goBack()
  }

  componentDidMount() {
    if (this.draft.progress.screen !== 'SignIn') {
      this.props.updateDraft({
        ...this.draft,
        progress: {
          ...this.draft.progress,
          screen: 'SignIn'
        }
      })
    }

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  handleContinue = () => {
    if (!this.isEmpty) {
      this.props.navigation.push('Final', {
        familyLifemap: this.draft,
        draft: this.draft,
        draftId: this.draftId,
        survey: this.survey
      })
    }
  }

  onSave = img => {
    this.isEmpty = false
    let updatedDraft = this.draft
    updatedDraft.sign = img
    this.props.updateDraft(updatedDraft)
    this.handleContinue()
  }

  onClear = () => {
    this.isEmpty = true
    this.props.updateDraft({
      ...this.draft,
      sign: ''
    })
  }

  customHtml = () => {}

  render() {
    const { t } = this.props
    const style = `.m-signature-pad--footer
        .button {
          background-color: #50AA47;
          color: #FFF;
        }
        .button.clear {
            background-color: #E6E4E2;
            color: #FFF;
          }`
    return (
      <View style={{ flex: 1 }}>
        <ProgressBar
          progress={
            ((this.draft.familyData.countFamilyMembers > 1 ? 4 : 3) +
              getTotalEconomicScreens(this.survey)) /
            this.draft.progress.total
          }
          currentScreen={'Signin'}
        />
        <View style={{ ...styles.iconPriorityBorder }} variant="stretch">
          <Image
            style={{ ...styles.iconPriority }}
            source={require('../../../assets/images/pen_icon.png')}
          />
        </View>
        <SignatureCanvas
          onOK={this.onSave}
          onEmpty={this.onClear}
          descriptionText=""
          clearText={t('views.sign.erase')}
          confirmText={t('general.continue')}
          webStyle={style}
          autoClear={false}
          customHtml={this.customHtml}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  iconPriorityBorder: {
    backgroundColor: '#FFFFFF',
    minWidth: 90,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-2%',
    position: 'relative'
  },
  iconPriority: {
    height: 40,
    width: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  }
})

SigIn.propTypes = {
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
  )(SigIn)
)
