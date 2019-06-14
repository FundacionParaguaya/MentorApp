import React, { Component } from 'react'
import { StyleSheet, ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import globalStyles from '../globalStyles'
import Decoration from '../components/decoration/Decoration'
import colors from '../theme.json'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '../components/Button'
import StickyFooter from '../components/StickyFooter'

export class TheFamily extends Component {
  componentDidMount() {
    // this.props.navigation.setParams({
    //   onPressBack: this.onPressBack
    // })
  }

  // onPressBack = () => {
  //   this.props.navigation.navigate('Surveys')
  // }

  navigateToScreen = (screen, params) => {
    this.props.navigation.navigate(
      screen,
      !!params && Object.keys(params).length ? { ...params } : {}
    )
  }

  render() {
    return (
      <StickyFooter
        style={{ ...globalStyles.container, padding: 0 }}
        progress={1 / 50}
        visible={false}
      >
        <Text style={[globalStyles.h2, styles.heading]}>
          Is it the first time that this family makes a life map?{' '}
        </Text>
        <Decoration variation="theFamily">
          <View style={styles.circleContainer}>
            <Text style={styles.circle}>?</Text>
            <Icon
              name="face"
              color={colors.grey}
              size={61}
              style={styles.icon}
            />
          </View>
        </Decoration>
        <View style={styles.buttonBar}>
          <Button
            outlined
            text={this.props.t('general.yes')}
            style={{ width: 107, marginRight: 10 }}
            handleClick={() =>
              this.props.navigation.navigate('FamilyParticipant', {
                page: 'terms',
                survey: this.props.navigation.getParam('survey')
              })
            }
          />
          <Button
            outlined
            text={this.props.t('general.no')}
            style={{ width: 107, marginLeft: 10 }}
            handleClick={() =>
              this.props.navigation.navigate('ChooseFamily', {
                retakeSurvey: true,
                survey: this.props.navigation.getParam('survey')
              })
            }
          />
        </View>
      </StickyFooter>
    )
  }
}
const styles = StyleSheet.create({
  heading: {
    alignSelf: 'center',
    textAlign: 'center',
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    color: colors.dark
  },
  icon: {
    alignSelf: 'center'
  },
  circleContainer: {
    marginTop: 20,
    position: 'relative'
  },
  circle: {
    position: 'absolute',
    width: 22,
    height: 22,
    lineHeight: 22,
    left: '50%',
    textAlign: 'center',
    fontSize: 10,
    transform: [{ translateX: 3 }, { translateY: -3 }],
    borderRadius: 50,
    backgroundColor: colors.lightgrey,
    zIndex: 1
  },
  buttonBar: {
    flexDirection: 'row',
    marginTop: 50,
    justifyContent: 'center'
  }
})

TheFamily.propTypes = {
  navigation: PropTypes.object.isRequired,
  t: PropTypes.func
}

export default withNamespaces()(TheFamily)
