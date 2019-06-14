import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import globalStyles from '../../globalStyles'
import colors from '../../theme.json'
import RoundImage from '../../components/RoundImage'
import Button from '../../components/Button'
import Decoration from '../../components/decoration/Decoration'

// which screen comes after which
const navigationRules = {
  terms: {
    nextPage: 'Privacy',
    param: 'privacy'
  },
  privacy: {
    nextPage: 'TheFamily',
    param: 'TheFamily'
  }
}

export class Terms extends Component {
  render() {
    const { t, navigation } = this.props
    const survey = navigation.getParam('survey')

    const page = navigation.getParam('page')

    return (
      <ScrollView
        style={globalStyles.background}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={globalStyles.container}>
          <Decoration variation="terms">
            <RoundImage source="check" />
          </Decoration>
          <Text style={[globalStyles.h2Bold, styles.heading]}>
            {page === 'terms'
              ? survey.termsConditions.title
              : survey.privacyPolicy.title}
          </Text>

          <Text id="content" style={[globalStyles.subline, styles.content]}>
            {page === 'terms' &&
              survey.termsConditions.text &&
              survey.termsConditions.text.replace(/\\n/g, '\n')}
            {page !== 'terms' &&
              survey.privacyPolicy.text &&
              survey.privacyPolicy.text.replace(/\\n/g, '\n')}
          </Text>
        </View>
        <View style={styles.buttonsBar}>
          <Button
            id="dissagree"
            text={t('general.disagree')}
            underlined
            handleClick={() => navigation.setParams({ modalOpen: true })}
          />
          <Button
            id="agree"
            colored
            text={t('general.agree')}
            handleClick={() =>
              navigation.navigate(
                navigationRules[navigation.getParam('page')].nextPage,
                {
                  page: navigationRules[navigation.getParam('page')].param,
                  survey
                }
              )
            }
          />
        </View>
      </ScrollView>
    )
  }
}

Terms.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

export default withNamespaces()(Terms)

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
