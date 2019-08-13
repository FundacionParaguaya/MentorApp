import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { withNamespaces } from 'react-i18next'
import TextInput from '../../components/form/TextInput'
import globalStyles from '../../globalStyles'
import Select from '../../components/form/Select'
import DateInput from '../../components/form/DateInput'
import colors from '../../theme.json'

export class FamilyMember extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text
          accessibilityLiveRegion="assertive"
          style={styles.headerTitleStyle}
        >
          {navigation.getParam('member').firstName}
          {/* {navigation.getParam('title', 'Family Member')} */}
        </Text>
      )
    }
  }
  setTitle() {
    this.props.navigation.setParams({
      title: this.props.navigation.getParam('member').firstName
    })
  }

  componentDidMount() {
    if (this.props.navigation.getParam('member')) {
      this.setTitle()
    }
  }
  render() {
    const { t } = this.props
    const member = this.props.navigation.getParam('member')
    return (
      <View style={[globalStyles.background, styles.contentContainer]}>
        <TextInput
          id="readOnlyTextInput"
          placeholder={t('views.family.firstName')}
          initialValue={member.firstName}
          readonly
          onChangeText={() => {}}
          setError={() => {}}
        />

        <Select
          onChange={() => {}}
          readonly
          placeholder={t('views.family.gender')}
          initialValue={member.gender}
          options={[
            { text: 'Male', value: 'M' },
            { text: 'Female', value: 'F' },
            { text: 'Other', value: 'O' },
            { text: 'I prefer not to answer', value: 'N' }
          ]}
          setError={() => {}}
        />
        <DateInput
          label={t('views.family.dateOfBirth')}
          initialValue={member.birthDate}
          readonly
          detectError={() => {}}
          onValidDate={() => {}}
          setError={() => {}}
        />
      </View>
    )
  }
}

FamilyMember.propTypes = {
  t: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    flexDirection: 'column'
  },
  headerTitleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: 'Poppins'
      },
      android: {
        fontFamily: 'Poppins SemiBold'
      }
    }),
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 26,
    color: colors.black,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
})

export default withNamespaces()(FamilyMember)
