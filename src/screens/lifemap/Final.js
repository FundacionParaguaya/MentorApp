import React, { Component } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import RoundImage from '../../components/RoundImage'
import LifemapVisual from '../../components/LifemapVisual'
import Button from '../../components/Button'
import globalStyles from '../../globalStyles'
import { submitDraft, addDraftProgress } from '../../redux/actions'
import { url } from '../../config'
import { getDraft } from './helpers'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export class Final extends Component {
  shouldComponentUpdate() {
    return this.props.navigation.isFocused()
  }
  componentDidMount() {
    this.props.addDraftProgress(this.props.nav.draftId, {
      screen: 'Final'
    })

    this.props.navigation.setParams({
      onPressBack: this.onPressBack
    })
  }

  onPressBack = () => {
    this.props.navigation.replace('Overview', {
      resumeDraft: false
    })
  }

  render() {
    const { t } = this.props
    const draft = getDraft()

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
            questionsLength={
              this.props.nav.survey.surveyStoplightQuestions.length
            }
            priorities={draft.priorities}
            achievements={draft.achievements}
          />

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('TakePicture')}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fafafa',
                  textAlign: 'auto',
                  borderWidth: 2,
                  borderColor: '#ddd',
                  borderRadius: 2,
                  marginBottom: 20,
                  marginTop: 20,
                  borderStyle: 'dotted',
                  paddingVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Icon style={{ alignSelf: 'center' }} name="camera" size={40} />
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('TakePicture')}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#eee',
                  textAlign: 'auto',
                  marginBottom: 20,
                  marginTop: 20,
                  paddingVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <Icon
                  style={{ alignSelf: 'center' }}
                  name="folder-outline"
                  size={40}
                />
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{ height: 50 }}>
          <Button
            colored
            text={t('general.close')}
            handleClick={() => {
              this.props.submitDraft(
                url[this.props.env],
                this.props.user.token,
                this.props.nav.draftId,
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
  nav: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  submitDraft: PropTypes.func.isRequired,
  addDraftProgress: PropTypes.func.isRequired,
  env: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = ({ nav, env, user }) => ({
  env,
  nav,
  user
})
const mapDispatchToProps = {
  submitDraft,
  addDraftProgress
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Final)
)
