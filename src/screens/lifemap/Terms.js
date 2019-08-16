import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import RoundImage from '../../components/RoundImage'
import Button from '../../components/Button'
import Decoration from '../../components/decoration/Decoration'

// this describes which screen comes after which
const navigationRules = {
  terms: {
    nextPage: 'Privacy',
    param: 'privacy'
  },
  privacy: {
    nextPage: 'FamilyParticipant'
  }
}

export class Terms extends Component {
  survey = this.props.navigation.getParam('survey')
  page = this.props.navigation.getParam('page')

  onClickDisagree = () => {
    this.props.navigation.navigate('ExitDraftModal')
  }

  onClickAgree = () => {
    const { navigation } = this.props

    navigation.navigate(navigationRules[this.page].nextPage, {
      page: navigationRules[this.page].param || null,
      survey: this.survey
    })
  }

  render() {
    const { t } = this.props

    const page = this.page

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={globalStyles.container}>
          <Decoration variation="terms">
            <RoundImage source="check" />
          </Decoration>
          <Text id="title" style={[globalStyles.h2Bold, styles.heading]}>
            {page === 'terms'
              ? this.survey.termsConditions.title
              : this.survey.privacyPolicy.title}
          </Text>

          <Text id="content" style={[globalStyles.subline, styles.content]}>
            {page === 'terms' &&
              this.survey.termsConditions.text &&
              this.survey.termsConditions.text.replace(/\\n/g, '\n')}
            {page !== 'terms' &&
              this.survey.privacyPolicy.text &&
              this.survey.privacyPolicy.text.replace(/\\n/g, '\n')}
          </Text>
        </View>
        <View style={styles.buttonsBar}>
          <Button
            id="dissagree"
            text={t('general.disagree')}
            underlined
            handleClick={this.onClickDisagree}
          />
          <Button
            id="agree"
            colored
            text={t('general.agree')}
            handleClick={this.onClickAgree}
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
  heading: {
    color: colors.dark,
    textAlign: 'center'
  },
  content: {
    marginTop: 25
  },
  buttonsBar: {
    height: 50,
    marginTop: 50,
    marginBottom: -2,
    flexDirection: 'row'
  }
})

Terms.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(Terms)
