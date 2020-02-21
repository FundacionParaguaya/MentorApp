import React, { Component } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import SignatureCapture from 'react-native-signature-capture'
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
    if (this.draft.progress.screen !== 'Signin') {
      this.props.updateDraft({
        ...this.draft,
        progress: {
          ...this.draft.progress,
          screen: 'Signin'
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
    let updatedDraft = this.draft
    updatedDraft.sign = ''
    this.props.updateDraft(updatedDraft)
  }

  render() {
    const { t } = this.props
    const style = `.m-signature-pad--footer
        .button {
          background-color: #50AA47;
          color: #FFF;
          height: 50px;
          margin-top: 50px;
          margin-bottom: -21px;
          margin-right: -21px;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-family: Poppins;
          font-weight: 600;
          font-size: 18px;
          width: 58%;
        }
        .button.clear {
          margin-left: -21px;
          margin-right: 0px;
          text-decoration-line: underline;
          text-decoration-style: solid;
          text-decoration-color: #50AA47;
          background-color: #FFFFFF;
          color: #50AA47;
          font-size:14px;
          }`
    return (
      <SignatureCapture
        style={[{ flex: 1 }, styles.signature]}
        ref="sign"
        onSaveEvent={this.onSave}
        saveImageFileInExtStorage={false}
        showNativeButtons={false}
        showTitleLabel={false}
        viewMode={'portrait'}
      />
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
