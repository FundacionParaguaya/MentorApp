import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'
import SignatureCapture from 'react-native-signature-capture'
import { connect } from 'react-redux'

import Button from '../../components/Button'
import ProgressBar from '../../components/ProgressBar'
import { updateDraft } from '../../redux/actions'
import { getTotalEconomicScreens } from './helpers'

export class SigIn extends Component {
  survey = this.props.navigation.getParam('survey')
  draftId = this.props.navigation.getParam('draftId')

  // the draft is not mutated in this screen (only its progress),
  // we need it for progress bar
  draft = this.props.drafts.find(draft => draft.draftId === this.draftId)

  isEmpty = true

  displaySign = false

  setEmpty = isEmpty => {
    this.isEmpty = isEmpty
  }

  setDisplay = displaySign => {
    this.displaySign = displaySign
  }

  onPressBack = () => {
    this.props.navigation.navigate('Picture', {
      survey: this.props.navigation.getParam('survey'),
      draftId: this.draftId
    })
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
    if (this.draft.sign) {
      this.setEmpty(false)
      this.setDisplay(true)
    }

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  handleContinue = () => {
    this.sign && this.sign.saveImage()
    if (!this.isEmpty) {
      this.props.navigation.push('Final', {
        familyLifemap: this.draft,
        draft: this.draft,
        draftId: this.draftId,
        survey: this.survey
      })
    }
  }

  _onSaveEvent(result) {
    let updatedDraft = this.draft
    updatedDraft.sign = 'data:image/png;base64,' + result.encoded
    this.updateDraft(updatedDraft)
  }

  _onDragEvent() {
    this.setEmpty(false)
  }

  onClear = () => {
    this.setEmpty(true)
    this.setDisplay(false)
    this.sign && this.sign.resetImage()
    let updatedDraft = this.draft
    updatedDraft.sign = ''
    this.props.updateDraft(updatedDraft)
  }

  render() {
    const { t } = this.props
    if (this.draft.sign) {
      this.setEmpty(false)
      this.setDisplay(true)
    }
    return (
      <View style={styles.contentContainer}>
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
        {this.displaySign ? (
          <Image style={styles.container} source={{ uri: this.draft.sign }} />
        ) : (
          <SignatureCapture
            style={styles.container}
            key={'sign'}
            ref={r => {
              this.sign = r
            }}
            onSaveEvent={this._onSaveEvent}
            onDragEvent={this._onDragEvent}
            saveImageFileInExtStorage={false}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={'portrait'}
            draft={this.draft}
            updateDraft={this.props.updateDraft}
            setEmpty={this.setEmpty}
            setDisplay={this.setDisplay}
          />
        )}
        <View style={styles.buttonsBar}>
          <Button
            id="erase"
            text={t('views.sign.erase')}
            underlined
            handleClick={this.onClear}
          />
          <Button
            id="continue"
            colored
            text={t('general.continue')}
            handleClick={this.handleContinue}
          />
        </View>
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
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 48,
    height: 900,
    borderColor: '#000033'
  },
  iconPriority: {
    height: 40,
    width: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  buttonsBar: {
    height: 50,
    marginTop: 50,
    marginBottom: -2,
    flexDirection: 'row'
  },
  contentContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
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
