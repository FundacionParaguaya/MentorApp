import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { withNamespaces } from 'react-i18next'
import TextInput from '../../components/TextInput'
import globalStyles from '../../globalStyles'
import Select from '../../components/Select'
import DateInputComponent from '../../components/DateInput'

export class FamilyMember extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Family Member')
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
          readonly
          placeholder={`${t('views.family.firstName')}`}
          value={member.firstName}
          onChangeText={() => {}}
        />
        <Select
          onChange={() => {}}
          readonly
          placeholder={t('views.family.gender')}
          value={member.gender}
          options={[
            { text: 'Male', value: 'M' },
            { text: 'Female', value: 'F' },
            { text: 'Other', value: 'O' },
            { text: 'I prefer not to answer', value: 'N' }
          ]}
        />
        <DateInputComponent
          label={t('views.family.dateOfBirth')}
          value={member.birthDate}
          readonly
          detectError={() => {}}
          onValidDate={() => {}}
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
  }
})

export default withNamespaces()(FamilyMember)
